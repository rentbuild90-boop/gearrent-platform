from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.base import BaseRepository
from app.database.models.equipment import EquipmentCategory

class CategoryRepository(BaseRepository[EquipmentCategory]):
    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[EquipmentCategory]:
        query = select(self.model).filter(self.model.slug == slug, self.model.deleted_at.is_(None))
        result = await db.execute(query)
        return result.scalars().first()
        
    async def get_active_categories(self, db: AsyncSession) -> List[EquipmentCategory]:
        query = select(self.model).filter(
            self.model.is_active == True,
            self.model.deleted_at.is_(None)
        ).order_by(self.model.sort_order)
        result = await db.execute(query)
        return list(result.scalars().all())

category_repo = CategoryRepository(EquipmentCategory)
