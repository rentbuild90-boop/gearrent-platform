from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        query = select(self.model).filter(self.model.id == id, self.model.deleted_at.is_(None))
        result = await db.execute(query)
        return result.scalars().first()
    
    async def get_by_uuid(self, db: AsyncSession, uuid: str) -> Optional[ModelType]:
        query = select(self.model).filter(self.model.uuid == uuid, self.model.deleted_at.is_(None))
        result = await db.execute(query)
        return result.scalars().first()

    async def get_multi(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        query = select(self.model).filter(self.model.deleted_at.is_(None)).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def create(self, db: AsyncSession, *, obj_in: Dict[str, Any]) -> ModelType:
        db_obj = self.model(**obj_in)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self, db: AsyncSession, *, db_obj: ModelType, obj_in: Dict[str, Any]
    ) -> ModelType:
        for field in obj_in:
            if hasattr(db_obj, field):
                setattr(db_obj, field, obj_in[field])
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: Any) -> ModelType:
        """Hard delete"""
        query = select(self.model).where(self.model.id == id)
        result = await db.execute(query)
        obj = result.scalar_one()
        await db.delete(obj)
        await db.commit()
        return obj
        
    async def soft_delete(self, db: AsyncSession, *, id: Any) -> ModelType:
        """Soft delete by setting deleted_at"""
        from datetime import datetime, timezone
        
        query = select(self.model).where(self.model.id == id)
        result = await db.execute(query)
        obj = result.scalar_one()
        
        obj.deleted_at = datetime.now(timezone.utc)
        db.add(obj)
        await db.commit()
        return obj
