from sqlalchemy import Column, String, Boolean, JSON, ForeignKey, BigInteger, DateTime, Text
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class AuditLog(Base, AuditMixin):
    __tablename__ = "audit_logs"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    role = Column(String(50), nullable=True)
    action = Column(String(255), nullable=False)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(BigInteger, nullable=True)
    old_values = Column(JSON, nullable=True)
    new_values = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(255), nullable=True)
    metadata_json = Column("metadata", JSON, nullable=True)

class ActivityLog(Base, AuditMixin):
    __tablename__ = "activity_logs"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    action = Column(String(255), nullable=False)
    entity_type = Column(String(100), nullable=True)
    entity_id = Column(BigInteger, nullable=True)
    description = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)

class FeatureFlag(Base, AuditMixin):
    __tablename__ = "feature_flags"
    
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    is_enabled = Column(Boolean, default=False)
    rollout_percentage = Column(BigInteger, default=100)
    conditions = Column(JSON, nullable=True)

class SystemSetting(Base, AuditMixin):
    __tablename__ = "system_settings"
    
    key = Column(String(100), unique=True, index=True, nullable=False)
    value = Column(Text, nullable=False)
    group = Column(String(50), nullable=False) # GENERAL, FINANCIAL, SECURITY, NOTIFICATION
    data_type = Column(String(20), nullable=False) # STRING, NUMBER, BOOLEAN, JSON
    description = Column(String(255), nullable=True)

class Report(Base, AuditMixin):
    __tablename__ = "reports"
    
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False) # REVENUE, BOOKINGS, EQUIPMENT, USERS, CUSTOM
    generated_by = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    parameters = Column(JSON, nullable=True)
    file_path = Column(String(255), nullable=True)
    file_format = Column(String(20), nullable=False) # CSV, PDF, XLSX
    status = Column(String(20), default="GENERATING") # GENERATING, COMPLETED, FAILED
    generated_at = Column(DateTime(timezone=True), nullable=True)

class RoleApplication(Base, AuditMixin):
    __tablename__ = "role_applications"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    requested_role = Column(String(20), nullable=False) # OWNER, DRIVER
    status = Column(String(20), default="PENDING") # PENDING, APPROVED, REJECTED
    reviewed_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
