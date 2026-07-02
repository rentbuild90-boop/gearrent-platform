from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class ReviewBase(BaseModel):
    booking_id: int
    target_type: str
    target_id: int
    rating: float
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewOut(ReviewBase):
    id: int
    reviewer_id: int
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ReviewResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[ReviewOut] = None
    errors: Optional[Any] = None

class ReviewListResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: List[ReviewOut]
    errors: Optional[Any] = None
