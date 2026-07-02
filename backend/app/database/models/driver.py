from sqlalchemy import Column, String, Boolean, JSON, ForeignKey, BigInteger, DECIMAL, DateTime, Text
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class DriverProfile(Base, AuditMixin):
    __tablename__ = "driver_profiles"
    
    driver_code = Column(String(20), unique=True, index=True, nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id"), unique=True, nullable=False)
    owner_id = Column(BigInteger, ForeignKey("owner_profiles.id"), nullable=True) # nullable for fleet driver
    
    license_number = Column(String(50), nullable=False)
    experience_years = Column(BigInteger, default=0)
    expertise = Column(JSON, nullable=True) # ["Excavators","Cranes","Loaders"]
    
    kyc_status = Column(String(20), default="PENDING") # PENDING, SUBMITTED, VERIFIED, REJECTED
    driving_license_doc_url = Column(String(255), nullable=True)
    background_check_doc_url = Column(String(255), nullable=True)
    kyc_submitted_at = Column(DateTime(timezone=True), nullable=True)
    kyc_verified_at = Column(DateTime(timezone=True), nullable=True)
    kyc_rejection_reason = Column(String(500), nullable=True)
    rating = Column(DECIMAL(3, 2), default=0.0)
    total_trips = Column(BigInteger, default=0)
    total_hours = Column(BigInteger, default=0)
    
    status = Column(String(20), default="AVAILABLE") # AVAILABLE, ON_JOB, OFFLINE
    vehicle_class = Column(String(50), nullable=True)
    
    user = relationship("User", foreign_keys=[user_id])
    owner = relationship("OwnerProfile", foreign_keys=[owner_id])
    assignments = relationship("DriverAssignment", back_populates="driver")

class DriverAssignment(Base, AuditMixin):
    __tablename__ = "driver_assignments"
    
    driver_id = Column(BigInteger, ForeignKey("driver_profiles.id"), nullable=False)
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False)
    assigned_by = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    
    instructions = Column(Text, nullable=True)
    pickup_location = Column(String(255), nullable=True)
    dropoff_location = Column(String(255), nullable=True)
    
    scheduled_start = Column(DateTime(timezone=True), nullable=True)
    scheduled_end = Column(DateTime(timezone=True), nullable=True)
    actual_start = Column(DateTime(timezone=True), nullable=True)
    actual_end = Column(DateTime(timezone=True), nullable=True)
    
    payout_amount = Column(DECIMAL(14, 2), nullable=True)
    status = Column(String(20), default="PENDING") # PENDING, ACCEPTED, DECLINED, EN_ROUTE, OPERATING, COMPLETED, CANCELLED
    
    driver = relationship("DriverProfile", back_populates="assignments")

class DriverAvailability(Base, AuditMixin):
    __tablename__ = "driver_availability"
    
    driver_id = Column(BigInteger, ForeignKey("driver_profiles.id"), nullable=False)
    day_of_week = Column(BigInteger, nullable=False) # 0=Monday, 6=Sunday
    start_time = Column(String(10), nullable=False) # "08:00"
    end_time = Column(String(10), nullable=False) # "18:00"
    is_available = Column(Boolean, default=True)

class DriverLocation(Base, AuditMixin):
    __tablename__ = "driver_locations"
    
    driver_id = Column(BigInteger, ForeignKey("driver_profiles.id"), nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)
    speed = Column(DECIMAL(6, 2), nullable=True)
    heading = Column(DECIMAL(5, 2), nullable=True)
    accuracy = Column(DECIMAL(6, 2), nullable=True)
    recorded_at = Column(DateTime(timezone=True), nullable=False)

class DriverDocument(Base, AuditMixin):
    __tablename__ = "driver_documents"
    
    driver_id = Column(BigInteger, ForeignKey("driver_profiles.id"), nullable=False)
    document_id = Column(BigInteger, ForeignKey("documents.id"), nullable=False)
    document_type = Column(String(50), nullable=False) # HMV_LICENSE, CRANE_CERT, BACKGROUND_CHECK
    status = Column(String(20), nullable=False)

class DriverRating(Base, AuditMixin):
    __tablename__ = "driver_ratings"
    
    driver_id = Column(BigInteger, ForeignKey("driver_profiles.id"), nullable=False)
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    rated_by = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    rating = Column(DECIMAL(3, 2), nullable=False)
    comment = Column(Text, nullable=True)
