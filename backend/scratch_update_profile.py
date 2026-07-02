import os

PROFILE_PATH = r"d:\gear\backend\app\database\models\profile.py"

profile_additions = """
class DocumentType(Base, AuditMixin):
    __tablename__ = "document_types"
    
    name = Column(String(100), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    is_required_owner = Column(Boolean, default=False)
    is_required_driver = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

class BankAccount(Base, AuditMixin):
    __tablename__ = "bank_accounts"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    account_name = Column(String(255), nullable=False)
    account_number = Column(String(100), nullable=False)
    ifsc_code = Column(String(50), nullable=False)
    bank_name = Column(String(255), nullable=False)
    is_primary = Column(Boolean, default=False)
    status = Column(String(20), default="PENDING") # PENDING, VERIFIED, REJECTED

class SavedLocation(Base, AuditMixin):
    __tablename__ = "saved_locations"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False) # e.g. "Site A", "Home"
    address = Column(String(500), nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=True)
    longitude = Column(DECIMAL(11, 8), nullable=True)
    is_default = Column(Boolean, default=False)
"""

with open(PROFILE_PATH, "a", encoding="utf-8") as f:
    f.write("\n" + profile_additions + "\n")

print("Added to profile.py")
