from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.base import BaseRepository
from app.database.models.booking import Booking

class BookingRepository(BaseRepository[Booking]):
    async def get_by_renter(self, db: AsyncSession, renter_id: int, skip: int = 0, limit: int = 100) -> List[Booking]:
        query = select(self.model).filter(
            self.model.renter_id == renter_id,
            self.model.deleted_at.is_(None)
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def get_by_owner(self, db: AsyncSession, owner_id: int, skip: int = 0, limit: int = 100) -> List[Booking]:
        query = select(self.model).filter(
            self.model.owner_id == owner_id,
            self.model.deleted_at.is_(None)
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())
        
    async def get_by_driver(self, db: AsyncSession, driver_id: int, skip: int = 0, limit: int = 100) -> List[Booking]:
        query = select(self.model).filter(
            self.model.driver_id == driver_id,
            self.model.deleted_at.is_(None)
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def check_availability(self, db: AsyncSession, equipment_id: int, start_date, end_date) -> bool:
        from sqlalchemy import and_, or_
        query = select(self.model).filter(
            self.model.equipment_id == equipment_id,
            self.model.status.in_(["APPROVED", "ACTIVE"]),
            self.model.deleted_at.is_(None),
            and_(
                self.model.start_date < end_date,
                self.model.end_date > start_date
            )
        )
        result = await db.execute(query)
        conflicts = result.scalars().all()
        return len(conflicts) == 0

booking_repo = BookingRepository(Booking)
