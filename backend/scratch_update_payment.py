import os

PAYMENT_PATH = r"d:\gear\backend\app\database\models\payment.py"

payment_additions = """
class WalletLedger(Base, AuditMixin):
    __tablename__ = "wallet_ledger"
    
    wallet_id = Column(BigInteger, ForeignKey("wallets.id"), nullable=False, index=True)
    transaction_type = Column(String(50), nullable=False) # CREDIT, DEBIT
    amount = Column(DECIMAL(14, 2), nullable=False)
    reference_type = Column(String(50), nullable=False) # BOOKING, WITHDRAWAL, REFUND, COMMISSION
    reference_id = Column(BigInteger, nullable=False, index=True)
    description = Column(String(255), nullable=True)

class CommissionRule(Base, AuditMixin):
    __tablename__ = "commission_rules"
    
    name = Column(String(100), nullable=False)
    equipment_category_id = Column(BigInteger, ForeignKey("equipment_categories.id"), nullable=True, index=True)
    percentage = Column(DECIMAL(5, 2), nullable=False)
    flat_fee = Column(DECIMAL(10, 2), default=0.0)
    is_active = Column(Boolean, default=True)

class WithdrawAccount(Base, AuditMixin):
    __tablename__ = "withdraw_accounts"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    bank_account_id = Column(BigInteger, ForeignKey("bank_accounts.id"), nullable=False, index=True)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

class WithdrawHistory(Base, AuditMixin):
    __tablename__ = "withdraw_history"
    
    request_id = Column(BigInteger, ForeignKey("withdraw_requests.id"), nullable=False, index=True)
    status_from = Column(String(20), nullable=True)
    status_to = Column(String(20), nullable=False)
    notes = Column(Text, nullable=True)

class RefundRequest(Base, AuditMixin):
    __tablename__ = "refund_requests"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False, index=True)
    payment_id = Column(BigInteger, ForeignKey("payments.id"), nullable=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(DECIMAL(14, 2), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String(20), default="PENDING") # PENDING, APPROVED, REJECTED, PROCESSED
    processed_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    processed_at = Column(DateTime(timezone=True), nullable=True)

class PaymentGatewayLog(Base, AuditMixin):
    __tablename__ = "payment_gateway_logs"
    
    payment_id = Column(BigInteger, ForeignKey("payments.id"), nullable=True, index=True)
    gateway_name = Column(String(50), nullable=False)
    endpoint = Column(String(255), nullable=False)
    request_payload = Column(JSON, nullable=True)
    response_payload = Column(JSON, nullable=True)
    status_code = Column(BigInteger, nullable=True)

class PaymentWebhook(Base, AuditMixin):
    __tablename__ = "payment_webhooks"
    
    gateway_name = Column(String(50), nullable=False)
    event_type = Column(String(100), nullable=False)
    payload = Column(JSON, nullable=False)
    processed = Column(Boolean, default=False)
    processing_error = Column(Text, nullable=True)

class Promotion(Base, AuditMixin):
    __tablename__ = "promotions"
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    banner_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
"""

with open(PAYMENT_PATH, "a", encoding="utf-8") as f:
    f.write("\n" + payment_additions + "\n")

print("Added to payment.py")
