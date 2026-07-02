import os

TRACKING_PATH = r"d:\gear\backend\app\database\models\tracking.py"

tracking_additions = """
class GpsHistory(Base, AuditMixin):
    __tablename__ = "gps_history"
    
    driver_id = Column(BigInteger, ForeignKey("driver_profiles.id"), nullable=True, index=True)
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=True, index=True)
    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)
    speed = Column(DECIMAL(6, 2), nullable=True)
    heading = Column(DECIMAL(5, 2), nullable=True)
    accuracy = Column(DECIMAL(6, 2), nullable=True)
    recorded_at = Column(DateTime(timezone=True), nullable=False, index=True)

class RoutePoint(Base, AuditMixin):
    __tablename__ = "route_points"
    
    delivery_route_id = Column(BigInteger, ForeignKey("delivery_routes.id"), nullable=False, index=True)
    sequence_number = Column(BigInteger, nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)

class Geofence(Base, AuditMixin):
    __tablename__ = "geofences"
    
    name = Column(String(100), nullable=False)
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=True, index=True)
    boundary_polygon = Column(JSON, nullable=False) # list of lat/lng pairs
    is_active = Column(Boolean, default=True)
"""

with open(TRACKING_PATH, "a", encoding="utf-8") as f:
    f.write("\n" + tracking_additions + "\n")

print("Added to tracking.py")
