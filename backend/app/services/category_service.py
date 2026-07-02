import uuid
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.category import category_repo
from app.schemas.category import CategoryCreate, CategoryUpdate

class CategoryService:
    async def get_all_categories(self, db: AsyncSession, skip: int = 0, limit: int = 100):
        return await category_repo.get_multi(db, skip=skip, limit=limit)
        
    async def get_active_categories(self, db: AsyncSession):
        return await category_repo.get_active_categories(db)
        
    async def get_category(self, db: AsyncSession, category_id: int):
        return await category_repo.get(db, id=category_id)

    async def create_category(self, db: AsyncSession, category_in: CategoryCreate):
        category_code = f"CAT-{uuid.uuid4().hex[:6].upper()}"
        
        category_data = category_in.model_dump()
        category_data["category_code"] = category_code
        
        return await category_repo.create(db, obj_in=category_data)

    async def update_category(self, db: AsyncSession, db_category, category_in: CategoryUpdate):
        update_data = category_in.model_dump(exclude_unset=True)
        return await category_repo.update(db, db_obj=db_category, obj_in=update_data)

category_service = CategoryService()
