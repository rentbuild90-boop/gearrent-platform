import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from datetime import datetime, timezone

@pytest.mark.asyncio
async def test_login_success(client):
    with patch("app.routers.auth.auth_service.authenticate", new_callable=AsyncMock) as mock_auth:
        mock_user = MagicMock()
        mock_user.id = 1
        mock_user.phone = "1234567890"
        mock_user.email = "test@test.com"
        mock_user.first_name = "Test"
        mock_user.last_name = "User"
        mock_user.role_id = 1
        mock_user.is_active = True
        mock_user.is_verified = True
        mock_user.is_superadmin = False
        mock_user.kyc_status = "verified"
        mock_user.profile_picture = None
        mock_user.rating = 5.0
        mock_user.created_at = datetime.now(timezone.utc)
        mock_user.updated_at = datetime.now(timezone.utc)
        mock_user.country_code = "+91"
        mock_user.user_code = "USR-123"
        mock_user.status = "ACTIVE"
        mock_user.avatar_url = ""
        mock_user.bio = ""
        mock_user.location = ""
        mock_auth.return_value = mock_user
        
        with patch("app.routers.auth.auth_service.create_tokens_for_user") as mock_tokens:
            mock_tokens.return_value = {"access_token": "acc", "refresh_token": "ref"}
            
            response = await client.post(
                "/api/auth/login", 
                json={"email": "test@test.com", "password": "password"},
                headers={"x-csrf-token": "test"},
                cookies={"csrf_token": "test"}
            )
            
            assert response.status_code == 200
            assert response.json()["success"] == True

@pytest.mark.asyncio
async def test_register_success(client):
    with patch("app.routers.auth.auth_service.register", new_callable=AsyncMock) as mock_register:
        mock_user = MagicMock()
        mock_user.id = 1
        mock_user.phone = "1234567890"
        mock_user.email = "test@test.com"
        mock_user.first_name = "Test"
        mock_user.last_name = "User"
        mock_user.role_id = 1
        mock_user.is_active = True
        mock_user.is_verified = True
        mock_user.is_superadmin = False
        mock_user.kyc_status = "verified"
        mock_user.profile_picture = None
        mock_user.rating = 5.0
        mock_user.created_at = datetime.now(timezone.utc)
        mock_user.updated_at = datetime.now(timezone.utc)
        mock_user.country_code = "+91"
        mock_user.user_code = "USR-123"
        mock_user.status = "ACTIVE"
        mock_user.avatar_url = ""
        mock_user.bio = ""
        mock_user.location = ""
        mock_register.return_value = mock_user
        
        with patch("app.routers.auth.auth_service.create_tokens_for_user") as mock_tokens:
            mock_tokens.return_value = {"access_token": "acc", "refresh_token": "ref"}
            
            response = await client.post(
                "/api/auth/register", 
                json={
                    "phone": "1234567890", 
                    "email": "test@test.com", 
                    "password": "password", 
                    "first_name": "Test", 
                    "last_name": "User", 
                    "role_id": 1,
                    "otp": "123456"
                },
                headers={"x-csrf-token": "test"},
                cookies={"csrf_token": "test"}
            )
            
            assert response.status_code == 200
            assert response.json()["success"] == True
