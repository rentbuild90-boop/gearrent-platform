from sqlalchemy import Column, String, BigInteger, ForeignKey, DateTime, Integer, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class UserPasskey(Base, AuditMixin):
    __tablename__ = "user_passkeys"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    credential_id = Column(String(255), unique=True, index=True, nullable=False)
    public_key = Column(String(2048), nullable=False) # Base64 encoded public key
    sign_count = Column(Integer, default=0, nullable=False)
    transports = Column(String(255), nullable=True) # Comma separated list of transports
    device_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User", foreign_keys=[user_id])
