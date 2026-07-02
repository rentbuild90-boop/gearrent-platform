from sqlalchemy import Column, String, Boolean, ForeignKey, BigInteger, DateTime, Text
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class Conversation(Base, AuditMixin):
    __tablename__ = "conversations"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=True)
    type = Column(String(20), nullable=False) # DIRECT, BOOKING, SUPPORT
    title = Column(String(255), nullable=True)
    last_message_at = Column(DateTime(timezone=True), nullable=True)
    last_message_preview = Column(String(500), nullable=True)

class ConversationMember(Base, AuditMixin):
    __tablename__ = "conversation_members"
    
    conversation_id = Column(BigInteger, ForeignKey("conversations.id"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    role = Column(String(20), default="MEMBER") # MEMBER, ADMIN
    joined_at = Column(DateTime(timezone=True), nullable=False)
    left_at = Column(DateTime(timezone=True), nullable=True)
    unread_count = Column(BigInteger, default=0)
    is_muted = Column(Boolean, default=False)

class Message(Base, AuditMixin):
    __tablename__ = "messages"
    
    conversation_id = Column(BigInteger, ForeignKey("conversations.id"), nullable=False)
    sender_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    message_type = Column(String(20), default="TEXT") # TEXT, IMAGE, FILE, SYSTEM
    content = Column(Text, nullable=False)
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime(timezone=True), nullable=True)
    reply_to_id = Column(BigInteger, ForeignKey("messages.id"), nullable=True)
    is_read = Column(Boolean, default=False)
    delivered_at = Column(DateTime(timezone=True), nullable=True)

class MessageAttachment(Base, AuditMixin):
    __tablename__ = "message_attachments"
    
    message_id = Column(BigInteger, ForeignKey("messages.id"), nullable=False)
    file_path = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    mime_type = Column(String(100), nullable=False)

class MessageStatus(Base, AuditMixin):
    __tablename__ = "message_status"
    
    message_id = Column(BigInteger, ForeignKey("messages.id"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    status = Column(String(20), nullable=False) # SENT, DELIVERED, READ
    status_at = Column(DateTime(timezone=True), nullable=False)


class MessageReaction(Base, AuditMixin):
    __tablename__ = "message_reactions"
    
    message_id = Column(BigInteger, ForeignKey("messages.id"), nullable=False, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    reaction = Column(String(50), nullable=False) # emoji code

