from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.base import BaseRepository
from app.database.models.chat import Conversation, Message, ConversationMember

class ConversationRepository(BaseRepository[Conversation]):
    pass

class ConversationMemberRepository(BaseRepository[ConversationMember]):
    async def get_user_conversations(self, db: AsyncSession, user_id: int) -> List[ConversationMember]:
        query = select(self.model).filter(
            self.model.user_id == user_id,
            self.model.deleted_at.is_(None)
        )
        result = await db.execute(query)
        return list(result.scalars().all())

    async def get_conversation_members(self, db: AsyncSession, conversation_id: int) -> List[ConversationMember]:
        query = select(self.model).filter(
            self.model.conversation_id == conversation_id,
            self.model.deleted_at.is_(None)
        )
        result = await db.execute(query)
        return list(result.scalars().all())

class MessageRepository(BaseRepository[Message]):
    async def get_by_conversation(self, db: AsyncSession, conversation_id: int, skip: int = 0, limit: int = 100) -> List[Message]:
        query = select(self.model).filter(
            self.model.conversation_id == conversation_id,
            self.model.deleted_at.is_(None)
        ).order_by(self.model.created_at.asc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

conversation_repo = ConversationRepository(Conversation)
conversation_member_repo = ConversationMemberRepository(ConversationMember)
message_repo = MessageRepository(Message)
