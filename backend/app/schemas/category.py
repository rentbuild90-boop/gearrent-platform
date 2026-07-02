from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    base_price: float
    pricing_unit: str = "DAILY"
    is_active: bool = True
    sort_order: int = 0
    parent_id: Optional[int] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    base_price: Optional[float] = None
    pricing_unit: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None
    parent_id: Optional[int] = None

class CategoryOut(CategoryBase):
    id: int
    category_code: str
    base_commission_rate: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CategoryResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[CategoryOut] = None
    errors: Optional[Any] = None

class CategoryListResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: List[CategoryOut]
    errors: Optional[Any] = None
