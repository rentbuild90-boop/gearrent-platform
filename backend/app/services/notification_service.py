from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.notification import notification_repo
from app.schemas.notification import NotificationCreate
from app.services.sms_service import sms_service
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    async def get_user_notifications(self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100):
        return await notification_repo.get_by_user(db, user_id=user_id, skip=skip, limit=limit)

    async def create_notification(self, db: AsyncSession, notification_in: NotificationCreate):
        notification_data = notification_in.model_dump()
        return await notification_repo.create(db, obj_in=notification_data)

    async def mark_as_read(self, db: AsyncSession, notification_id: int):
        db_notification = await notification_repo.get(db, id=notification_id)
        if db_notification:
            from datetime import datetime, timezone
            return await notification_repo.update(db, db_obj=db_notification, obj_in={
                "is_read": True,
                "read_at": datetime.now(timezone.utc)
            })
        return None

    async def delete_notification(self, db: AsyncSession, notification_id: int):
        db_notification = await notification_repo.get(db, id=notification_id)
        if db_notification:
            return await notification_repo.soft_delete(db, id=notification_id)
        return None

    async def send_email(self, to_email: str, subject: str, body: str):
        # Stub for sending email
        logger.info(f"Stub: Sending email to {to_email} with subject '{subject}'")
        return True

    async def send_sms(self, phone: str, message: str, message_type: str = "general", **kwargs):
        logger.info(f"Sending SMS to {phone} via sms_service")
        if message_type == "otp":
            return await sms_service.send_otp(phone, kwargs.get("otp", ""))
        elif message_type == "order_successful":
            return await sms_service.send_order_successful(phone, kwargs.get("order_id", ""), kwargs.get("customer_name", ""))
        elif message_type == "partner_order":
            return await sms_service.send_partner_order(phone, kwargs.get("order_id", ""))
        elif message_type == "service_booking":
            return await sms_service.send_service_booking(phone, kwargs.get("order_id", ""), kwargs.get("hours", 2))
        elif message_type == "recharge":
            return await sms_service.send_recharge_confirmation(phone, kwargs.get("amount", ""))
        else:
            logger.warning(f"SMS type {message_type} not explicitly supported by sms_service. Logging only.")
            return True

notification_service = NotificationService()
