from sqlalchemy import BigInteger, Boolean, Column, DECIMAL, DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class Booking(Base, AuditMixin):
    __tablename__ = "bookings"
    
    booking_code = Column(String(20), unique=True, index=True, nullable=False)
    renter_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False)
    owner_id = Column(BigInteger, ForeignKey("owner_profiles.id"), nullable=False)
    driver_id = Column(BigInteger, ForeignKey("driver_profiles.id"), nullable=True)
    
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    pickup_location = Column(String(500), nullable=False)
    dropoff_location = Column(String(500), nullable=False)
    
    daily_rate = Column(DECIMAL(12, 2), nullable=False)
    hourly_rate = Column(DECIMAL(12, 2), nullable=True)
    total_days = Column(BigInteger, nullable=False)
    
    subtotal = Column(DECIMAL(14, 2), nullable=False)
    service_fee = Column(DECIMAL(12, 2), nullable=False) # 500 flat
    platform_commission = Column(DECIMAL(14, 2), nullable=False)
    total_amount = Column(DECIMAL(14, 2), nullable=False)
    
    payment_status = Column(String(20), default="PENDING") # PENDING, PAID, PARTIALLY_PAID, REFUNDED
    status = Column(String(30), default="DRAFT", index=True) # DRAFT, REQUESTED, OWNER_REVIEW, ACCEPTED, PAYMENT_PENDING, PAID, DRIVER_ASSIGNED, DELIVERY, ACTIVE, EXTENSION, RETURN, INSPECTION, COMPLETED, REVIEW, CLOSED, CANCELLED, DISPUTED
    
    dispute_status = Column(String(30), nullable=True, index=True) # NONE, OPENED, RESOLVED, ESCALATED
    cancellation_reason = Column(Text, nullable=True)
    promo_code_id = Column(BigInteger, ForeignKey("coupons.id"), nullable=True)
    city_id = Column(BigInteger, ForeignKey("cities.id"), nullable=False)

class BookingItem(Base, AuditMixin):
    __tablename__ = "booking_items"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False)
    quantity = Column(BigInteger, default=1)
    unit_price = Column(DECIMAL(12, 2), nullable=False)
    total_price = Column(DECIMAL(14, 2), nullable=False)
    notes = Column(Text, nullable=True)

class BookingExtension(Base, AuditMixin):
    __tablename__ = "booking_extensions"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    original_end_date = Column(DateTime(timezone=True), nullable=False)
    new_end_date = Column(DateTime(timezone=True), nullable=False)
    additional_days = Column(BigInteger, nullable=False)
    additional_amount = Column(DECIMAL(14, 2), nullable=False)
    status = Column(String(20), default="REQUESTED") # REQUESTED, APPROVED, REJECTED, PAID
    approved_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)

class BookingStatusHistory(Base, AuditMixin):
    __tablename__ = "booking_status_history"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    from_status = Column(String(30), nullable=True)
    to_status = Column(String(30), nullable=False)
    changed_by = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    notes = Column(Text, nullable=True)
    metadata_json = Column("metadata", JSON, nullable=True)

class BookingDelivery(Base, AuditMixin):
    __tablename__ = "booking_delivery"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    delivery_type = Column(String(20), nullable=False) # PICKUP, DELIVERY, RETURN
    pickup_address = Column(String(500), nullable=False)
    delivery_address = Column(String(500), nullable=False)
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    actual_at = Column(DateTime(timezone=True), nullable=True)
    driver_id = Column(BigInteger, ForeignKey("driver_profiles.id"), nullable=True)
    status = Column(String(20), default="SCHEDULED") # SCHEDULED, IN_TRANSIT, DELIVERED, FAILED
    delivery_notes = Column(Text, nullable=True)
    delivery_fee = Column(DECIMAL(12, 2), default=0.0)

class BookingCancellation(Base, AuditMixin):
    __tablename__ = "booking_cancellation"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    cancelled_by = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    reason = Column(Text, nullable=False)
    cancellation_fee = Column(DECIMAL(14, 2), default=0.0)
    refund_amount = Column(DECIMAL(14, 2), default=0.0)
    refund_status = Column(String(20), default="PENDING") # PENDING, PROCESSED, FAILED
    processed_at = Column(DateTime(timezone=True), nullable=True)

class BookingDocument(Base, AuditMixin):
    __tablename__ = "booking_documents"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    document_id = Column(BigInteger, ForeignKey("documents.id"), nullable=False)
    document_type = Column(String(50), nullable=False) # INVOICE, RECEIPT, INSPECTION_REPORT, WAIVER

class BookingLog(Base, AuditMixin):
    __tablename__ = "booking_logs"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    action = Column(String(100), nullable=False)
    actor_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)


class BookingEvent(Base, AuditMixin):
    __tablename__ = "booking_events"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False) # e.g. DRIVER_ASSIGNED, PAYMENT_RECEIVED, DISPUTE_OPENED
    description = Column(String(255), nullable=True)
    event_metadata = Column(JSON, nullable=True)

class BookingInspection(Base, AuditMixin):
    __tablename__ = "booking_inspection"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False, index=True)
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=False, index=True)
    inspection_type = Column(String(20), nullable=False) # PRE_RENTAL, POST_RENTAL
    inspector_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    inspection_date = Column(DateTime(timezone=True), nullable=False)
    odometer_reading = Column(DECIMAL(12, 2), nullable=True)
    fuel_level = Column(DECIMAL(5, 2), nullable=True)
    notes = Column(Text, nullable=True)
    is_passed = Column(Boolean, default=True)

class BookingReturn(Base, AuditMixin):
    __tablename__ = "booking_return"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), unique=True, nullable=False, index=True)
    returned_at = Column(DateTime(timezone=True), nullable=False)
    received_by = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    return_condition = Column(String(20), nullable=False) # GOOD, DAMAGED, DIRTY
    delay_hours = Column(DECIMAL(10, 2), default=0.0)
    penalty_amount = Column(DECIMAL(12, 2), default=0.0)
    notes = Column(Text, nullable=True)

