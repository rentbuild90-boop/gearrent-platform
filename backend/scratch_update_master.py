import os

MASTER_PATH = r"d:\gear\backend\app\database\models\master.py"

master_additions = """
class VehicleBrand(Base, AuditMixin):
    __tablename__ = "vehicle_brands"
    
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    logo_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)

class EquipmentModel(Base, AuditMixin):
    __tablename__ = "equipment_models"
    
    brand_id = Column(BigInteger, ForeignKey("vehicle_brands.id"), nullable=False, index=True)
    category_id = Column(BigInteger, ForeignKey("equipment_categories.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    base_weight_tons = Column(DECIMAL(10, 2), nullable=True)
    is_active = Column(Boolean, default=True)
"""

with open(MASTER_PATH, "a", encoding="utf-8") as f:
    f.write("\n" + master_additions + "\n")

print("Added to master.py")
