from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from webauthn import generate_registration_options, verify_registration_response, generate_authentication_options, verify_authentication_response
from webauthn.helpers.structs import RegistrationCredential, AuthenticationCredential, AuthenticatorSelectionCriteria, UserVerificationRequirement, AuthenticatorAttachment, PublicKeyCredentialDescriptor
from webauthn.helpers.exceptions import InvalidRegistrationResponse, InvalidAuthenticationResponse
from jose import jwt, JWTError
import json
import base64

from app.database.connection import get_db
from app.core.deps import get_current_user
from app.database.models.auth import User
from app.database.models.passkey import UserPasskey
from app.schemas.auth import AuthResponse
from app.schemas.quick_access import RegisterChallengeResponse, RegisterVerifyRequest, AuthenticateChallengeResponse, AuthenticateVerifyRequest
from app.schemas.user import UserOut
from app.config import settings
from app.services.auth_service import auth_service
from app.core.limiter import limiter
from app.core.security import verify_csrf_token

router = APIRouter(prefix="/auth/passkey", tags=["Passkey Authentication"])

def get_challenge_token(challenge: bytes) -> str:
    payload = {"challenge": base64.b64encode(challenge).decode('utf-8')}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_challenge_token(token: str) -> bytes:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return base64.b64decode(payload["challenge"])
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid challenge token")

@router.post("/register-challenge", response_model=AuthResponse)
@limiter.limit("5/minute")
async def register_challenge(request: Request, response: Response, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=True)
    
    # Get existing passkeys to exclude them
    query = select(UserPasskey).filter(UserPasskey.user_id == current_user.id, UserPasskey.is_active == True)
    result = await db.execute(query)
    existing_passkeys = result.scalars().all()
    
    exclude_credentials = [
        PublicKeyCredentialDescriptor(id=base64.b64decode(p.credential_id))
        for p in existing_passkeys
    ]
    
    options = generate_registration_options(
        rp_id=settings.WEBAUTHN_RP_ID,
        rp_name=settings.WEBAUTHN_RP_NAME,
        user_id=str(current_user.id).encode('utf-8'),
        user_name=current_user.email,
        user_display_name=f"{current_user.first_name} {current_user.last_name}",
        exclude_credentials=exclude_credentials,
        authenticator_selection=AuthenticatorSelectionCriteria(
            user_verification=UserVerificationRequirement.PREFERRED,
        ),
    )
    
    challenge_token = get_challenge_token(options.challenge)
    response.set_cookie(key="passkey_challenge", value=challenge_token, httponly=True, secure=False, samesite="lax", max_age=300)
    
    return AuthResponse(
        success=True,
        message="Registration challenge generated",
        data={"options": json.loads(options.json())}
    )

@router.post("/register-verify", response_model=AuthResponse)
@limiter.limit("5/minute")
async def register_verify(request: Request, response: Response, verify_data: RegisterVerifyRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=True)
    
    challenge_token = request.cookies.get("passkey_challenge")
    if not challenge_token:
        raise HTTPException(status_code=400, detail="Challenge missing or expired")
        
    expected_challenge = decode_challenge_token(challenge_token)
    
    try:
        registration_verification = verify_registration_response(
            credential=verify_data.response,
            expected_challenge=expected_challenge,
            expected_rp_id=settings.WEBAUTHN_RP_ID,
            expected_origin=settings.FRONTEND_URL,
        )
    except InvalidRegistrationResponse as e:
        raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")
        
    # Store credential in database
    new_passkey = UserPasskey(
        user_id=current_user.id,
        credential_id=base64.b64encode(registration_verification.credential_id).decode('utf-8'),
        public_key=base64.b64encode(registration_verification.credential_public_key).decode('utf-8'),
        sign_count=registration_verification.sign_count,
        device_name=verify_data.response.get("deviceName", "Unknown Device")
    )
    
    db.add(new_passkey)
    await db.commit()
    
    response.delete_cookie("passkey_challenge")
    
    return AuthResponse(
        success=True,
        message="Passkey registered successfully",
        data={}
    )

@router.post("/authenticate-challenge", response_model=AuthResponse)
@limiter.limit("5/minute")
async def authenticate_challenge(request: Request, response: Response):
    # Public endpoint, no current_user
    verify_csrf_token(request, force=False)
    
    options = generate_authentication_options(
        rp_id=settings.WEBAUTHN_RP_ID,
        user_verification=UserVerificationRequirement.PREFERRED,
    )
    
    challenge_token = get_challenge_token(options.challenge)
    response.set_cookie(key="passkey_challenge", value=challenge_token, httponly=True, secure=False, samesite="lax", max_age=300)
    
    return AuthResponse(
        success=True,
        message="Authentication challenge generated",
        data={"options": json.loads(options.json())}
    )

@router.post("/authenticate-verify", response_model=AuthResponse)
@limiter.limit("5/minute")
async def authenticate_verify(request: Request, response: Response, verify_data: AuthenticateVerifyRequest, db: AsyncSession = Depends(get_db)):
    verify_csrf_token(request, force=False)
    
    challenge_token = request.cookies.get("passkey_challenge")
    if not challenge_token:
        raise HTTPException(status_code=400, detail="Challenge missing or expired")
        
    expected_challenge = decode_challenge_token(challenge_token)
    
    credential_id_b64 = verify_data.response.get("id")
    if not credential_id_b64:
        raise HTTPException(status_code=400, detail="Credential ID missing")
        
    # Standard Base64 vs Base64URL adjustment
    credential_id_b64 = credential_id_b64.replace('-', '+').replace('_', '/')
    pad = len(credential_id_b64) % 4
    if pad:
        credential_id_b64 += '=' * (4 - pad)
    
    query = select(UserPasskey).filter(UserPasskey.credential_id == credential_id_b64, UserPasskey.is_active == True)
    result = await db.execute(query)
    passkey = result.scalars().first()
    
    if not passkey:
        raise HTTPException(status_code=401, detail="Passkey not recognized or deactivated")
        
    try:
        authentication_verification = verify_authentication_response(
            credential=verify_data.response,
            expected_challenge=expected_challenge,
            expected_rp_id=settings.WEBAUTHN_RP_ID,
            expected_origin=settings.FRONTEND_URL,
            credential_public_key=base64.b64decode(passkey.public_key),
            credential_current_sign_count=passkey.sign_count,
        )
    except InvalidAuthenticationResponse as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")
        
    # Update sign count
    passkey.sign_count = authentication_verification.new_sign_count
    await db.commit()
    
    # Authenticate user
    query = select(User).filter(User.id == passkey.user_id, User.status == "ACTIVE")
    result = await db.execute(query)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=401, detail="User inactive or not found")
        
    tokens = auth_service.create_tokens_for_user(user)
    
    response.set_cookie(key="access_token", value=tokens["access_token"], httponly=True, secure=False, samesite="lax", max_age=15 * 60)
    response.set_cookie(key="refresh_token", value=tokens["refresh_token"], httponly=True, secure=False, samesite="lax", max_age=7 * 24 * 60 * 60)
    response.delete_cookie("passkey_challenge")
    
    return AuthResponse(
        success=True,
        message="Login successful",
        data={
            "user": UserOut.model_validate(user).model_dump()
        }
    )
