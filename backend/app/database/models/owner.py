from sqlalchemy import Column, String, Boolean, ForeignKey, BigInteger, DECIMAL, DateTime
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class OwnerProfile(Base, AuditMixin):
    __tablename__ = "owner_profiles"
    
    owner_code = Column(String(20), unique=True, index=True, nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String(255), nullable=False)
    company_logo_url = Column(String(255), nullable=True)
    gstin = Column(String(50), nullable=True)
    registered_address = Column(String(500), nullable=True)
    
    kyc_status = Column(String(20), default="PENDING") # PENDING, SUBMITTED, VERIFIED, REJECTED
    company_registration_doc_url = Column(String(255), nullable=True)
    tax_doc_url = Column(String(255), nullable=True)
    address_proof_url = Column(String(255), nullable=True)
    kyc_submitted_at = Column(DateTime(timezone=True), nullable=True)
    kyc_verified_at = Column(DateTime(timezone=True), nullable=True)
    kyc_rejection_reason = Column(String(500), nullable=True)
    rating = Column(DECIMAL(3, 2), default=0.0)
    total_equipment = Column(BigInteger, default=0)
    
    status = Column(String(20), default="PENDING") # ACTIVE, SUSPENDED, PENDING
    instant_book_enabled = Column(Boolean, default=False)
    
    user = relationship("User", foreign_keys=[user_id])
    equipment = relationship("Equipment", back_populates="owner")
    settings = relationship("OwnerSetting", back_populates="owner", uselist=False)

class OwnerVerification(Base, AuditMixin):
    __tablename__ = "owner_verification"
    
    owner_id = Column(BigInteger, ForeignKey("owner_profiles.id"), nullable=False)
    verification_type = Column(String(50), nullable=False) # GST, PAN, BUSINESS_REG
    document_id = Column(BigInteger, ForeignKey("documents.id"), nullable=False)
    status = Column(String(20), default="UNVERIFIED") # UNVERIFIED, PENDING, VERIFIED, REJECTED
    verified_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(String(500), nullable=True)

class OwnerSetting(Base, AuditMixin):
    __tablename__ = "owner_settings"
    
    owner_id = Column(BigInteger, ForeignKey("owner_profiles.id"), unique=True, nullable=False)
    notification_new_bookings = Column(Boolean, default=True)
    notification_payment_updates = Column(Boolean, default=True)
    notification_driver_updates = Column(Boolean, default=True)
    auto_accept_bookings = Column(Boolean, default=False)
    minimum_rental_days = Column(BigInteger, default=1)
    
    owner = relationship("OwnerProfile", back_populates="settings")
