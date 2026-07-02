from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class EquipmentBase(BaseModel):
    category_id: int
    name: str
    brand: Optional[str] = None
    model_year: Optional[int] = None
    registration_number: Optional[str] = None
    chassis_number: Optional[str] = None
    capacity: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city_id: int
    features: Optional[Dict[str, Any]] = None

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    brand: Optional[str] = None
    model_year: Optional[int] = None
    registration_number: Optional[str] = None
    chassis_number: Optional[str] = None
    capacity: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city_id: Optional[int] = None
    features: Optional[Dict[str, Any]] = None

class EquipmentOut(EquipmentBase):
    id: int
    equipment_code: str
    owner_id: int
    status: str
    rating: float
    review_count: int
    created_at: datetime
    updated_at: datetime
    price_per_day: Optional[float] = None
    registration_number: Optional[str] = Field(default=None, exclude=True)
    chassis_number: Optional[str] = Field(default=None, exclude=True)

    class Config:
        from_attributes = True

class EquipmentResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[EquipmentOut] = None
    errors: Optional[Any] = None

class EquipmentListResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: List[EquipmentOut]
    errors: Optional[Any] = None
