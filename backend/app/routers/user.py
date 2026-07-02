from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from pydantic import BaseModel
from app.database.connection import get_db
from app.schemas.user import UserOut, UserResponse, UserUpdate, UserUpdatePassword, UserPreferencesUpdate
from app.services.user_service import user_service
from app.core.deps import get_current_active_user
from app.database.models.auth import User
from app.database.models.equipment import Wishlist, Equipment, EquipmentPricing
from app.schemas.equipment import EquipmentOut, EquipmentListResponse

class WishlistAdd(BaseModel):
    equipment_id: int

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_active_user)):
    return UserResponse(
        success=True,
        message="Profile retrieved",
        data=UserOut.model_validate(current_user)
    )

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_in: UserUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    updated_user = await user_service.update_user(db, db_user=current_user, user_in=user_in)
    return UserResponse(
        success=True,
        message="Profile updated",
        data=UserOut.model_validate(updated_user)
    )

@router.put("/password", response_model=UserResponse)
async def update_password(
    password_in: UserUpdatePassword,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    await user_service.update_password(db, current_user, password_in.current_password, password_in.new_password)
    return UserResponse(
        success=True,
        message="Password updated successfully",
        data=None
    )

@router.get("/preferences")
async def get_preferences(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    prefs = await user_service.get_preferences(db, current_user.id)
    return {
        "success": True,
        "message": "Preferences retrieved",
        "data": prefs
    }

@router.put("/preferences")
async def update_preferences(
    prefs_in: UserPreferencesUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    prefs = await user_service.update_preferences(db, current_user.id, prefs_in.notifications)
    return {
        "success": True,
        "message": "Preferences updated",
        "data": prefs
    }

@router.get("/wishlist", response_model=EquipmentListResponse)
async def get_wishlist(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = select(Equipment).join(Wishlist, Wishlist.equipment_id == Equipment.id).filter(Wishlist.user_id == current_user.id)
    result = await db.execute(query)
    equipment_list = result.scalars().all()
    
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
        
    return EquipmentListResponse(data=data)

@router.post("/wishlist")
async def add_to_wishlist(
    item: WishlistAdd,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    eq_query = select(Equipment).filter(Equipment.id == item.equipment_id)
    eq_result = await db.execute(eq_query)
    if not eq_result.scalars().first():
        raise HTTPException(status_code=404, detail="Equipment not found")
        
    check_query = select(Wishlist).filter(
        Wishlist.user_id == current_user.id, 
        Wishlist.equipment_id == item.equipment_id
    )
    check_result = await db.execute(check_query)
    if check_result.scalars().first():
        return {"success": True, "message": "Already in wishlist"}
        
    wishlist_item = Wishlist(user_id=current_user.id, equipment_id=item.equipment_id)
    db.add(wishlist_item)
    await db.commit()
    return {"success": True, "message": "Added to wishlist"}

@router.delete("/wishlist/{equipment_id}")
async def remove_from_wishlist(
    equipment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = delete(Wishlist).where(
        Wishlist.user_id == current_user.id, 
        Wishlist.equipment_id == equipment_id
    )
    await db.execute(query)
    await db.commit()
    return {"success": True, "message": "Removed from wishlist"}

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if user_id != current_user.id and not current_user.is_superadmin:
        raise HTTPException(status_code=403, detail="Not authorized to view this user")
        
    user = await user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return UserResponse(
        success=True,
        message="User retrieved",
        data=UserOut.model_validate(user)
    )

@router.delete("/{user_id}", response_model=UserResponse)
async def delete_user(
    user_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if user_id != current_user.id and not current_user.is_superadmin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")
        
    user = await user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    await user_service.delete_user(db, user_id)
    return UserResponse(
        success=True,
        message="User deleted successfully",
        data=None
    )
