from sqlalchemy import Column, String, BigInteger, ForeignKey, DateTime, Integer, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class UserQuickPin(Base, AuditMixin):
    __tablename__ = "user_quick_pin"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    pin_hash = Column(String(255), nullable=False)
    failed_attempts = Column(Integer, default=0, nullable=False)
    locked_until = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    
    user = relationship("User", foreign_keys=[user_id])
