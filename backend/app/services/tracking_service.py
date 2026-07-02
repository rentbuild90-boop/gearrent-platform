import math
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.database.models.tracking import GpsLocation, LiveTracking

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Earth radius in km
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

class TrackingService:
    def __init__(self, db: Session):
        self.db = db

    def update_driver_location(self, driver_id: int, lat: float, lon: float, speed: float = None) -> GpsLocation:
        location = GpsLocation(
            entity_type="DRIVER",
            entity_id=driver_id,
            latitude=lat,
            longitude=lon,
            speed=speed,
            recorded_at=datetime.utcnow()
        )
        self.db.add(location)
        
        # update live tracking if exists
        live_tracking = self.db.query(LiveTracking).filter(LiveTracking.driver_id == driver_id, LiveTracking.status == "ACTIVE").first()
        if live_tracking:
            live_tracking.current_latitude = lat
            live_tracking.current_longitude = lon
            live_tracking.current_speed = speed
            live_tracking.last_updated_at = datetime.utcnow()
            
        self.db.commit()
        self.db.refresh(location)
        return location

    def get_equipment_location(self, equipment_id: int) -> Optional[GpsLocation]:
        return self.db.query(GpsLocation).filter(
            GpsLocation.entity_type == "EQUIPMENT",
            GpsLocation.entity_id == equipment_id
        ).order_by(GpsLocation.recorded_at.desc()).first()

    def find_nearby_vehicles(self, lat: float, lon: float, radius_km: float = 10.0) -> List[dict]:
        # Simple implementation: fetch all active live trackings and calculate distance
        # In a real app we'd use PostGIS or similar
        active_trackings = self.db.query(LiveTracking).filter(LiveTracking.status == "ACTIVE").all()
        
        nearby = []
        for tracking in active_trackings:
            dist = haversine_distance(
                lat, lon, 
                float(tracking.current_latitude), float(tracking.current_longitude)
            )
            if dist <= radius_km:
                nearby.append({
                    "tracking": tracking,
                    "distance_km": dist
                })
                
        # Sort by distance
        nearby.sort(key=lambda x: x["distance_km"])
        return nearby
