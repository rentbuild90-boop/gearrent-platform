from sqlalchemy import Column, String, Boolean, JSON, ForeignKey, BigInteger, DateTime
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class User(Base, AuditMixin):
    __tablename__ = "users"
    
    user_code = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    email_verified_at = Column(DateTime(timezone=True), nullable=True)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    phone_verified_at = Column(DateTime(timezone=True), nullable=True)
    country_code = Column(String(5), nullable=False)
    
    password_hash = Column(String(255), nullable=False)
    pin_hash = Column(String(255), nullable=True)
    
    avatar_url = Column(String(255), nullable=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    bio = Column(String(1000), nullable=True)
    location = Column(String(255), nullable=True)
    
    status = Column(String(20), default="ACTIVE", index=True) # ACTIVE, SUSPENDED, BANNED, DEACTIVATED
    is_superadmin = Column(Boolean, default=False)
    
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    last_login_ip = Column(String(45), nullable=True)
    
    # Relationships
    roles = relationship("UserRole", back_populates="user", foreign_keys="[UserRole.user_id]")
    sessions = relationship("Session", back_populates="user", foreign_keys="[Session.user_id]")

class Role(Base, AuditMixin):
    __tablename__ = "roles"
    
    name = Column(String(50), nullable=False)
    slug = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    is_system = Column(Boolean, default=False)
    priority = Column(BigInteger, default=0)

class Permission(Base, AuditMixin):
    __tablename__ = "permissions"
    
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    module = Column(String(50), nullable=False)
    description = Column(String(255), nullable=True)

class RolePermission(Base, AuditMixin):
    __tablename__ = "role_permissions"
    
    role_id = Column(BigInteger, ForeignKey("roles.id"), nullable=False)
    permission_id = Column(BigInteger, ForeignKey("permissions.id"), nullable=False)

class UserRole(Base, AuditMixin):
    __tablename__ = "user_roles"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    role_id = Column(BigInteger, ForeignKey("roles.id"), nullable=False)
    assigned_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    is_primary = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="roles", foreign_keys=[user_id])

class Session(Base, AuditMixin):
    __tablename__ = "sessions"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    token_hash = Column(String(255), nullable=False)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(255), nullable=True)
    device_fingerprint = Column(String(255), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_active = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="sessions", foreign_keys=[user_id])

class RefreshToken(Base, AuditMixin):
    __tablename__ = "refresh_tokens"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    token_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked_at = Column(DateTime(timezone=True), nullable=True)
    replaced_by_id = Column(BigInteger, ForeignKey("refresh_tokens.id"), nullable=True)

class OTPCode(Base, AuditMixin):
    __tablename__ = "otp_codes"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=True) # nullable for registration
    identifier = Column(String(255), nullable=True) # Email or Phone number
    code_hash = Column(String(255), nullable=False)
    channel = Column(String(20), nullable=False) # SMS, EMAIL, WHATSAPP
    purpose = Column(String(20), nullable=False) # LOGIN, REGISTER, RESET, VERIFY
    expires_at = Column(DateTime(timezone=True), nullable=False)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    attempts = Column(BigInteger, default=0)

class LoginHistory(Base, AuditMixin):
    __tablename__ = "login_history"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(255), nullable=True)
    device_fingerprint = Column(String(255), nullable=True)
    login_method = Column(String(20), nullable=False) # PHONE, EMAIL, OTP, PIN
    status = Column(String(20), nullable=False) # SUCCESS, FAILED, BLOCKED
    failure_reason = Column(String(255), nullable=True)

class Device(Base, AuditMixin):
    __tablename__ = "devices"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    device_name = Column(String(100), nullable=True)
    device_type = Column(String(50), nullable=True) # MOBILE, DESKTOP
    os = Column(String(50), nullable=True)
    browser = Column(String(50), nullable=True)
    push_token = Column(String(255), nullable=True)
    is_trusted = Column(Boolean, default=False)
    last_active_at = Column(DateTime(timezone=True), nullable=True)

class ApiKey(Base, AuditMixin):
    __tablename__ = "api_keys"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    key_prefix = Column(String(10), nullable=False)
    key_hash = Column(String(255), nullable=False)
    status = Column(String(20), default="ACTIVE")
    scopes = Column(JSON, nullable=True)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)

class RealtimeOTP(Base):
    __tablename__ = "realtime_otps"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    phone = Column(String(20), index=True, nullable=False)
    code = Column(String(10), nullable=False)
    purpose = Column(String(20), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False)

