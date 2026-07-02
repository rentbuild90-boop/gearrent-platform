from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.base import BaseRepository
from app.database.models.equipment import Equipment

class EquipmentRepository(BaseRepository[Equipment]):
    async def get_by_owner(self, db: AsyncSession, owner_id: int, skip: int = 0, limit: int = 100) -> List[Equipment]:
        query = select(self.model).filter(
            self.model.owner_id == owner_id,
            self.model.deleted_at.is_(None)
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def get_available_equipment(
        self, 
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100,
        name: Optional[str] = None,
        category_id: Optional[int] = None,
        city_id: Optional[int] = None
    ) -> List[Equipment]:
        query = select(self.model).filter(
            self.model.status == "AVAILABLE",
            self.model.deleted_at.is_(None)
        )
        if name:
            query = query.filter(self.model.name.ilike(f"%{name}%"))
        if category_id:
            query = query.filter(self.model.category_id == category_id)
        if city_id:
            query = query.filter(self.model.city_id == city_id)
            
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def get_by_category(self, db: AsyncSession, category_id: int, skip: int = 0, limit: int = 100) -> List[Equipment]:
        query = select(self.model).filter(
            self.model.category_id == category_id,
            self.model.status == "AVAILABLE",
            self.model.deleted_at.is_(None)
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

equipment_repo = EquipmentRepository(Equipment)
