from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_db
from app.schemas.booking import BookingOut, BookingListResponse, BookingResponse, BookingCreate, BookingUpdate
from app.services.booking_service import booking_service
from app.services.equipment_service import equipment_service
from app.core.deps import get_current_user, get_current_active_user
from app.database.models.auth import User

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.get("/my-bookings", response_model=BookingListResponse)
async def get_my_bookings(
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    bookings = await booking_service.get_renter_bookings(db, renter_id=current_user.id, skip=skip, limit=limit)
    data = []
    for b in bookings:
        eq = await equipment_service.get_equipment(db, b.equipment_id)
        eq_name = eq.name if eq else f"Equipment #{b.equipment_id}"
        b_out = BookingOut.model_validate(b)
        b_out.equipment_name = eq_name
        data.append(b_out)
    return BookingListResponse(data=data)

@router.get("/owner-bookings", response_model=BookingListResponse)
async def get_owner_bookings(
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    bookings = await booking_service.get_owner_bookings(db, owner_id=current_user.id, skip=skip, limit=limit)
    data = []
    for b in bookings:
        eq = await equipment_service.get_equipment(db, b.equipment_id)
        eq_name = eq.name if eq else f"Equipment #{b.equipment_id}"
        b_out = BookingOut.model_validate(b)
        b_out.equipment_name = eq_name
        data.append(b_out)
    return BookingListResponse(data=data)

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    booking = await booking_service.get_booking(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    if booking.renter_id != current_user.id and booking.owner_id != current_user.id and not current_user.is_superadmin:
        raise HTTPException(status_code=403, detail="Not authorized to view this booking")
        
    eq = await equipment_service.get_equipment(db, booking.equipment_id)
    eq_name = eq.name if eq else f"Equipment #{booking.equipment_id}"
    b_out = BookingOut.model_validate(booking)
    b_out.equipment_name = eq_name
    return BookingResponse(data=b_out)

@router.post("", response_model=BookingResponse)
async def create_booking(
    booking_in: BookingCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    try:
        booking = await booking_service.create_booking(db, renter_id=current_user.id, booking_in=booking_in)
        return BookingResponse(
            message="Booking created",
            data=BookingOut.model_validate(booking)
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking_status(
    booking_id: int,
    booking_in: BookingUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_booking = await booking_service.get_booking(db, booking_id)
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if db_booking.owner_id != current_user.id and db_booking.renter_id != current_user.id and not current_user.is_superadmin:
        raise HTTPException(status_code=403, detail="Not authorized to update this booking")
        
    try:
        updated = await booking_service.update_booking(
            db, 
            db_booking=db_booking, 
            booking_in=booking_in, 
            current_user_id=current_user.id, 
            is_superadmin=current_user.is_superadmin
        )
        return BookingResponse(
            message="Booking updated",
            data=BookingOut.model_validate(updated)
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
