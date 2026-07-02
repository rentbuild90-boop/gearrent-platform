from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.base import BaseRepository
from app.database.models.payment import Wallet, WalletTransaction, Payment

class WalletRepository(BaseRepository[Wallet]):
    async def get_by_user_id(self, db: AsyncSession, user_id: int) -> Optional[Wallet]:
        query = select(self.model).filter(
            self.model.user_id == user_id, 
            self.model.deleted_at.is_(None)
        )
        result = await db.execute(query)
        return result.scalars().first()

class WalletTransactionRepository(BaseRepository[WalletTransaction]):
    async def get_by_wallet_id(self, db: AsyncSession, wallet_id: int, skip: int = 0, limit: int = 100) -> List[WalletTransaction]:
        query = select(self.model).filter(
            self.model.wallet_id == wallet_id,
            self.model.deleted_at.is_(None)
        ).order_by(self.model.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

class PaymentRepository(BaseRepository[Payment]):
    pass

wallet_repo = WalletRepository(Wallet)
wallet_tx_repo = WalletTransactionRepository(WalletTransaction)
payment_repo = PaymentRepository(Payment)
