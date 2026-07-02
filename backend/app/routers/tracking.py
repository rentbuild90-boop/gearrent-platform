from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database.connection import get_db
from app.services.tracking_service import TrackingService

router = APIRouter(prefix="/tracking", tags=["tracking"])

class LocationUpdate(BaseModel):
    driver_id: int
    latitude: float
    longitude: float
    speed: Optional[float] = None

class EquipmentLocation(BaseModel):
    equipment_id: int
    latitude: float
    longitude: float
    recorded_at: str

class NearbyVehicle(BaseModel):
    driver_id: int
    booking_id: int
    latitude: float
    longitude: float
    distance_km: float

@router.post("/driver/location")
def update_driver_location(update: LocationUpdate, db: Session = Depends(get_db)):
    service = TrackingService(db)
    loc = service.update_driver_location(update.driver_id, update.latitude, update.longitude, update.speed)
    return {"message": "Location updated successfully", "location_id": loc.id}

@router.get("/equipment/{equipment_id}/location")
def get_equipment_location(equipment_id: int, db: Session = Depends(get_db)):
    service = TrackingService(db)
    loc = service.get_equipment_location(equipment_id)
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    return {
        "equipment_id": loc.entity_id,
        "latitude": float(loc.latitude),
        "longitude": float(loc.longitude),
        "recorded_at": loc.recorded_at.isoformat()
    }

@router.get("/vehicles/nearby")
def find_nearby_vehicles(
    latitude: float = Query(...), 
    longitude: float = Query(...), 
    radius_km: float = Query(10.0), 
    db: Session = Depends(get_db)
):
    service = TrackingService(db)
    nearby = service.find_nearby_vehicles(latitude, longitude, radius_km)
    
    result = []
    for item in nearby:
        tracking = item["tracking"]
        result.append({
            "driver_id": tracking.driver_id,
            "booking_id": tracking.booking_id,
            "latitude": float(tracking.current_latitude),
            "longitude": float(tracking.current_longitude),
            "distance_km": round(item["distance_km"], 2)
        })
    return result
