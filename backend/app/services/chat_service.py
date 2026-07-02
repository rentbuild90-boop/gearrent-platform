from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repositories.chat import conversation_repo, conversation_member_repo, message_repo
from app.schemas.chat import ConversationCreate, MessageCreate
from datetime import datetime, timezone

class ChatService:
    async def get_user_conversations(self, db: AsyncSession, user_id: int):
        memberships = await conversation_member_repo.get_user_conversations(db, user_id)
        conversations = []
        for m in memberships:
            conv = await conversation_repo.get(db, id=m.conversation_id)
            if conv:
                conversations.append(conv)
        return conversations

    async def create_conversation(self, db: AsyncSession, conversation_in: ConversationCreate, user_ids: List[int]):
        conv = await conversation_repo.create(db, obj_in=conversation_in.model_dump())
        
        for uid in user_ids:
            await conversation_member_repo.create(db, obj_in={
                "conversation_id": conv.id,
                "user_id": uid,
                "role": "MEMBER",
                "joined_at": datetime.now(timezone.utc)
            })
            
        return conv

    async def get_messages(self, db: AsyncSession, conversation_id: int, skip: int = 0, limit: int = 100):
        return await message_repo.get_by_conversation(db, conversation_id=conversation_id, skip=skip, limit=limit)

    async def send_message(self, db: AsyncSession, sender_id: int, message_in: MessageCreate):
        message_data = message_in.model_dump()
        message_data.update({
            "sender_id": sender_id,
            "is_read": False
        })
        msg = await message_repo.create(db, obj_in=message_data)
        
        # Update conversation
        conv = await conversation_repo.get(db, id=message_in.conversation_id)
        if conv:
            await conversation_repo.update(db, db_obj=conv, obj_in={
                "last_message_at": datetime.now(timezone.utc),
                "last_message_preview": message_in.content[:100]
            })
            
        return msg

chat_service = ChatService()
