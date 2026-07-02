from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_db
from app.schemas.payment import (
    WalletOut, WalletResponse, TransactionListResponse, WalletTransactionOut,
    PaymentCreate, PaymentResponse, PaymentOut, PaymentVerify
)
from app.services.payment_service import payment_service
from app.core.deps import get_current_active_user
from app.database.models.auth import User

router = APIRouter(prefix="/financials", tags=["Financials"])

@router.get("/wallet", response_model=WalletResponse)
async def get_wallet(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    wallet = await payment_service.get_or_create_wallet(db, current_user.id)
    return WalletResponse(data=WalletOut.model_validate(wallet))

@router.get("/wallet/transactions", response_model=TransactionListResponse)
async def get_transactions(
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    wallet = await payment_service.get_or_create_wallet(db, current_user.id)
    transactions = await payment_service.get_wallet_transactions(db, wallet.id, skip=skip, limit=limit)
    return TransactionListResponse(
        data=[WalletTransactionOut.model_validate(tx) for tx in transactions]
    )

@router.post("/payment", response_model=PaymentResponse)
async def initiate_payment(
    payment_in: PaymentCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    payment = await payment_service.create_payment(db, payer_id=current_user.id, payment_in=payment_in)
    return PaymentResponse(
        message="Payment initiated",
        data=PaymentOut.model_validate(payment)
    )

@router.post("/payment/verify", response_model=PaymentResponse)
async def verify_payment(
    verify_in: PaymentVerify, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    payment = await payment_service.verify_payment(db, verify_in)
    return PaymentResponse(
        message="Payment verified successfully",
        data=PaymentOut.model_validate(payment)
    )

@router.post("/payment/webhook")
async def payment_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
    x_razorpay_signature: str = Header(None)
):
    if not x_razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing signature")
    payload = await request.json()
    return await payment_service.handle_webhook(db, payload, x_razorpay_signature)
