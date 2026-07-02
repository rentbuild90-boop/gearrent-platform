import uuid
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.driver import driver_repo
from app.schemas.driver import DriverCreate, DriverUpdate

class DriverService:
    async def get_driver(self, db: AsyncSession, driver_id: int):
        return await driver_repo.get(db, id=driver_id)
        
    async def get_driver_by_user(self, db: AsyncSession, user_id: int):
        return await driver_repo.get_by_user_id(db, user_id=user_id)
        
    async def get_available_drivers(self, db: AsyncSession, skip: int = 0, limit: int = 100):
        return await driver_repo.get_available_drivers(db, skip=skip, limit=limit)

    async def create_driver(self, db: AsyncSession, driver_in: DriverCreate):
        driver_code = f"DRV-{uuid.uuid4().hex[:6].upper()}"
        
        driver_data = driver_in.model_dump()
        driver_data["driver_code"] = driver_code
        
        return await driver_repo.create(db, obj_in=driver_data)

    async def update_driver(self, db: AsyncSession, db_driver, driver_in: DriverUpdate):
        update_data = driver_in.model_dump(exclude_unset=True)
        return await driver_repo.update(db, db_obj=db_driver, obj_in=update_data)

    async def delete_driver(self, db: AsyncSession, driver_id: int):
        return await driver_repo.delete(db, id=driver_id)

driver_service = DriverService()
