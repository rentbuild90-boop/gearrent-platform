from sqlalchemy import Column, String, Boolean, ForeignKey, BigInteger, DECIMAL, DateTime, Text
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class Review(Base, AuditMixin):
    __tablename__ = "reviews"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    reviewer_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    target_type = Column(String(50), nullable=False) # EQUIPMENT, OWNER, DRIVER, BOOKING
    target_id = Column(BigInteger, nullable=False)
    rating = Column(DECIMAL(2, 1), nullable=False)
    comment = Column(Text, nullable=True)
    is_published = Column(Boolean, default=True)
    moderated_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    moderated_at = Column(DateTime(timezone=True), nullable=True)

class ReviewResponse(Base, AuditMixin):
    __tablename__ = "review_responses"
    
    review_id = Column(BigInteger, ForeignKey("reviews.id"), nullable=False)
    responder_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)


class ReviewImage(Base, AuditMixin):
    __tablename__ = "review_images"
    
    review_id = Column(BigInteger, ForeignKey("reviews.id"), nullable=False, index=True)
    image_url = Column(String(255), nullable=False)

class ReviewVote(Base, AuditMixin):
    __tablename__ = "review_votes"
    
    review_id = Column(BigInteger, ForeignKey("reviews.id"), nullable=False, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    is_helpful = Column(Boolean, nullable=False)

