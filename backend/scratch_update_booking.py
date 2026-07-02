import os

BOOKING_PATH = r"d:\gear\backend\app\database\models\booking.py"

booking_additions = """
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
"""

with open(BOOKING_PATH, "a", encoding="utf-8") as f:
    f.write("\n" + booking_additions + "\n")

print("Added to booking.py")
