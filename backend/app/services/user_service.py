import uuid
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.user import user_repo
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password
from sqlalchemy import select
from app.database.models.profile import Preference
from fastapi import HTTPException, status

class UserService:
    async def get_user(self, db: AsyncSession, user_id: int):
        return await user_repo.get(db, id=user_id)
        
    async def get_user_by_email(self, db: AsyncSession, email: str):
        return await user_repo.get_by_email(db, email=email)

    async def get_user_by_phone(self, db: AsyncSession, phone: str):
        return await user_repo.get_by_phone(db, phone=phone)

    async def create_user(self, db: AsyncSession, user_in: UserCreate):
        user_code = f"USR-{uuid.uuid4().hex[:8].upper()}"
        hashed_password = get_password_hash(user_in.password)
        
        user_data = user_in.model_dump(exclude={"password", "role"})
        user_data["user_code"] = user_code
        user_data["password_hash"] = hashed_password
        
        return await user_repo.create(db, obj_in=user_data)

    async def update_user(self, db: AsyncSession, db_user, user_in: UserUpdate):
        update_data = user_in.model_dump(exclude_unset=True)
        return await user_repo.update(db, db_obj=db_user, obj_in=update_data)

    async def delete_user(self, db: AsyncSession, user_id: int):
        return await user_repo.delete(db, id=user_id)

    async def update_password(self, db: AsyncSession, user, current_password: str, new_password: str):
        if not verify_password(current_password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect current password")
        
        user.password_hash = get_password_hash(new_password)
        await db.commit()
        return user

    async def get_preferences(self, db: AsyncSession, user_id: int):
        result = await db.execute(select(Preference).where(Preference.user_id == user_id))
        prefs = result.scalars().all()
        return {p.key: (p.value.lower() == 'true') for p in prefs}

    async def update_preferences(self, db: AsyncSession, user_id: int, preferences: dict):
        # Fetch existing
        result = await db.execute(select(Preference).where(Preference.user_id == user_id))
        existing_prefs = {p.key: p for p in result.scalars().all()}
        
        for key, val in preferences.items():
            str_val = "true" if val else "false"
            if key in existing_prefs:
                existing_prefs[key].value = str_val
            else:
                new_pref = Preference(user_id=user_id, key=key, value=str_val, group="NOTIFICATION")
                db.add(new_pref)
        
        await db.commit()
        return await self.get_preferences(db, user_id)

user_service = UserService()
