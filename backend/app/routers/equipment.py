import json
import redis.asyncio as aioredis
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.connection import get_db
from app.config import settings
from app.schemas.equipment import EquipmentOut, EquipmentListResponse, EquipmentResponse, EquipmentCreate, EquipmentUpdate
from app.services.equipment_service import equipment_service
from app.core.deps import get_current_user, get_current_active_user, require_role, RoleName
from app.database.models.auth import User
from app.database.models.equipment import EquipmentPricing

router = APIRouter(prefix="/equipment", tags=["Equipment"])
redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)

@router.get("", response_model=EquipmentListResponse)
async def get_all_available_equipment(
    skip: int = 0, limit: int = 100,
    name: Optional[str] = None,
    category_id: Optional[int] = None,
    city_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    cache_key = f"equipment:list:{skip}:{limit}:{name}:{category_id}:{city_id}"
    try:
        cached_data = await redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
    except Exception:
        pass

    equipment_list = await equipment_service.get_available_equipment(
        db, skip=skip, limit=limit, name=name, category_id=category_id, city_id=city_id
    )
    
    data = []
    for e in equipment_list:
        pricing_query = select(EquipmentPricing).filter(
            EquipmentPricing.equipment_id == e.id,
            EquipmentPricing.pricing_type == "DAILY"
        )
        pricing_result = await db.execute(pricing_query)
        daily_pricing = pricing_result.scalars().first()
        price = float(daily_pricing.price) if daily_pricing else 1000.0
        
        e_out = EquipmentOut.model_validate(e)
        e_out.price_per_day = price
        data.append(e_out)
        
    response_data = EquipmentListResponse(data=data)
    
    try:
        await redis_client.setex(cache_key, 300, response_data.model_dump_json())
    except Exception:
        pass
        
    return response_data

@router.get("/{equipment_id}", response_model=EquipmentResponse)
async def get_equipment(equipment_id: int, db: AsyncSession = Depends(get_db)):
    equipment = await equipment_service.get_equipment(db, equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
        
    pricing_query = select(EquipmentPricing).filter(
        EquipmentPricing.equipment_id == equipment.id,
        EquipmentPricing.pricing_type == "DAILY"
    )
    pricing_result = await db.execute(pricing_query)
    daily_pricing = pricing_result.scalars().first()
    price = float(daily_pricing.price) if daily_pricing else 1000.0
    
    e_out = EquipmentOut.model_validate(equipment)
    e_out.price_per_day = price
    return EquipmentResponse(data=e_out)

@router.post("", response_model=EquipmentResponse)
async def create_equipment(
    equipment_in: EquipmentCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([RoleName.OWNER.value, RoleName.SUPER_ADMIN.value]))
):
    equipment = await equipment_service.create_equipment(db, owner_id=current_user.id, equipment_in=equipment_in)
    return EquipmentResponse(
        message="Equipment created",
        data=EquipmentOut.model_validate(equipment)
    )

@router.put("/{equipment_id}", response_model=EquipmentResponse)
async def update_equipment(
    equipment_id: int,
    equipment_in: EquipmentUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_equipment = await equipment_service.get_equipment(db, equipment_id)
    if not db_equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    if db_equipment.owner_id != current_user.id and not current_user.is_superadmin:
        raise HTTPException(status_code=403, detail="Not authorized to update this equipment")
        
    updated = await equipment_service.update_equipment(db, db_equipment=db_equipment, equipment_in=equipment_in)
    return EquipmentResponse(
        message="Equipment updated",
        data=EquipmentOut.model_validate(updated)
    )

@router.delete("/{equipment_id}", response_model=EquipmentResponse)
async def delete_equipment(
    equipment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_equipment = await equipment_service.get_equipment(db, equipment_id)
    if not db_equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    if db_equipment.owner_id != current_user.id and not current_user.is_superadmin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this equipment")
        
    await equipment_service.delete_equipment(db, equipment_id)
    return EquipmentResponse(
        message="Equipment deleted successfully",
        data=None
    )
