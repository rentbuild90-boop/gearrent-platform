import os

EQUIPMENT_PATH = r"d:\gear\backend\app\database\models\equipment.py"

equipment_additions = """
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
"""

with open(EQUIPMENT_PATH, "a", encoding="utf-8") as f:
    f.write("\n" + equipment_additions + "\n")

print("Added to equipment.py")
