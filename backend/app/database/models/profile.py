from sqlalchemy import Column, String, Boolean, ForeignKey, BigInteger, DECIMAL, DateTime
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class Address(Base, AuditMixin):
    __tablename__ = "addresses"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    type = Column(String(20), nullable=False) # HOME, OFFICE, SITE, BILLING
    address_line_1 = Column(String(255), nullable=False)
    address_line_2 = Column(String(255), nullable=True)
    city_id = Column(BigInteger, ForeignKey("cities.id"), nullable=False)
    district = Column(String(100), nullable=True)
    state = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False)
    pincode = Column(String(20), nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=True)
    longitude = Column(DECIMAL(11, 8), nullable=True)
    is_default = Column(Boolean, default=False)

class Contact(Base, AuditMixin):
    __tablename__ = "contacts"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    type = Column(String(20), nullable=False) # PRIMARY, SECONDARY, EMERGENCY
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=True)
    relationship = Column(String(50), nullable=True)

class Document(Base, AuditMixin):
    __tablename__ = "documents"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    type = Column(String(50), nullable=False) # AADHAAR, PAN, GST, RC, etc.
    document_number = Column(String(100), nullable=True)
    file_path = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    mime_type = Column(String(100), nullable=False)
    verification_status = Column(String(20), default="UNVERIFIED") # UNVERIFIED, PENDING, VERIFIED, REJECTED
    verified_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    rejection_reason = Column(String(255), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)

class Bank(Base, AuditMixin):
    __tablename__ = "banks"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    bank_name = Column(String(100), nullable=False)
    account_holder_name = Column(String(100), nullable=False)
    account_number_encrypted = Column(String(255), nullable=False)
    ifsc_code = Column(String(20), nullable=False)
    branch = Column(String(100), nullable=True)
    account_type = Column(String(20), nullable=False) # SAVINGS, CURRENT
    is_primary = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)

class EmergencyContact(Base, AuditMixin):
    __tablename__ = "emergency_contacts"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    relationship = Column(String(50), nullable=False)
    is_primary = Column(Boolean, default=False)

class Preference(Base, AuditMixin):
    __tablename__ = "preferences"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    key = Column(String(100), nullable=False)
    value = Column(String(255), nullable=False)
    group = Column(String(50), nullable=False) # NOTIFICATION, DISPLAY, PRIVACY


class DocumentType(Base, AuditMixin):
    __tablename__ = "document_types"
    
    name = Column(String(100), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    is_required_owner = Column(Boolean, default=False)
    is_required_driver = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

class BankAccount(Base, AuditMixin):
    __tablename__ = "bank_accounts"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    account_name = Column(String(255), nullable=False)
    account_number = Column(String(100), nullable=False)
    ifsc_code = Column(String(50), nullable=False)
    bank_name = Column(String(255), nullable=False)
    is_primary = Column(Boolean, default=False)
    status = Column(String(20), default="PENDING") # PENDING, VERIFIED, REJECTED

class SavedLocation(Base, AuditMixin):
    __tablename__ = "saved_locations"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False) # e.g. "Site A", "Home"
    address = Column(String(500), nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=True)
    longitude = Column(DECIMAL(11, 8), nullable=True)
    is_default = Column(Boolean, default=False)

