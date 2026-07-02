from sqlalchemy import Column, String, Boolean, JSON, ForeignKey, BigInteger, DateTime, Text
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class Notification(Base, AuditMixin):
    __tablename__ = "notifications"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    type = Column(String(50), nullable=False) # BOOKING, PAYMENT, APPROVAL, WALLET, MESSAGE, WARNING, SYSTEM
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    action_url = Column(String(500), nullable=True)
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    metadata_json = Column("metadata", JSON, nullable=True) # Renamed to avoid reserved word conflict in some DBs

class NotificationTemplate(Base, AuditMixin):
    __tablename__ = "notification_templates"
    
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    channel = Column(String(20), nullable=False) # EMAIL, SMS, WHATSAPP, PUSH, IN_APP
    subject = Column(String(255), nullable=True)
    body_template = Column(Text, nullable=False)
    variables = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)

class NotificationLog(Base, AuditMixin):
    __tablename__ = "notification_logs"
    
    notification_id = Column(BigInteger, ForeignKey("notifications.id"), nullable=True)
    template_id = Column(BigInteger, ForeignKey("notification_templates.id"), nullable=True)
    channel = Column(String(20), nullable=False)
    recipient = Column(String(255), nullable=False)
    status = Column(String(20), nullable=False) # QUEUED, SENT, DELIVERED, FAILED, BOUNCED
    sent_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)

class PushToken(Base, AuditMixin):
    __tablename__ = "push_tokens"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    device_id = Column(BigInteger, ForeignKey("devices.id"), nullable=False)
    token = Column(String(500), nullable=False)
    platform = Column(String(20), nullable=False) # FCM, APNS, WEB
    is_active = Column(Boolean, default=True)


class EmailLog(Base, AuditMixin):
    __tablename__ = "email_logs"
    
    recipient_email = Column(String(255), nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    template_name = Column(String(100), nullable=True)
    status = Column(String(20), default="SENT")
    error_message = Column(Text, nullable=True)

class SmsLog(Base, AuditMixin):
    __tablename__ = "sms_logs"
    
    recipient_phone = Column(String(20), nullable=False, index=True)
    message_body = Column(Text, nullable=False)
    status = Column(String(20), default="SENT")
    error_message = Column(Text, nullable=True)

