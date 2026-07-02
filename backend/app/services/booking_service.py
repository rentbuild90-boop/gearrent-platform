import uuid
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.booking import booking_repo
from app.schemas.booking import BookingCreate, BookingUpdate
from app.services.equipment_service import equipment_service
from app.database.models.equipment import EquipmentPricing
from sqlalchemy import select

class BookingService:
    async def get_booking(self, db: AsyncSession, booking_id: int):
        return await booking_repo.get(db, id=booking_id)

    async def get_renter_bookings(self, db: AsyncSession, renter_id: int, skip: int = 0, limit: int = 100):
        return await booking_repo.get_by_renter(db, renter_id=renter_id, skip=skip, limit=limit)
        
    async def get_owner_bookings(self, db: AsyncSession, owner_id: int, skip: int = 0, limit: int = 100):
        return await booking_repo.get_by_owner(db, owner_id=owner_id, skip=skip, limit=limit)

    async def create_booking(self, db: AsyncSession, renter_id: int, booking_in: BookingCreate):
        equipment = await equipment_service.get_equipment(db, booking_in.equipment_id)
        if not equipment:
            raise ValueError("Equipment not found")
            
        # Check availability
        is_available = await booking_repo.check_availability(
            db, 
            equipment_id=booking_in.equipment_id,
            start_date=booking_in.start_date,
            end_date=booking_in.end_date
        )
        if not is_available:
            raise ValueError("Equipment is not available for the requested dates")
            
        booking_code = f"BKG-{uuid.uuid4().hex[:8].upper()}"
        
        total_days = (booking_in.end_date - booking_in.start_date).days
        if total_days <= 0:
            total_days = 1
            
        # Fetch pricing from EquipmentPricing
        pricing_query = select(EquipmentPricing).filter(
            EquipmentPricing.equipment_id == equipment.id,
            EquipmentPricing.pricing_type == "DAILY"
        )
        pricing_result = await db.execute(pricing_query)
        daily_pricing = pricing_result.scalars().first()
        
        daily_rate = float(daily_pricing.price) if daily_pricing else getattr(equipment, 'daily_rate', 100.0)
        
        subtotal = daily_rate * total_days
        service_fee = 500.0
        platform_commission = subtotal * 0.10
        total_amount = subtotal + service_fee + platform_commission
        
        booking_data = booking_in.model_dump()
        booking_data.update({
            "booking_code": booking_code,
            "renter_id": renter_id,
            "owner_id": equipment.owner_id,
            "daily_rate": daily_rate,
            "total_days": total_days,
            "subtotal": subtotal,
            "service_fee": service_fee,
            "platform_commission": platform_commission,
            "total_amount": total_amount,
            "status": "REQUESTED"
        })
        
        return await booking_repo.create(db, obj_in=booking_data)

    async def update_booking(self, db: AsyncSession, db_booking, booking_in: BookingUpdate, current_user_id: int = None, is_superadmin: bool = False):
        new_status = booking_in.status
        if new_status and new_status != db_booking.status:
            if new_status == "APPROVED":
                if db_booking.status != "REQUESTED":
                    raise ValueError("Can only approve REQUESTED bookings")
                if current_user_id is not None and current_user_id != db_booking.owner_id and not is_superadmin:
                    raise ValueError("Only the owner can approve the booking")
            elif new_status == "ACTIVE":
                if db_booking.status != "APPROVED":
                    raise ValueError("Can only activate APPROVED bookings")
            elif new_status == "CANCELLED":
                if db_booking.status == "REQUESTED":
                    if current_user_id is not None and current_user_id != db_booking.renter_id and current_user_id != db_booking.owner_id and not is_superadmin:
                        raise ValueError("Only Renter or Owner can cancel")
                else:
                    if current_user_id is not None and current_user_id != db_booking.owner_id and current_user_id != db_booking.renter_id and not is_superadmin:
                        raise ValueError("Not authorized to cancel")
            elif new_status == "COMPLETED":
                if db_booking.status != "ACTIVE":
                    raise ValueError("Can only complete ACTIVE bookings")

        update_data = booking_in.model_dump(exclude_unset=True)
        return await booking_repo.update(db, db_obj=db_booking, obj_in=update_data)

booking_service = BookingService()
