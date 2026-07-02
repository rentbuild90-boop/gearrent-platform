import os

CHAT_PATH = r"d:\gear\backend\app\database\models\chat.py"
NOTIFICATIONS_PATH = r"d:\gear\backend\app\database\models\notification.py"
REVIEWS_PATH = r"d:\gear\backend\app\database\models\review.py"
DEVELOPER_PATH = r"d:\gear\backend\app\database\models\developer.py"

chat_additions = """
class MessageReaction(Base, AuditMixin):
    __tablename__ = "message_reactions"
    
    message_id = Column(BigInteger, ForeignKey("messages.id"), nullable=False, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    reaction = Column(String(50), nullable=False) # emoji code
"""

notifications_additions = """
class EmailLog(Base, AuditMixin):
    __tablename__ = "email_logs"
    
    recipient_email = Column(String(255), nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    template_name = Column(String(100), nullable=True)
    status = Column(String(20), default="SENT")
    error_message = Column(Text, nullable=True)

class SmsLog(Base, AuditMixin):
    __tablename__ = "sms_logs"
    
    recipient_phone = Column(String(20), nullable=False, index=True)
    message_body = Column(Text, nullable=False)
    status = Column(String(20), default="SENT")
    error_message = Column(Text, nullable=True)
"""

reviews_additions = """
class ReviewImage(Base, AuditMixin):
    __tablename__ = "review_images"
    
    review_id = Column(BigInteger, ForeignKey("reviews.id"), nullable=False, index=True)
    image_url = Column(String(255), nullable=False)

class ReviewVote(Base, AuditMixin):
    __tablename__ = "review_votes"
    
    review_id = Column(BigInteger, ForeignKey("reviews.id"), nullable=False, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    is_helpful = Column(Boolean, nullable=False)
"""

developer_additions = """
class SystemHealth(Base, AuditMixin):
    __tablename__ = "system_health"
    
    service_name = Column(String(100), nullable=False, index=True)
    status = Column(String(20), nullable=False) # UP, DOWN, DEGRADED
    last_check_at = Column(DateTime(timezone=True), nullable=False)
    response_time_ms = Column(BigInteger, nullable=True)
    error_details = Column(Text, nullable=True)
"""

with open(CHAT_PATH, "a", encoding="utf-8") as f:
    f.write("\n" + chat_additions + "\n")
print("Added to chat.py")

with open(NOTIFICATIONS_PATH, "a", encoding="utf-8") as f:
    f.write("\n" + notifications_additions + "\n")
print("Added to notification.py")

with open(REVIEWS_PATH, "a", encoding="utf-8") as f:
    f.write("\n" + reviews_additions + "\n")
print("Added to review.py")

with open(DEVELOPER_PATH, "a", encoding="utf-8") as f:
    f.write("\n" + developer_additions + "\n")
print("Added to developer.py")
