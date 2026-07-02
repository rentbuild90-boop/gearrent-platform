import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from app.main import app
from app.core.deps import get_current_active_user
from datetime import datetime, timezone

@pytest.mark.asyncio
async def test_get_booking_unauthorized(client):
    response = await client.get("/api/bookings/1")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_booking_authorized(client):
    mock_user = MagicMock()
    mock_user.id = 1
    mock_user.is_superadmin = False
    
    app.dependency_overrides[get_current_active_user] = lambda: mock_user
    
    with patch("app.routers.booking.booking_service.get_booking", new_callable=AsyncMock) as mock_get:
        mock_booking = MagicMock()
        mock_booking.id = 1
        mock_booking.booking_code = "BK-123"
        mock_booking.equipment_id = 1
        mock_booking.renter_id = 1
        mock_booking.owner_id = 2
        mock_booking.driver_id = None
        mock_booking.start_date = datetime.now(timezone.utc)
        mock_booking.end_date = datetime.now(timezone.utc)
        mock_booking.pickup_location = "Loc A"
        mock_booking.dropoff_location = "Loc B"
        mock_booking.city_id = 1
        mock_booking.daily_rate = 100.0
        mock_booking.total_days = 2
        mock_booking.subtotal = 200.0
        mock_booking.service_fee = 10.0
        mock_booking.platform_commission = 10.0
        mock_booking.total_amount = 220.0
        mock_booking.status = "pending"
        mock_booking.payment_status = "unpaid"
        mock_booking.created_at = datetime.now(timezone.utc)
        mock_booking.updated_at = datetime.now(timezone.utc)
        mock_get.return_value = mock_booking
        
        response = await client.get("/api/bookings/1")
        assert response.status_code == 200
        assert response.json()["data"]["id"] == 1
        
    app.dependency_overrides.clear()
