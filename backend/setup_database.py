import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings

async def setup_database():
    print(f"Setting up database: {settings.MYSQL_DATABASE}")
    
    # Connect without database specified to create it
    # We replace the db name with empty string or mysql default
    base_url = settings.DATABASE_URL.rsplit('/', 1)[0]
    
    # Note: aiomysql requires a database if using connection string directly
    # So we'll use a temporary engine connecting to 'mysql'
    engine = create_async_engine(f"{base_url}/mysql", echo=True)
    
    async with engine.begin() as conn:
        print(f"Creating database {settings.MYSQL_DATABASE} if not exists...")
        # aiomysql doesn't fully support text() for CREATE DATABASE in begin() if it doesn't return rows,
        # but execute handles it
        from sqlalchemy import text
        await conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{settings.MYSQL_DATABASE}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
        
    await engine.dispose()
    print("Database creation complete.")

def verify_tables():
    from app.database.models import Base
    print(f"Total tables defined in SQLAlchemy: {len(Base.metadata.tables)}")
    for table_name in Base.metadata.tables.keys():
        print(f" - {table_name}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--verify":
        verify_tables()
    else:
        asyncio.run(setup_database())
