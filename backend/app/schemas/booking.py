from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class BookingBase(BaseModel):
    equipment_id: int
    start_date: datetime
    end_date: datetime
    pickup_location: str
    dropoff_location: str
    city_id: int

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None
    driver_id: Optional[int] = None

class BookingOut(BookingBase):
    id: int
    booking_code: str
    renter_id: int
    owner_id: int
    driver_id: Optional[int] = None
    daily_rate: float
    total_days: int
    subtotal: float
    service_fee: float
    platform_commission: float
    total_amount: float
    status: str
    payment_status: str
    created_at: datetime
    updated_at: datetime
    equipment_name: Optional[str] = None

    class Config:
        from_attributes = True

class BookingResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[BookingOut] = None
    errors: Optional[Any] = None

class BookingListResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: List[BookingOut]
    errors: Optional[Any] = None
