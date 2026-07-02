import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"))

class Settings:
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    
    DATABASE_URL = os.getenv("DATABASE_URL", "mysql+aiomysql://gearrent_user:gearrent_pass123!@localhost:3306/gearrent")
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "gearrent")
    MYSQL_USER = os.getenv("MYSQL_USER", "gearrent_user")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "gearrent_pass123!")
    
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    SECRET_KEY = os.getenv("SECRET_KEY", "generate-a-secure-secret-key-here-1234567890")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
    
    RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    
    RENFLAIR_API_KEY = os.getenv("RENFLAIR_API_KEY", "")
    
    WEBAUTHN_RP_ID = os.getenv("WEBAUTHN_RP_ID", "localhost")
    WEBAUTHN_RP_NAME = os.getenv("WEBAUTHN_RP_NAME", "GearRent")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
settings = Settings()
