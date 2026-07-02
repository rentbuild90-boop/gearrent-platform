from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.base import BaseRepository
from app.database.models.review import Review

class ReviewRepository(BaseRepository[Review]):
    async def get_by_target(self, db: AsyncSession, target_type: str, target_id: int, skip: int = 0, limit: int = 100) -> List[Review]:
        query = select(self.model).filter(
            self.model.target_type == target_type,
            self.model.target_id == target_id,
            self.model.is_published == True,
            self.model.deleted_at.is_(None)
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

review_repo = ReviewRepository(Review)
