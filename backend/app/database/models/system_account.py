from sqlalchemy import Column, String, Boolean, DateTime
from app.database.base import Base, AuditMixin

class SystemAccount(Base, AuditMixin):
    __tablename__ = "system_accounts"
    
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False) # ADMIN, SUPER_ADMIN, DEVELOPER
    is_active = Column(Boolean, default=True)
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    last_login_ip = Column(String(45), nullable=True)
