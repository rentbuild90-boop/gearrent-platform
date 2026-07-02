from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_db
from app.schemas.driver import DriverOut, DriverListResponse, DriverResponse, DriverCreate, DriverUpdate
from app.services.driver_service import driver_service
from app.core.deps import get_current_active_user
from app.database.models.auth import User

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.get("", response_model=DriverListResponse)
async def get_available_drivers(
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    drivers = await driver_service.get_available_drivers(db, skip=skip, limit=limit)
    return DriverListResponse(
        data=[DriverOut.model_validate(d) for d in drivers]
    )

@router.get("/me", response_model=DriverResponse)
async def get_my_driver_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    driver = await driver_service.get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    return DriverResponse(data=DriverOut.model_validate(driver))

@router.get("/{driver_id}", response_model=DriverResponse)
async def get_driver(driver_id: int, db: AsyncSession = Depends(get_db)):
    driver = await driver_service.get_driver(db, driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return DriverResponse(data=DriverOut.model_validate(driver))

@router.post("", response_model=DriverResponse)
async def create_driver_profile(
    driver_in: DriverCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if driver_in.user_id != current_user.id and not current_user.is_superadmin:
        raise HTTPException(status_code=403, detail="Cannot create profile for another user")
        
    existing = await driver_service.get_driver_by_user(db, driver_in.user_id)
    if existing:
        raise HTTPException(status_code=400, detail="Driver profile already exists")
        
    driver = await driver_service.create_driver(db, driver_in)
    return DriverResponse(
        message="Driver profile created",
        data=DriverOut.model_validate(driver)
    )

@router.put("/{driver_id}", response_model=DriverResponse)
async def update_driver(
    driver_id: int,
    driver_in: DriverUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_driver = await driver_service.get_driver(db, driver_id)
    if not db_driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    if db_driver.user_id != current_user.id and not current_user.is_superadmin:
        raise HTTPException(status_code=403, detail="Not authorized to update this driver")
        
    updated = await driver_service.update_driver(db, db_driver=db_driver, driver_in=driver_in)
    return DriverResponse(
        message="Driver updated",
        data=DriverOut.model_validate(updated)
    )

@router.delete("/{driver_id}", response_model=DriverResponse)
async def delete_driver(
    driver_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_driver = await driver_service.get_driver(db, driver_id)
    if not db_driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    if db_driver.user_id != current_user.id and not current_user.is_superadmin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this driver")
        
    await driver_service.delete_driver(db, driver_id)
    return DriverResponse(
        message="Driver deleted successfully",
        data=None
    )
