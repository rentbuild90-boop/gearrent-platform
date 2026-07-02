from sqlalchemy import BigInteger, Boolean, Column, DECIMAL, DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class Payment(Base, AuditMixin):
    __tablename__ = "payments"
    
    payment_code = Column(String(50), unique=True, index=True, nullable=False)
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    payer_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    amount = Column(DECIMAL(14, 2), nullable=False)
    currency = Column(String(3), default="INR")
    payment_method_id = Column(BigInteger, ForeignKey("payment_methods.id"), nullable=True)
    status = Column(String(20), default="CREATED") # CREATED, AUTHORIZED, CAPTURED, FAILED, REFUNDED, PARTIALLY_REFUNDED
    gateway = Column(String(20), nullable=False) # RAZORPAY, STRIPE
    gateway_order_id = Column(String(100), nullable=True)
    gateway_payment_id = Column(String(100), nullable=True)
    gateway_signature = Column(String(255), nullable=True)
    metadata_json = Column("metadata", JSON, nullable=True)

class PaymentMethod(Base, AuditMixin):
    __tablename__ = "payment_methods"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    type = Column(String(20), nullable=False) # CARD, NETBANKING, UPI, WALLET
    provider = Column(String(100), nullable=False)
    last_four = Column(String(4), nullable=True)
    card_brand = Column(String(50), nullable=True)
    is_default = Column(Boolean, default=False)
    gateway_token = Column(String(255), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)

class PaymentTransaction(Base, AuditMixin):
    __tablename__ = "payment_transactions"
    
    payment_id = Column(BigInteger, ForeignKey("payments.id"), nullable=False)
    type = Column(String(20), nullable=False) # CHARGE, REFUND, TRANSFER, PAYOUT
    amount = Column(DECIMAL(14, 2), nullable=False)
    status = Column(String(20), default="PENDING") # PENDING, SUCCESS, FAILED
    gateway_transaction_id = Column(String(100), nullable=True)
    metadata_json = Column("metadata", JSON, nullable=True)

class Wallet(Base, AuditMixin):
    __tablename__ = "wallets"
    
    wallet_code = Column(String(20), unique=True, index=True, nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id"), unique=True, nullable=False)
    currency = Column(String(3), default="INR")
    status = Column(String(20), default="ACTIVE") # ACTIVE, FROZEN, SUSPENDED
    frozen_reason = Column(String(255), nullable=True)
    frozen_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)

class WalletTransaction(Base, AuditMixin):
    __tablename__ = "wallet_transactions"
    
    wallet_id = Column(BigInteger, ForeignKey("wallets.id"), nullable=False)
    type = Column(String(10), nullable=False) # CREDIT, DEBIT
    amount = Column(DECIMAL(14, 2), nullable=False)
    running_balance = Column(DECIMAL(14, 2), nullable=False)
    reference_type = Column(String(50), nullable=False) # BOOKING_INCOME, COMMISSION, WITHDRAWAL, REFUND, ADJUSTMENT, PAYOUT
    reference_id = Column(BigInteger, nullable=False)
    description = Column(String(255), nullable=False)
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=True)

class WithdrawRequest(Base, AuditMixin):
    __tablename__ = "withdraw_requests"
    
    wallet_id = Column(BigInteger, ForeignKey("wallets.id"), nullable=False)
    bank_id = Column(BigInteger, ForeignKey("banks.id"), nullable=False)
    amount = Column(DECIMAL(14, 2), nullable=False)
    status = Column(String(20), default="PENDING") # PENDING, APPROVED, PROCESSING, COMPLETED, REJECTED, FAILED
    approved_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    processed_at = Column(DateTime(timezone=True), nullable=True)
    payout_id = Column(String(100), nullable=True)
    rejection_reason = Column(String(255), nullable=True)

class Commission(Base, AuditMixin):
    __tablename__ = "commissions"
    
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    payment_id = Column(BigInteger, ForeignKey("payments.id"), nullable=False)
    platform_fee_rate = Column(DECIMAL(5, 4), nullable=False)
    platform_fee_amount = Column(DECIMAL(14, 2), nullable=False)
    driver_fee_flat = Column(DECIMAL(14, 2), nullable=False)
    owner_payout = Column(DECIMAL(14, 2), nullable=False)
    driver_payout = Column(DECIMAL(14, 2), nullable=False)
    status = Column(String(20), default="CALCULATED") # CALCULATED, SETTLED

class Refund(Base, AuditMixin):
    __tablename__ = "refunds"
    
    payment_id = Column(BigInteger, ForeignKey("payments.id"), nullable=False)
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    amount = Column(DECIMAL(14, 2), nullable=False)
    reason = Column(String(255), nullable=False)
    status = Column(String(20), default="INITIATED") # INITIATED, PROCESSING, COMPLETED, FAILED
    gateway_refund_id = Column(String(100), nullable=True)
    initiated_by = Column(BigInteger, ForeignKey("users.id"), nullable=False)

class Coupon(Base, AuditMixin):
    __tablename__ = "coupons"
    
    code = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    discount_type = Column(String(20), nullable=False) # PERCENTAGE, FLAT
    discount_value = Column(DECIMAL(12, 2), nullable=False)
    max_discount = Column(DECIMAL(12, 2), nullable=True)
    min_order_amount = Column(DECIMAL(12, 2), nullable=True)
    usage_limit = Column(BigInteger, nullable=True)
    used_count = Column(BigInteger, default=0)
    valid_from = Column(DateTime(timezone=True), nullable=True)
    valid_until = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    applicable_categories = Column(JSON, nullable=True)

class CouponUsage(Base, AuditMixin):
    __tablename__ = "coupon_usage"
    
    coupon_id = Column(BigInteger, ForeignKey("coupons.id"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    booking_id = Column(BigInteger, ForeignKey("bookings.id"), nullable=False)
    discount_applied = Column(DECIMAL(12, 2), nullable=False)

class RazorpayTransaction(Base, AuditMixin):
    __tablename__ = "razorpay_transactions"
    
    payment_id = Column(BigInteger, ForeignKey("payments.id"), nullable=True)
    razorpay_order_id = Column(String(100), nullable=True)
    razorpay_payment_id = Column(String(100), nullable=True)
    razorpay_signature = Column(String(255), nullable=True)
    razorpay_payout_id = Column(String(100), nullable=True)
    event_type = Column(String(100), nullable=False)
    payload = Column(JSON, nullable=False)
    status = Column(String(50), nullable=False)


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

