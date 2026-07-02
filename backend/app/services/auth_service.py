import random
from datetime import datetime, timedelta, timezone
from typing import Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from app.schemas.auth import LoginRequest, RegisterRequest, SendOTPRequest, VerifyOTPRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.schemas.user import UserCreate
from app.services.user_service import user_service
from app.services.sms_service import sms_service
from app.core.security import verify_password, create_access_token, create_refresh_token, get_password_hash
from app.database.models.auth import User, OTPCode, RealtimeOTP

class AuthService:
    async def authenticate(self, db: AsyncSession, login_data: LoginRequest) -> User:
        user = await user_service.get_user_by_email(db, email=login_data.email)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
        if not verify_password(login_data.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
        if user.status != "ACTIVE":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
        return user

    async def register(self, db: AsyncSession, register_data: RegisterRequest) -> User:
        user = await user_service.get_user_by_email(db, email=register_data.email)
        if user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
            
        # Verify the OTP provided by the user
        verify_data = VerifyOTPRequest(
            phone=register_data.phone,
            code=register_data.otp,
            purpose="REGISTER"
        )
        await self.verify_otp(db, verify_data)
            
        # Remove otp from the dict before creating the user
        register_dict = register_data.model_dump()
        register_dict.pop("otp", None)
        
        user_create = UserCreate(**register_dict)
        new_user = await user_service.create_user(db, user_in=user_create)
        # TODO: Assign role to user based on register_data.role
        return new_user

    def create_tokens_for_user(self, user: User) -> Dict[str, str]:
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "refresh_token": refresh_token
        }
        
    async def send_otp(self, db: AsyncSession, otp_data: SendOTPRequest) -> bool:
        user = None
        if otp_data.purpose in ["LOGIN", "RESET"]:
            user = await user_service.get_user_by_phone(db, phone=otp_data.phone)
            if not user:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User with this phone number not found")
                
        # Generate 6-digit code
        code = str(random.randint(100000, 999999))
        code_hash = code # Save OTP in plain text as requested by the user
        
        # Save OTP to database
        expires_at = datetime.utcnow() + timedelta(minutes=5)
        
        otp_entry = OTPCode(
            user_id=user.id if user else None,
            identifier=otp_data.phone,
            code_hash=code_hash,
            channel="SMS",
            purpose=otp_data.purpose,
            expires_at=expires_at
        )
        db.add(otp_entry)
        await db.commit()

        # Save to RealtimeOTP table (valid for 10 minutes)
        realtime_entry = RealtimeOTP(
            phone=otp_data.phone,
            code=code,
            purpose=otp_data.purpose,
            expires_at=datetime.utcnow() + timedelta(minutes=10),
            created_at=datetime.utcnow()
        )
        db.add(realtime_entry)
        await db.commit()
        
        # Call external SMS service
        success = await sms_service.send_otp(phone=otp_data.phone, otp=code)
        if not success:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to send SMS")
            
        return True

    async def verify_otp(self, db: AsyncSession, verify_data: VerifyOTPRequest) -> User:
        # Real-time auto-delete: Clean up any expired realtime OTP codes
        await db.execute(
            text("DELETE FROM realtime_otps WHERE expires_at < :now"),
            {"now": datetime.utcnow()}
        )
        await db.commit()

        # Query realtime_otps table
        query = select(RealtimeOTP).filter(
            RealtimeOTP.phone == verify_data.phone,
            RealtimeOTP.purpose == verify_data.purpose
        ).order_by(RealtimeOTP.created_at.desc())
        
        result = await db.execute(query)
        realtime_entry = result.scalars().first()
        
        if not realtime_entry:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP code or code expired")
            
        if verify_data.code != realtime_entry.code:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid OTP code")
            
        # OTP is valid, remove it from realtime_otps so it cannot be reused
        await db.delete(realtime_entry)
        await db.commit()
        
        # Also mark the corresponding audit log entry in otp_codes table
        audit_query = select(OTPCode).filter(
            OTPCode.identifier == verify_data.phone,
            OTPCode.purpose == verify_data.purpose,
            OTPCode.channel == "SMS"
        ).order_by(OTPCode.created_at.desc())
        result_audit = await db.execute(audit_query)
        otp_entry = result_audit.scalars().first()
        if otp_entry:
            otp_entry.verified_at = datetime.utcnow()
            await db.commit()
        
        user = await user_service.get_user_by_phone(db, phone=verify_data.phone)
        if not user and verify_data.purpose == "LOGIN":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
            
        return user

    async def forgot_password(self, db: AsyncSession, forgot_data: ForgotPasswordRequest) -> bool:
        user = await user_service.get_user_by_email(db, email=forgot_data.email)
        if not user:
            # Prevent user enumeration, return success even if not found
            return True
            
        # Send OTP to user's phone
        otp_request = SendOTPRequest(phone=user.phone, purpose="RESET")
        return await self.send_otp(db, otp_request)

    async def reset_password(self, db: AsyncSession, reset_data: ResetPasswordRequest) -> bool:
        user = await user_service.get_user_by_email(db, email=reset_data.email)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
            
        verify_data = VerifyOTPRequest(
            phone=user.phone,
            code=reset_data.otp,
            purpose="RESET"
        )
        await self.verify_otp(db, verify_data)
        
        user.password_hash = get_password_hash(reset_data.new_password)
        await db.commit()
        return True

auth_service = AuthService()
