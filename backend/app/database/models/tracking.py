from sqlalchemy import BigInteger, Boolean, Column, DECIMAL, DateTime, ForeignKey, JSON, String, Text
from app.database.base import Base, AuditMixin

class GpsLocation(Base, AuditMixin):
    __tablename__ = "gps_locations"
    
    entity_type = Column(String(20), nullable=False) # DRIVER, EQUIPMENT, VEHICLE
    entity_id = Column(BigInteger, nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)
    speed = Column(DECIMAL(6, 2), nullable=True)
    heading = Column(DECIMAL(5, 2), nullable=True)
    accuracy = Column(DECIMAL(6, 2), nullable=True)
    altitude = Column(DECIMAL(8, 2), nullable=True)
    recorded_at = Column(DateTime(timezone=True), nullable=False)

class TrackingHistory(Base, AuditMixin):
    __tablename__ = "tracking_history"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    driver_id = Column(BigInteger, ForeignKey("driver_profiles.id"), nullable=True)
    equipment_id = Column(BigInteger, ForeignKey("equipment.id"), nullable=True)
    event_type = Column(String(50), nullable=False) # STARTED, LOCATION_UPDATE, STOPPED, GEOFENCE_ENTER, GEOFENCE_EXIT
    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)
    speed = Column(DECIMAL(6, 2), nullable=True)
    heading = Column(DECIMAL(5, 2), nullable=True)
    accuracy = Column(DECIMAL(6, 2), nullable=True)
    recorded_at = Column(DateTime(timezone=True), nullable=False)

class LiveTracking(Base, AuditMixin):
    __tablename__ = "live_tracking"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    driver_id = Column(BigInteger, ForeignKey("driver_profiles.id"), nullable=True)
    current_latitude = Column(DECIMAL(10, 8), nullable=False)
    current_longitude = Column(DECIMAL(11, 8), nullable=False)
    current_speed = Column(DECIMAL(6, 2), nullable=True)
    current_heading = Column(DECIMAL(5, 2), nullable=True)
    eta_minutes = Column(BigInteger, nullable=True)
    status = Column(String(20), default="ACTIVE") # ACTIVE, PAUSED, COMPLETED
    last_updated_at = Column(DateTime(timezone=True), nullable=False)

class DeliveryRoute(Base, AuditMixin):
    __tablename__ = "delivery_routes"
    
    booking_delivery_id = Column(BigInteger, ForeignKey("booking_delivery.id"), nullable=False)
    waypoints = Column(JSON, nullable=False)
    total_distance_km = Column(DECIMAL(8, 2), nullable=True)
    estimated_duration_minutes = Column(BigInteger, nullable=True)
    actual_duration_minutes = Column(BigInteger, nullable=True)
    route_polyline = Column(Text, nullable=True)


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

