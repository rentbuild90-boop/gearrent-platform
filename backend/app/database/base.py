import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, String, BigInteger, func, ForeignKey
from sqlalchemy.orm import DeclarativeBase, declared_attr

class Base(DeclarativeBase):
    pass

def generate_uuid():
    return str(uuid.uuid4())

class AuditMixin:
    """Provides common auditing columns to all models."""
    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    
    # Standard User Audit
    created_by = Column(BigInteger, ForeignKey("users.id"), nullable=True, index=True)
    updated_by = Column(BigInteger, ForeignKey("users.id"), nullable=True, index=True)
    
    # Optimistic Locking
    version = Column(BigInteger, default=1, nullable=False)

    @declared_attr
    def __tablename__(cls):
        # Automatically generate tablename from class name
        import re
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', cls.__name__)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()
