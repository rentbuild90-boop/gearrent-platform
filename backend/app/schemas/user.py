from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    country_code: str = "+91"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None

class UserUpdatePassword(BaseModel):
    current_password: str
    new_password: str

class UserPreferencesUpdate(BaseModel):
    notifications: Dict[str, bool]

class UserOut(UserBase):
    id: int
    user_code: str
    status: str
    is_superadmin: bool
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[UserOut] = None
    errors: Optional[Any] = None
