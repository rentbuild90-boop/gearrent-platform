import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings
from app.database.models import Base
from sqlalchemy import text

async def reset_db():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        print("Dropping all tables...")
        await conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
        await conn.run_sync(Base.metadata.drop_all)
        await conn.execute(text("DROP TABLE IF EXISTS alembic_version;"))
        await conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
    await engine.dispose()
    print("Database tables reset.")

if __name__ == "__main__":
    asyncio.run(reset_db())
