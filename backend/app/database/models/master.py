from sqlalchemy import Column, String, Boolean, ForeignKey, BigInteger, DECIMAL, DateTime, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base, AuditMixin

class Country(Base, AuditMixin):
    __tablename__ = "countries"
    
    name = Column(String(100), nullable=False)
    code = Column(String(5), unique=True, index=True, nullable=False) # ISO 3166-1 alpha-2
    dial_code = Column(String(10), nullable=False)
    currency_code = Column(String(10), nullable=False)
    is_active = Column(Boolean, default=True)

class State(Base, AuditMixin):
    __tablename__ = "states"
    
    country_id = Column(BigInteger, ForeignKey("countries.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(10), nullable=True)
    is_active = Column(Boolean, default=True)

class District(Base, AuditMixin):
    __tablename__ = "districts"
    
    state_id = Column(BigInteger, ForeignKey("states.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(10), nullable=True)
    is_active = Column(Boolean, default=True)

class City(Base, AuditMixin):
    __tablename__ = "cities"
    
    district_id = Column(BigInteger, ForeignKey("districts.id"), nullable=True)
    state_id = Column(BigInteger, ForeignKey("states.id"), nullable=False)
    country_id = Column(BigInteger, ForeignKey("countries.id"), nullable=False)
    name = Column(String(100), nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=True)
    longitude = Column(DECIMAL(11, 8), nullable=True)
    is_serviceable = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)

class Area(Base, AuditMixin):
    __tablename__ = "areas"
    
    city_id = Column(BigInteger, ForeignKey("cities.id"), nullable=False)
    name = Column(String(100), nullable=False)
    pincode = Column(String(20), nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=True)
    longitude = Column(DECIMAL(11, 8), nullable=True)
    is_active = Column(Boolean, default=True)

class Pincode(Base, AuditMixin):
    __tablename__ = "pincodes"
    
    pincode = Column(String(20), unique=True, index=True, nullable=False)
    city_id = Column(BigInteger, ForeignKey("cities.id"), nullable=False)
    area_name = Column(String(100), nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=True)
    longitude = Column(DECIMAL(11, 8), nullable=True)
    is_active = Column(Boolean, default=True)

class Currency(Base, AuditMixin):
    __tablename__ = "currencies"
    
    code = Column(String(10), unique=True, index=True, nullable=False) # INR, USD
    name = Column(String(50), nullable=False)
    symbol = Column(String(10), nullable=False) # ₹, $
    decimal_places = Column(BigInteger, default=2)
    is_active = Column(Boolean, default=True)

class Language(Base, AuditMixin):
    __tablename__ = "languages"
    
    code = Column(String(10), unique=True, index=True, nullable=False) # en, hi
    name = Column(String(50), nullable=False)
    native_name = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True)

class PricingModel(Base, AuditMixin):
    __tablename__ = "pricing_models"
    
    model_code = Column(String(50), unique=True, index=True, nullable=False)
    category_id = Column(BigInteger, ForeignKey("equipment_categories.id"), nullable=False)
    name = Column(String(100), nullable=False)
    price = Column(DECIMAL(12, 2), nullable=False)
    unit = Column(String(50), nullable=False) # HOURLY, DAILY, MONTHLY, CUSTOM
    custom_unit = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)


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

