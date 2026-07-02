from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class DriverBase(BaseModel):
    user_id: int
    license_number: str
    experience_years: int = 0
    vehicle_class: Optional[str] = None

class DriverCreate(DriverBase):
    pass

class DriverUpdate(BaseModel):
    license_number: Optional[str] = None
    experience_years: Optional[int] = None
    status: Optional[str] = None
    vehicle_class: Optional[str] = None

class DriverOut(DriverBase):
    id: int
    driver_code: str
    owner_id: Optional[int] = None
    status: str
    rating: float
    total_trips: int
    total_hours: int
    kyc_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DriverResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[DriverOut] = None
    errors: Optional[Any] = None

class DriverListResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: List[DriverOut]
    errors: Optional[Any] = None
