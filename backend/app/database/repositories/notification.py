from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.base import BaseRepository
from app.database.models.notification import Notification

class NotificationRepository(BaseRepository[Notification]):
    async def get_by_user(self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100) -> List[Notification]:
        query = select(self.model).filter(
            self.model.user_id == user_id,
            self.model.deleted_at.is_(None)
        ).order_by(self.model.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

notification_repo = NotificationRepository(Notification)
