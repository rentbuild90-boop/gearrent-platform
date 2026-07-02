from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_db
from app.schemas.chat import (
    ConversationOut, ConversationListResponse, ConversationResponse, ConversationCreate,
    MessageOut, MessageListResponse, MessageResponse, MessageCreate
)
from app.services.chat_service import chat_service
from app.core.deps import get_current_active_user
from app.database.models.auth import User
from typing import Dict, List
from jose import jwt
from app.config import settings
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str, db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = int(payload.get("sub"))
    except Exception:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
        
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)

@router.get("/conversations", response_model=ConversationListResponse)
async def get_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    conversations = await chat_service.get_user_conversations(db, user_id=current_user.id)
    return ConversationListResponse(
        data=[ConversationOut.model_validate(c) for c in conversations]
    )

@router.post("/conversations", response_model=ConversationResponse)
async def create_conversation(
    conversation_in: ConversationCreate, 
    user_ids: list[int],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.id not in user_ids:
        user_ids.append(current_user.id)
        
    conv = await chat_service.create_conversation(db, conversation_in=conversation_in, user_ids=user_ids)
    return ConversationResponse(
        message="Conversation created",
        data=ConversationOut.model_validate(conv)
    )

@router.get("/conversations/{conversation_id}/messages", response_model=MessageListResponse)
async def get_messages(
    conversation_id: int,
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    messages = await chat_service.get_messages(db, conversation_id=conversation_id, skip=skip, limit=limit)
    return MessageListResponse(
        data=[MessageOut.model_validate(m) for m in messages]
    )

@router.post("/messages", response_model=MessageResponse)
async def send_message(
    message_in: MessageCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    msg = await chat_service.send_message(db, sender_id=current_user.id, message_in=message_in)
    
    from app.database.repositories.chat import conversation_member_repo
    members = await conversation_member_repo.get_conversation_members(db, message_in.conversation_id)
    
    msg_out = MessageOut.model_validate(msg).model_dump(mode="json")
    for m in members:
        if m.user_id != current_user.id:
            await manager.send_personal_message(msg_out, m.user_id)
            
    return MessageResponse(
        message="Message sent",
        data=MessageOut.model_validate(msg)
    )
