import asyncio
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import AsyncSessionLocal
from app.database.models.master import Country, State, District, City, Currency, VehicleBrand, EquipmentModel
from app.database.models.equipment import EquipmentCategory
from app.database.models.profile import DocumentType

async def seed_master_data(db: AsyncSession):
    print("Seeding master data...")
    
    # Currency
    inr = Currency(code="INR", name="Indian Rupee", symbol="₹")
    db.add(inr)
    
    # Country
    india = Country(name="India", code="IN", dial_code="+91", currency_code="INR")
    db.add(india)
    await db.flush()
    
    # States
    maharashtra = State(country_id=india.id, name="Maharashtra", code="MH")
    karnataka = State(country_id=india.id, name="Karnataka", code="KA")
    assam = State(country_id=india.id, name="Assam", code="AS")
    db.add_all([maharashtra, karnataka, assam])
    await db.flush()
    
    # Districts & Cities
    # Mumbai
    mumbai_dist = District(state_id=maharashtra.id, name="Mumbai Suburban")
    db.add(mumbai_dist)
    await db.flush()
    mumbai = City(district_id=mumbai_dist.id, state_id=maharashtra.id, country_id=india.id, name="Mumbai", latitude=19.0760, longitude=72.8777)
    
    # Bengaluru
    blr_dist = District(state_id=karnataka.id, name="Bengaluru Urban")
    db.add(blr_dist)
    await db.flush()
    blr = City(district_id=blr_dist.id, state_id=karnataka.id, country_id=india.id, name="Bengaluru", latitude=12.9716, longitude=77.5946)
    
    # Guwahati
    kamrup_dist = District(state_id=assam.id, name="Kamrup Metropolitan")
    db.add(kamrup_dist)
    await db.flush()
    guwahati = City(district_id=kamrup_dist.id, state_id=assam.id, country_id=india.id, name="Guwahati", latitude=26.1445, longitude=91.7362)
    
    db.add_all([mumbai, blr, guwahati])
    
    # Categories
    categories = [
        {"code": "CAT-01", "name": "Excavators", "slug": "excavators", "price": 5000},
        {"code": "CAT-02", "name": "Cranes", "slug": "cranes", "price": 12000},
        {"code": "CAT-03", "name": "Backhoe Loaders", "slug": "backhoe-loaders", "price": 3500},
        {"code": "CAT-04", "name": "Forklifts", "slug": "forklifts", "price": 2000},
        {"code": "CAT-05", "name": "Dump Trucks", "slug": "dump-trucks", "price": 4000},
        {"code": "CAT-06", "name": "Scissor Lifts", "slug": "scissor-lifts", "price": 2500},
        {"code": "CAT-07", "name": "Concrete Mixers", "slug": "concrete-mixers", "price": 1500},
        {"code": "CAT-08", "name": "Compactors", "slug": "compactors", "price": 3000},
        {"code": "CAT-09", "name": "Generators", "slug": "generators", "price": 1000},
        {"code": "CAT-10", "name": "Bulldozers", "slug": "bulldozers", "price": 6000},
    ]
    
    for c in categories:
        db.add(EquipmentCategory(
            category_code=c["code"],
            name=c["name"],
            slug=c["slug"],
            base_price=c["price"]
        ))
        
    await db.flush()
    
    # Document Types
    docs = [
        {"name": "Aadhaar Card", "code": "AADHAAR", "is_required_owner": True, "is_required_driver": True},
        {"name": "PAN Card", "code": "PAN", "is_required_owner": True, "is_required_driver": False},
        {"name": "Driving License", "code": "DL", "is_required_owner": False, "is_required_driver": True},
        {"name": "GST Certificate", "code": "GST", "is_required_owner": True, "is_required_driver": False}
    ]
    for d in docs:
        db.add(DocumentType(
            name=d["name"], code=d["code"], 
            is_required_owner=d["is_required_owner"], 
            is_required_driver=d["is_required_driver"]
        ))
        
    # Vehicle Brands & Models
    cat = db.add(VehicleBrand(name="Caterpillar", slug="caterpillar"))
    jcb = db.add(VehicleBrand(name="JCB", slug="jcb"))
    await db.flush()
    
    # Needs to fetch equipment_category ID, assume JCB Backhoe loader
    # Using the first category ID for simplicity (Excavators)
    # This is a sample seeding
    
    await db.commit()
    print("Master data seeded successfully.")

async def run():
    async with AsyncSessionLocal() as session:
        await seed_master_data(session)

if __name__ == "__main__":
    asyncio.run(run())
