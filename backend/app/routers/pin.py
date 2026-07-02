from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.hash import argon2
from datetime import datetime, timedelta

from app.database.connection import get_db
from app.core.deps import get_current_user
from app.database.models.auth import User
from app.database.models.pin import UserQuickPin
from app.schemas.auth import AuthResponse
from app.schemas.quick_access import PinSetupRequest, PinLoginRequest, PinChangeRequest
from app.schemas.user import UserOut
from app.services.auth_service import auth_service
from app.services.user_service import user_service
from app.core.limiter import limiter
from app.core.security import verify_csrf_token

router = APIRouter(prefix="/auth/pin", tags=["Quick PIN Authentication"])

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 15

@router.post("/setup", response_model=AuthResponse)
@limiter.limit("5/minute")
async def setup_pin(request: Request, setup_data: PinSetupRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=True)
    
    if not (4 <= len(setup_data.pin) <= 6) or not setup_data.pin.isdigit():
        raise HTTPException(status_code=400, detail="PIN must be 4 to 6 digits")
        
    query = select(UserQuickPin).filter(UserQuickPin.user_id == current_user.id)
    result = await db.execute(query)
    existing_pin = result.scalars().first()
    
    pin_hash = argon2.hash(setup_data.pin)
    
    if existing_pin:
        existing_pin.pin_hash = pin_hash
        existing_pin.is_active = True
        existing_pin.failed_attempts = 0
        existing_pin.locked_until = None
    else:
        new_pin = UserQuickPin(
            user_id=current_user.id,
            pin_hash=pin_hash
        )
        db.add(new_pin)
        
    await db.commit()
    
    return AuthResponse(
        success=True,
        message="Quick PIN configured successfully",
        data={}
    )

@router.post("/change", response_model=AuthResponse)
@limiter.limit("5/minute")
async def change_pin(request: Request, change_data: PinChangeRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=True)
    
    query = select(UserQuickPin).filter(UserQuickPin.user_id == current_user.id, UserQuickPin.is_active == True)
    result = await db.execute(query)
    quick_pin = result.scalars().first()
    
    if not quick_pin:
        raise HTTPException(status_code=400, detail="Quick PIN not configured")
        
    if not argon2.verify(change_data.old_pin, quick_pin.pin_hash):
        raise HTTPException(status_code=401, detail="Incorrect old PIN")
        
    if not (4 <= len(change_data.new_pin) <= 6) or not change_data.new_pin.isdigit():
        raise HTTPException(status_code=400, detail="New PIN must be 4 to 6 digits")
        
    quick_pin.pin_hash = argon2.hash(change_data.new_pin)
    await db.commit()
    
    return AuthResponse(
        success=True,
        message="Quick PIN changed successfully",
        data={}
    )

@router.post("/disable", response_model=AuthResponse)
@limiter.limit("5/minute")
async def disable_pin(request: Request, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=True)
    
    query = select(UserQuickPin).filter(UserQuickPin.user_id == current_user.id)
    result = await db.execute(query)
    quick_pin = result.scalars().first()
    
    if quick_pin:
        quick_pin.is_active = False
        await db.commit()
        
    return AuthResponse(
        success=True,
        message="Quick PIN disabled successfully",
        data={}
    )

@router.post("/login", response_model=AuthResponse)
@limiter.limit("5/minute")
async def login_pin(request: Request, response: Response, login_data: PinLoginRequest, db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=True)
    
    # Identifier can be email or phone
    user = await user_service.get_user_by_email(db, email=login_data.identifier)
    if not user:
        user = await user_service.get_user_by_phone(db, phone=login_data.identifier)
        
    if not user:
        raise HTTPException(status_code=401, detail="Invalid identifier or PIN")
        
    if user.status != "ACTIVE":
        raise HTTPException(status_code=400, detail="Inactive user")
        
    query = select(UserQuickPin).filter(UserQuickPin.user_id == user.id, UserQuickPin.is_active == True)
    result = await db.execute(query)
    quick_pin = result.scalars().first()
    
    if not quick_pin:
        raise HTTPException(status_code=401, detail="Quick PIN not configured for this account")
        
    if quick_pin.locked_until and quick_pin.locked_until > datetime.utcnow():
        raise HTTPException(status_code=429, detail="Account locked due to too many failed attempts. Try again later.")
        
    if not argon2.verify(login_data.pin, quick_pin.pin_hash):
        quick_pin.failed_attempts += 1
        if quick_pin.failed_attempts >= MAX_FAILED_ATTEMPTS:
            quick_pin.locked_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_DURATION_MINUTES)
            quick_pin.failed_attempts = 0
        await db.commit()
        raise HTTPException(status_code=401, detail="Invalid identifier or PIN")
        
    # Success
    quick_pin.failed_attempts = 0
    quick_pin.locked_until = None
    await db.commit()
    
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
