from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, AuthResponse, SendOTPRequest, VerifyOTPRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.schemas.user import UserOut
from app.services.auth_service import auth_service
from app.core.deps import get_current_user
from app.database.models.auth import User
from app.core.limiter import limiter
import uuid
from jose import jwt, JWTError
from app.config import settings
from app.services.user_service import user_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

from app.core.security import verify_csrf_token

@router.get("/csrf-token")
@limiter.limit("20/minute")
async def get_csrf_token(request: Request, response: Response):
    csrf_token = str(uuid.uuid4())
    response.set_cookie(
        key="csrf_token",
        value=csrf_token,
        httponly=False,
        secure=False,
        samesite="lax",
    )
    return {"success": True, "message": "CSRF token set"}

@router.post("/login", response_model=AuthResponse)
@limiter.limit("5/minute")
async def login(request: Request, response: Response, login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=True)
    user = await auth_service.authenticate(db, login_data)
    tokens = auth_service.create_tokens_for_user(user)
    
    response.set_cookie(key="access_token", value=tokens["access_token"], httponly=True, secure=False, samesite="lax", max_age=15 * 60)
    response.set_cookie(key="refresh_token", value=tokens["refresh_token"], httponly=True, secure=False, samesite="lax", max_age=7 * 24 * 60 * 60)
    
    return AuthResponse(
        success=True,
        message="Login successful",
        data={
            "user": UserOut.model_validate(user).model_dump()
        }
    )

@router.post("/logout", response_model=AuthResponse)
@limiter.limit("10/minute")
async def logout(request: Request, response: Response):
    verify_csrf_token(request, force=True)
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return AuthResponse(
        success=True,
        message="Logout successful",
        data={}
    )

@router.post("/refresh", response_model=AuthResponse)
@limiter.limit("10/minute")
async def refresh_token(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=True)
    refresh_token_cookie = request.cookies.get("refresh_token")
    if not refresh_token_cookie:
        raise HTTPException(status_code=401, detail="Refresh token missing")
        
    try:
        payload = jwt.decode(refresh_token_cookie, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    user = await user_service.get_user(db, int(user_id))
    if not user or user.status != "ACTIVE":
        raise HTTPException(status_code=401, detail="User not found or inactive")
        
    tokens = auth_service.create_tokens_for_user(user)
    
    response.set_cookie(key="access_token", value=tokens["access_token"], httponly=True, secure=False, samesite="lax", max_age=15 * 60)
    response.set_cookie(key="refresh_token", value=tokens["refresh_token"], httponly=True, secure=False, samesite="lax", max_age=7 * 24 * 60 * 60)
    
    return AuthResponse(
        success=True,
        message="Token refreshed successfully",
        data={}
    )

@router.post("/register", response_model=AuthResponse)
@limiter.limit("5/minute")
async def register(request: Request, response: Response, register_data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=True)
    user = await auth_service.register(db, register_data)
    tokens = auth_service.create_tokens_for_user(user)
    
    response.set_cookie(key="access_token", value=tokens["access_token"], httponly=True, secure=False, samesite="lax", max_age=15 * 60)
    response.set_cookie(key="refresh_token", value=tokens["refresh_token"], httponly=True, secure=False, samesite="lax", max_age=7 * 24 * 60 * 60)
    
    return AuthResponse(
        success=True,
        message="Registration successful",
        data={
            "user": UserOut.model_validate(user).model_dump()
        }
    )

@router.post("/send-otp", response_model=AuthResponse)
@limiter.limit("5/minute")
async def send_otp(request: Request, otp_data: SendOTPRequest, db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=True)
    await auth_service.send_otp(db, otp_data)
    
    return AuthResponse(
        success=True,
        message=f"OTP sent successfully to {otp_data.phone}",
        data={}
    )

@router.post("/verify-otp", response_model=AuthResponse)
@limiter.limit("5/minute")
async def verify_otp(request: Request, response: Response, verify_data: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=True)
    user = await auth_service.verify_otp(db, verify_data)
    
    data = {}
    if verify_data.purpose == "LOGIN" and user:
        tokens = auth_service.create_tokens_for_user(user)
        response.set_cookie(key="access_token", value=tokens["access_token"], httponly=True, secure=False, samesite="lax", max_age=15 * 60)
        response.set_cookie(key="refresh_token", value=tokens["refresh_token"], httponly=True, secure=False, samesite="lax", max_age=7 * 24 * 60 * 60)
        data = {
            "user": UserOut.model_validate(user).model_dump()
        }
        
    return AuthResponse(
        success=True,
        message="OTP verified successfully",
        data=data
    )

@router.post("/forgot-password", response_model=AuthResponse)
@limiter.limit("3/minute")
async def forgot_password(request: Request, forgot_data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=True)
    await auth_service.forgot_password(db, forgot_data)
    
    return AuthResponse(
        success=True,
        message="If that email is registered, an OTP has been sent.",
        data={}
    )

@router.post("/reset-password", response_model=AuthResponse)
@limiter.limit("3/minute")
async def reset_password(request: Request, reset_data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=True)
    await auth_service.reset_password(db, reset_data)
    
    return AuthResponse(
        success=True,
        message="Password reset successfully",
        data={}
    )

@router.get("/me", response_model=UserOut)
@limiter.limit("20/minute")
async def get_me(request: Request, current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/security-status")
@limiter.limit("20/minute")
async def get_security_status(request: Request, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    from app.database.models.passkey import UserPasskey
    from app.database.models.pin import UserQuickPin
    
    passkey_query = select(UserPasskey).filter(UserPasskey.user_id == current_user.id, UserPasskey.is_active == True)
    passkey_result = await db.execute(passkey_query)
    passkeys = passkey_result.scalars().all()
    
    pin_query = select(UserQuickPin).filter(UserQuickPin.user_id == current_user.id, UserQuickPin.is_active == True)
    pin_result = await db.execute(pin_query)
    quick_pin = pin_result.scalars().first()
    
    return {
        "success": True,
        "data": {
            "has_passkey": len(passkeys) > 0,
            "passkeys": [{"id": p.id, "device_name": p.device_name, "created_at": p.created_at} for p in passkeys],
            "has_pin": quick_pin is True if quick_pin else False # using boolean for has_pin
        }
    }

@router.get("/login-options")
@limiter.limit("20/minute")
async def get_login_options(identifier: str, request: Request, db: AsyncSession = Depends(get_db)):
    from app.services.user_service import user_service
    from sqlalchemy import select
    from app.database.models.passkey import UserPasskey
    from app.database.models.pin import UserQuickPin
    
    user = await user_service.get_user_by_email(db, email=identifier)
    if not user:
        user = await user_service.get_user_by_phone(db, phone=identifier)
        
    if not user or user.status != "ACTIVE":
        return {"success": True, "data": {"has_password": True, "has_pin": False, "has_passkey": False}}
        
    pin_query = select(UserQuickPin).filter(UserQuickPin.user_id == user.id, UserQuickPin.is_active == True)
    pin_result = await db.execute(pin_query)
    has_pin = pin_result.scalars().first() is not None
    
    return {
        "success": True,
        "data": {
            "has_password": True,
            "has_pin": has_pin,
            "has_passkey": True # Always allow passkey discovery if device has it
        }
    }
