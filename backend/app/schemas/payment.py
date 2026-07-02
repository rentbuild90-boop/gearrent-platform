from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class WalletBase(BaseModel):
    user_id: int
    currency: str = "INR"
    status: str = "ACTIVE"

class WalletOut(WalletBase):
    id: int
    wallet_code: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class WalletTransactionBase(BaseModel):
    type: str
    amount: float
    reference_type: str
    reference_id: int
    description: str
    booking_id: Optional[int] = None

class WalletTransactionOut(WalletTransactionBase):
    id: int
    wallet_id: int
    running_balance: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class PaymentBase(BaseModel):
    booking_id: int
    amount: float
    currency: str = "INR"

class PaymentCreate(PaymentBase):
    pass

class PaymentOut(PaymentBase):
    id: int
    payment_code: str
    payer_id: int
    status: str
    gateway: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PaymentResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[PaymentOut] = None
    errors: Optional[Any] = None

class WalletResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[WalletOut] = None
    errors: Optional[Any] = None
    
class TransactionListResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: List[WalletTransactionOut]
    errors: Optional[Any] = None

class PaymentVerify(BaseModel):
    payment_id: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
