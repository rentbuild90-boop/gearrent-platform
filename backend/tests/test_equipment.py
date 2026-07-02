import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from app.main import app
from app.core.deps import get_current_active_user, require_role
from datetime import datetime

@pytest.mark.asyncio
async def test_get_equipment(client):
    with patch("app.routers.equipment.equipment_service.get_equipment", new_callable=AsyncMock) as mock_get:
        mock_eq = MagicMock()
        mock_eq.id = 1
        mock_eq.equipment_code = "EQ-123"
        mock_eq.category_id = 1
        mock_eq.name = "Excavator"
        mock_eq.city_id = 1
        mock_eq.owner_id = 1
        mock_eq.status = "AVAILABLE"
        mock_eq.rating = 4.5
        mock_eq.review_count = 10
        mock_eq.created_at = datetime.utcnow()
        mock_eq.updated_at = datetime.utcnow()
        mock_eq.brand = "JCB"
        mock_eq.model_year = 2020
        mock_eq.capacity = "10 tons"
        mock_eq.description = "Test desc"
        mock_eq.latitude = 12.9
        mock_eq.longitude = 77.5
        mock_eq.features = {}
        mock_eq.registration_number = None
        mock_eq.chassis_number = None
        mock_get.return_value = mock_eq
        
        response = await client.get("/api/equipment/1")
        assert response.status_code == 200
        assert response.json()["data"]["name"] == "Excavator"

@pytest.mark.asyncio
async def test_get_equipment_not_found(client):
    with patch("app.routers.equipment.equipment_service.get_equipment", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = None
        response = await client.get("/api/equipment/999")
        assert response.status_code == 404

@pytest.mark.asyncio
async def test_create_equipment_unauthorized(client):
    response = await client.post("/api/equipment", json={
        "name": "Excavator",
        "description": "Test",
        "category_id": 1,
        "city_id": 1
    })
    assert response.status_code == 401
