import uuid
import hmac
import hashlib
import json
import logging
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.database.repositories.payment import wallet_repo, wallet_tx_repo, payment_repo
from app.database.repositories.booking import booking_repo
from app.database.models.payment import PaymentTransaction, RazorpayTransaction, PaymentWebhook, Payment
from app.schemas.payment import PaymentCreate, PaymentVerify
from app.config import settings
from sqlalchemy import select

logger = logging.getLogger(__name__)

try:
    import razorpay
    razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
except ImportError:
    logger.warning("razorpay module not found, using stub")
    razorpay_client = None

class PaymentService:
    async def get_or_create_wallet(self, db: AsyncSession, user_id: int):
        wallet = await wallet_repo.get_by_user_id(db, user_id)
        if not wallet:
            wallet_code = f"WAL-{uuid.uuid4().hex[:6].upper()}"
            wallet = await wallet_repo.create(db, obj_in={
                "wallet_code": wallet_code,
                "user_id": user_id,
                "currency": "INR",
                "status": "ACTIVE"
            })
        return wallet

    async def get_wallet_transactions(self, db: AsyncSession, wallet_id: int, skip: int = 0, limit: int = 100):
        return await wallet_tx_repo.get_by_wallet_id(db, wallet_id, skip=skip, limit=limit)

    async def create_payment(self, db: AsyncSession, payer_id: int, payment_in: PaymentCreate):
        payment_code = f"PAY-{uuid.uuid4().hex[:8].upper()}"
        
        booking = await booking_repo.get(db, id=payment_in.booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")

        amount_in_paise = int(payment_in.amount * 100)
        gateway_order_id = None
        
        if razorpay_client and settings.RAZORPAY_KEY_ID:
            try:
                order_data = {
                    "amount": amount_in_paise,
                    "currency": payment_in.currency,
                    "receipt": payment_code,
                    "payment_capture": 1
                }
                razorpay_order = razorpay_client.order.create(data=order_data)
                gateway_order_id = razorpay_order.get("id")
            except Exception as e:
                logger.error(f"Error creating razorpay order: {str(e)}")
                raise HTTPException(status_code=500, detail="Payment gateway error")
        else:
            gateway_order_id = f"mock_order_{uuid.uuid4().hex[:8]}"

        payment_data = payment_in.model_dump()
        payment_data.update({
            "payment_code": payment_code,
            "payer_id": payer_id,
            "status": "CREATED",
            "gateway": "RAZORPAY",
            "gateway_order_id": gateway_order_id
        })
        
        return await payment_repo.create(db, obj_in=payment_data)

    async def verify_payment(self, db: AsyncSession, verify_in: PaymentVerify):
        payment = await payment_repo.get(db, id=verify_in.payment_id)
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")

        if razorpay_client and settings.RAZORPAY_KEY_SECRET:
            try:
                razorpay_client.utility.verify_payment_signature({
                    'razorpay_order_id': verify_in.razorpay_order_id,
                    'razorpay_payment_id': verify_in.razorpay_payment_id,
                    'razorpay_signature': verify_in.razorpay_signature
                })
            except Exception as e:
                logger.error(f"Signature verification failed: {str(e)}")
                raise HTTPException(status_code=400, detail="Invalid signature")

        payment.status = "CAPTURED"
        payment.gateway_payment_id = verify_in.razorpay_payment_id
        payment.gateway_signature = verify_in.razorpay_signature
        db.add(payment)

        payment_tx = PaymentTransaction(
            payment_id=payment.id,
            type="CHARGE",
            amount=payment.amount,
            status="SUCCESS",
            gateway_transaction_id=verify_in.razorpay_payment_id
        )
        db.add(payment_tx)

        razorpay_tx = RazorpayTransaction(
            payment_id=payment.id,
            razorpay_order_id=verify_in.razorpay_order_id,
            razorpay_payment_id=verify_in.razorpay_payment_id,
            razorpay_signature=verify_in.razorpay_signature,
            event_type="payment.captured",
            payload={},
            status="SUCCESS"
        )
        db.add(razorpay_tx)

        booking = await booking_repo.get(db, id=payment.booking_id)
        if booking:
            booking.payment_status = "PAID"
            db.add(booking)
            
        await db.commit()
        await db.refresh(payment)
        return payment

    async def handle_webhook(self, db: AsyncSession, payload: dict, signature: str):
        if razorpay_client and settings.RAZORPAY_KEY_SECRET:
            try:
                raw_body = json.dumps(payload, separators=(',', ':'))
                razorpay_client.utility.verify_webhook_signature(
                    raw_body,
                    signature,
                    settings.RAZORPAY_KEY_SECRET
                )
            except Exception as e:
                logger.error(f"Webhook signature verification failed: {str(e)}")
                raise HTTPException(status_code=400, detail="Invalid webhook signature")

        webhook_log = PaymentWebhook(
            gateway_name="RAZORPAY",
            event_type=payload.get("event", "unknown"),
            payload=payload,
            processed=True
        )
        db.add(webhook_log)
        
        event = payload.get("event")
        if event == "payment.captured":
            payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
            gateway_order_id = payment_entity.get("order_id")
            if gateway_order_id:
                query = select(Payment).filter(Payment.gateway_order_id == gateway_order_id)
                result = await db.execute(query)
                payment = result.scalars().first()
                
                if payment and payment.status != "CAPTURED":
                    payment.status = "CAPTURED"
                    payment.gateway_payment_id = payment_entity.get("id")
                    db.add(payment)
                    
                    booking = await booking_repo.get(db, id=payment.booking_id)
                    if booking:
                        booking.payment_status = "PAID"
                        db.add(booking)
                        
                    payment_tx = PaymentTransaction(
                        payment_id=payment.id,
                        type="CHARGE",
                        amount=payment.amount,
                        status="SUCCESS",
                        gateway_transaction_id=payment_entity.get("id")
                    )
                    db.add(payment_tx)
                    
        await db.commit()
        return {"status": "ok"}

payment_service = PaymentService()
