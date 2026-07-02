from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.base import BaseRepository
from app.database.models.driver import DriverProfile

class DriverRepository(BaseRepository[DriverProfile]):
    async def get_by_user_id(self, db: AsyncSession, user_id: int) -> Optional[DriverProfile]:
        query = select(self.model).filter(
            self.model.user_id == user_id, 
            self.model.deleted_at.is_(None)
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def get_available_drivers(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[DriverProfile]:
        query = select(self.model).filter(
            self.model.status == "AVAILABLE",
            self.model.kyc_status == "VERIFIED",
            self.model.deleted_at.is_(None)
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

driver_repo = DriverRepository(DriverProfile)
