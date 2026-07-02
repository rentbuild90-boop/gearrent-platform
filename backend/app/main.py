from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.security import verify_csrf_token
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.routers import auth, user, categories, equipment, booking, driver, payment, review, notification, chat, tracking, developer, passkey, pin
from app.core.middleware import AgentMonitoringMiddleware
from app.core.limiter import limiter

app = FastAPI(
    title="GearRent API",
    description="Backend API for GearRent Platform",
    version="1.0.0",
    dependencies=[Depends(verify_csrf_token)]
)

# Configure custom middleware
app.add_middleware(AgentMonitoringMiddleware)

# Configure rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", "http://127.0.0.1:3000",
        "http://localhost:3001", "http://127.0.0.1:3001",
        "http://localhost:3002", "http://127.0.0.1:3002",
        "http://localhost", "http://127.0.0.1"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(passkey.router, prefix="/api")
app.include_router(pin.router, prefix="/api")
app.include_router(user.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(equipment.router, prefix="/api")
app.include_router(booking.router, prefix="/api")
app.include_router(driver.router, prefix="/api")
app.include_router(payment.router, prefix="/api")
app.include_router(review.router, prefix="/api")
app.include_router(notification.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(tracking.router, prefix="/api")
app.include_router(developer.router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "GearRent API is running"}
