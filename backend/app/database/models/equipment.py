from sqlalchemy import Column, String, Boolean, JSON, ForeignKey, BigInteger, DECIMAL, DateTime, Text, Date
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class EquipmentCategory(Base, AuditMixin):
    __tablename__ = "equipment_categories"
    
    category_code = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(String(500), nullable=True)
    icon = Column(String(255), nullable=True)
    
    parent_id = Column(BigInteger, ForeignKey("equipment_categories.id"), nullable=True)
    base_price = Column(DECIMAL(12, 2), nullable=False)
    base_commission_rate = Column(DECIMAL(5, 4), default=0.10)
    pricing_unit = Column(String(20), default="DAILY") # HOURLY, DAILY, MONTHLY
    is_active = Column(Boolean, default=True)
    sort_order = Column(BigInteger, default=0)

class Equipment(Base, AuditMixin):
    __tablename__ = "equipment"
    
    equipment_code = Column(String(20), unique=True, index=True, nullable=False)
    owner_id = Column(BigInteger, ForeignKey("owner_profiles.id"), nullable=False)
    category_id = Column(BigInteger, ForeignKey("equipment_categories.id"), nullable=False)
    
    name = Column(String(255), nullable=False)
    brand = Column(String(100), nullable=True)
    model_year = Column(BigInteger, nullable=True)
    registration_number = Column(String(50), nullable=True)
    chassis_number = Column(String(100), nullable=True)
    capacity = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    
    status = Column(String(20), default="PENDING_APPROVAL") # AVAILABLE, RENTED, MAINTENANCE, PENDING_APPROVAL, ARCHIVED
    rating = Column(DECIMAL(3, 2), default=0.0)
    review_count = Column(BigInteger, default=0)
    
    latitude = Column(DECIMAL(10, 8), nullable=True)
    longitude = Column(DECIMAL(11, 8), nullable=True)
    city_id = Column(BigInteger, ForeignKey("cities.id"), nullable=False)
    
    features = Column(JSON, nullable=True)
    
    owner = relationship("OwnerProfile", back_populates="equipment")

class EquipmentImage(Base, AuditMixin):
    __tablename__ = "equipment_images"
    
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False)
    file_path = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    mime_type = Column(String(100), nullable=False)
    sort_order = Column(BigInteger, default=0)
    is_primary = Column(Boolean, default=False)

class EquipmentPricing(Base, AuditMixin):
    __tablename__ = "equipment_pricing"
    
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False)
    pricing_type = Column(String(20), nullable=False) # HOURLY, DAILY, MONTHLY, CUSTOM
    price = Column(DECIMAL(12, 2), nullable=False)
    custom_unit = Column(String(50), nullable=True)
    minimum_rental_period = Column(BigInteger, default=1)
    surge_multiplier = Column(DECIMAL(3, 2), default=1.0)
    discount_weekly = Column(DECIMAL(5, 2), default=0.0)
    discount_monthly = Column(DECIMAL(5, 2), default=0.0)

class EquipmentLocation(Base, AuditMixin):
    __tablename__ = "equipment_locations"
    
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False)
    address = Column(String(500), nullable=False)
    city_id = Column(BigInteger, ForeignKey("cities.id"), nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)
    radius_km = Column(BigInteger, default=50)
    is_current = Column(Boolean, default=True)

class EquipmentDocument(Base, AuditMixin):
    __tablename__ = "equipment_documents"
    
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False)
    document_id = Column(BigInteger, ForeignKey("documents.id"), nullable=False)
    document_type = Column(String(50), nullable=False) # RC, INSURANCE, FITNESS, PERMIT

class EquipmentMaintenance(Base, AuditMixin):
    __tablename__ = "equipment_maintenance"
    
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False)
    type = Column(String(50), nullable=False) # SCHEDULED, UNSCHEDULED, INSPECTION
    description = Column(Text, nullable=False)
    scheduled_date = Column(DateTime(timezone=True), nullable=True)
    completed_date = Column(DateTime(timezone=True), nullable=True)
    cost = Column(DECIMAL(12, 2), default=0.0)
    performed_by = Column(String(255), nullable=True)
    next_maintenance_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(20), default="SCHEDULED") # SCHEDULED, IN_PROGRESS, COMPLETED

class EquipmentAvailability(Base, AuditMixin):
    __tablename__ = "equipment_availability"
    
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False)
    date = Column(Date, nullable=False)
    is_available = Column(Boolean, default=True)
    reason = Column(String(255), nullable=True)

class EquipmentStatusHistory(Base, AuditMixin):
    __tablename__ = "equipment_status_history"
    
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False)
    from_status = Column(String(20), nullable=True)
    to_status = Column(String(20), nullable=False)
    changed_by = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    reason = Column(String(255), nullable=True)

class EquipmentInsurance(Base, AuditMixin):
    __tablename__ = "equipment_insurance"
    
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False)
    provider = Column(String(255), nullable=False)
    policy_number = Column(String(100), nullable=False)
    coverage_type = Column(String(100), nullable=False)
    premium = Column(DECIMAL(12, 2), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    document_id = Column(BigInteger, ForeignKey("documents.id"), nullable=True)
    status = Column(String(20), default="ACTIVE") # ACTIVE, EXPIRED, CANCELLED

class Wishlist(Base, AuditMixin):
    __tablename__ = "wishlists"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False)


class EquipmentFeature(Base, AuditMixin):
    __tablename__ = "equipment_features"
    
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False, index=True)
    feature_name = Column(String(100), nullable=False)
    feature_value = Column(String(255), nullable=True)

class EquipmentServiceHistory(Base, AuditMixin):
    __tablename__ = "equipment_service_history"
    
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False, index=True)
    service_date = Column(DateTime(timezone=True), nullable=False)
    service_type = Column(String(100), nullable=False) # MAINTENANCE, REPAIR
    description = Column(Text, nullable=True)
    cost = Column(DECIMAL(12, 2), nullable=True)
    service_center_name = Column(String(255), nullable=True)
    next_service_due_at = Column(DateTime(timezone=True), nullable=True)

class EquipmentDamageReport(Base, AuditMixin):
    __tablename__ = "equipment_damage_reports"
    
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False, index=True)
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=True, index=True)
    reported_by = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    damage_date = Column(DateTime(timezone=True), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(20), nullable=False) # MINOR, MAJOR, CRITICAL
    status = Column(String(20), default="PENDING") # PENDING, REVIEWING, REPAIRED
    estimated_repair_cost = Column(DECIMAL(12, 2), nullable=True)

class EquipmentLocationHistory(Base, AuditMixin):
    __tablename__ = "equipment_location_history"
    
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False, index=True)
    location_name = Column(String(255), nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=True)
    longitude = Column(DECIMAL(11, 8), nullable=True)
    moved_at = Column(DateTime(timezone=True), nullable=False)
    moved_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)

