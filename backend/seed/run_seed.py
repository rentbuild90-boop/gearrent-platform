import asyncio
import sys

from seed_master import seed_master_data
# We can add other seeders here later
# from seed_auth import seed_auth_data
# from seed_equipment import seed_equipment_data

from app.database.connection import AsyncSessionLocal

async def run_all_seeds():
    async with AsyncSessionLocal() as session:
        try:
            print("Starting database seeding...")
            await seed_master_data(session)
            print("Database seeding completed successfully.")
        except Exception as e:
            print(f"Error during seeding: {e}")
            await session.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(run_all_seeds())
