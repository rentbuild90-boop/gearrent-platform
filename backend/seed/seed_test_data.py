import asyncio
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.connection import AsyncSessionLocal
from app.database.models.auth import User, Role, UserRole
from app.database.models.equipment import Equipment, EquipmentCategory, EquipmentPricing
from app.database.models.owner import OwnerProfile
from app.database.models.master import City
from app.core.security import get_password_hash
from app.core.deps import RoleName

async def seed_test_data(db: AsyncSession):
    print("Seeding test data...")
    
    # Ensure roles exist
    role_names = [r.value for r in RoleName]
    roles = {}
    
    for r_name in role_names:
        result = await db.execute(select(Role).where(Role.name == r_name))
        role = result.scalars().first()
        if not role:
            slug = r_name.lower().replace(" ", "_")
            role = Role(name=r_name, slug=slug)
            db.add(role)
            await db.flush()
        roles[r_name] = role

    # Create users
    test_users = [
        {"email": "admin@gearrent.com", "first": "Admin", "last": "User", "role": RoleName.ADMIN.value, "is_superadmin": True},
        {"email": "owner@gearrent.com", "first": "Owner", "last": "User", "role": RoleName.OWNER.value, "is_superadmin": False},
        {"email": "driver@gearrent.com", "first": "Driver", "last": "User", "role": RoleName.DRIVER.value, "is_superadmin": False},
        {"email": "renter@gearrent.com", "first": "Renter", "last": "User", "role": RoleName.RENTER.value, "is_superadmin": False},
        {"email": "support@gearrent.com", "first": "Support", "last": "User", "role": RoleName.SUPPORT.value, "is_superadmin": False},
    ]

    pwd_hash = get_password_hash("password123")
    
    for u_data in test_users:
        result = await db.execute(select(User).where(User.email == u_data["email"]))
        user = result.scalars().first()
        if not user:
            phone = f"+91999999999{test_users.index(u_data)}"
            user = User(
                user_code=f"USR-{test_users.index(u_data)}",
                email=u_data["email"],
                phone=phone,
                country_code="IN",
                password_hash=pwd_hash,
                first_name=u_data["first"],
                last_name=u_data["last"],
                is_superadmin=u_data["is_superadmin"]
            )
            db.add(user)
            await db.flush()
            
            # Assign role
            role = roles[u_data["role"]]
            db.add(UserRole(user_id=user.id, role_id=role.id, is_primary=True))
            
    await db.flush()

    # Seed equipment for the owner
    owner_user_result = await db.execute(select(User).where(User.email == "owner@gearrent.com"))
    owner_user = owner_user_result.scalars().first()
    
    if owner_user:
        # Check owner profile
        profile_res = await db.execute(select(OwnerProfile).where(OwnerProfile.user_id == owner_user.id))
        owner_profile = profile_res.scalars().first()
        if not owner_profile:
            owner_profile = OwnerProfile(
                owner_code="OWN-001",
                user_id=owner_user.id,
                company_name="Test Rentals Pvt Ltd",
                status="ACTIVE"
            )
            db.add(owner_profile)
            await db.flush()
            
        cat_result = await db.execute(select(EquipmentCategory).limit(1))
        category = cat_result.scalars().first()
        
        city_result = await db.execute(select(City).limit(1))
        city = city_result.scalars().first()

        if owner_profile and category and city:
            eq_result = await db.execute(select(Equipment).where(Equipment.owner_id == owner_profile.id))
            eq = eq_result.scalars().first()
            if not eq:
                eq = Equipment(
                    equipment_code="EQ-001",
                    owner_id=owner_profile.id,
                    category_id=category.id,
                    city_id=city.id,
                    name="JCB 3DX Backhoe Loader",
                    brand="JCB",
                    description="Versatile backhoe loader for construction.",
                    model_year=2021,
                    status="AVAILABLE"
                )
                db.add(eq)
                await db.flush()
                
                # Add pricing
                db.add(EquipmentPricing(
                    equipment_id=eq.id,
                    pricing_type="DAILY",
                    price=3500.00
                ))
                db.add(EquipmentPricing(
                    equipment_id=eq.id,
                    pricing_type="HOURLY",
                    price=500.00
                ))
                
    await db.commit()
    print("Test data seeded successfully.")

async def run():
    async with AsyncSessionLocal() as session:
        await seed_test_data(session)

if __name__ == "__main__":
    asyncio.run(run())
