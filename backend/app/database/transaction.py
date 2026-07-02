from contextlib import asynccontextmanager
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import AsyncSessionLocal

@asynccontextmanager
async def transaction() -> AsyncGenerator[AsyncSession, None]:
    """
    Context manager for database transactions.
    Automatically commits on success, rolls back on exception.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
