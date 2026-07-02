from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.base import BaseRepository
from app.database.models.auth import User

class UserRepository(BaseRepository[User]):
    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        query = select(self.model).filter(self.model.email == email, self.model.deleted_at.is_(None))
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_phone(self, db: AsyncSession, phone: str) -> Optional[User]:
        query = select(self.model).filter(self.model.phone == phone, self.model.deleted_at.is_(None))
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_user_code(self, db: AsyncSession, user_code: str) -> Optional[User]:
        query = select(self.model).filter(self.model.user_code == user_code, self.model.deleted_at.is_(None))
        result = await db.execute(query)
        return result.scalars().first()

user_repo = UserRepository(User)
