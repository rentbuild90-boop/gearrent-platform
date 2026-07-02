import uuid
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.equipment import equipment_repo
from app.schemas.equipment import EquipmentCreate, EquipmentUpdate

class EquipmentService:
    async def get_all_equipment(self, db: AsyncSession, skip: int = 0, limit: int = 100):
        return await equipment_repo.get_multi(db, skip=skip, limit=limit)
        
    async def get_available_equipment(
        self, 
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100,
        name: Optional[str] = None,
        category_id: Optional[int] = None,
        city_id: Optional[int] = None
    ):
        return await equipment_repo.get_available_equipment(
            db, skip=skip, limit=limit, name=name, category_id=category_id, city_id=city_id
        )
        
    async def get_equipment(self, db: AsyncSession, equipment_id: int):
        return await equipment_repo.get(db, id=equipment_id)

    async def create_equipment(self, db: AsyncSession, owner_id: int, equipment_in: EquipmentCreate):
        equipment_code = f"EQ-{uuid.uuid4().hex[:8].upper()}"
        
        equipment_data = equipment_in.model_dump()
        equipment_data["equipment_code"] = equipment_code
        equipment_data["owner_id"] = owner_id
        
        return await equipment_repo.create(db, obj_in=equipment_data)

    async def update_equipment(self, db: AsyncSession, db_equipment, equipment_in: EquipmentUpdate):
        update_data = equipment_in.model_dump(exclude_unset=True)
        return await equipment_repo.update(db, db_obj=db_equipment, obj_in=update_data)

    async def delete_equipment(self, db: AsyncSession, equipment_id: int):
        return await equipment_repo.delete(db, id=equipment_id)

equipment_service = EquipmentService()
