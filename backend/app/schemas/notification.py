from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class NotificationBase(BaseModel):
    user_id: int
    type: str
    title: str
    message: str
    action_url: Optional[str] = None
    is_read: bool = False

class NotificationCreate(NotificationBase):
    pass

class NotificationOut(NotificationBase):
    id: int
    read_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[NotificationOut] = None
    errors: Optional[Any] = None

class NotificationListResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: List[NotificationOut]
    errors: Optional[Any] = None
