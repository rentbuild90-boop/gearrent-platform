from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class ConversationBase(BaseModel):
    booking_id: Optional[int] = None
    type: str = "DIRECT"
    title: Optional[str] = None

class ConversationCreate(ConversationBase):
    pass

class ConversationOut(ConversationBase):
    id: int
    last_message_at: Optional[datetime] = None
    last_message_preview: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    conversation_id: int
    message_type: str = "TEXT"
    content: str
    reply_to_id: Optional[int] = None

class MessageCreate(MessageBase):
    pass

class MessageOut(MessageBase):
    id: int
    sender_id: int
    is_edited: bool
    edited_at: Optional[datetime] = None
    is_read: bool
    delivered_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[ConversationOut] = None
    errors: Optional[Any] = None

class ConversationListResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: List[ConversationOut]
    errors: Optional[Any] = None
    
class MessageListResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: List[MessageOut]
    errors: Optional[Any] = None

class MessageResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[MessageOut] = None
    errors: Optional[Any] = None
