from typing import AsyncGenerator, Optional, List
from enum import Enum
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.security.utils import get_authorization_scheme_param
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.connection import get_db
from app.config import settings
from app.database.models.auth import User, Role, UserRole

class RoleName(str, Enum):
    SUPER_ADMIN = "Super Admin"
    ADMIN = "Admin"
    OWNER = "Owner"
    DRIVER = "Driver"
    RENTER = "Renter"
    SUPPORT = "Support"

class OAuth2PasswordBearerWithCookie(OAuth2PasswordBearer):
    async def __call__(self, request: Request) -> Optional[str]:
        authorization = request.headers.get("Authorization")
        scheme, param = get_authorization_scheme_param(authorization)
        if not authorization or scheme.lower() != "bearer":
            # Try to get from cookie
            cookie_token = request.cookies.get("access_token")
            if cookie_token:
                # If cookie value includes Bearer, strip it
                if cookie_token.lower().startswith("bearer "):
                    return cookie_token[7:]
                return cookie_token
            
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            else:
                return None
        return param

oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="/api/auth/login")

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    stmt = select(User).where(User.id == int(user_id))
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.status != "ACTIVE":
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_admin(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> User:
    if current_user.is_superadmin:
        return current_user
        
    stmt = (
        select(Role.name)
        .join(UserRole, UserRole.role_id == Role.id)
        .where(UserRole.user_id == current_user.id)
    )
    result = await db.execute(stmt)
    user_roles = result.scalars().all()
    
    if RoleName.ADMIN.value not in user_roles and RoleName.SUPER_ADMIN.value not in user_roles:
        raise HTTPException(status_code=403, detail="Not enough privileges")
        
    return current_user

def require_role(allowed_roles: List[str]):
    async def role_checker(
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
    ) -> User:
        if current_user.is_superadmin:
            return current_user
            
        stmt = (
            select(Role.name)
            .join(UserRole, UserRole.role_id == Role.id)
            .where(UserRole.user_id == current_user.id)
        )
        result = await db.execute(stmt)
        user_roles = result.scalars().all()
        
        has_role = any(role in user_roles for role in allowed_roles)
        if not has_role:
            raise HTTPException(status_code=403, detail="Not enough privileges")
            
        return current_user
        
    return role_checker
