from pydantic import BaseModel, EmailStr
from typing import Optional, Any
from app.schemas.user import UserOut

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    success: bool = True
    message: str = "Login successful"
    data: dict  # Will hold user and token info
    errors: Optional[Any] = None

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    password: str
    country_code: str = "+91"
    role: str = "USER"
    otp: str

class SendOTPRequest(BaseModel):
    phone: str
    purpose: str = "LOGIN" # LOGIN, REGISTER, RESET, VERIFY

class VerifyOTPRequest(BaseModel):
    phone: str
    code: str
    purpose: str = "LOGIN"

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str
