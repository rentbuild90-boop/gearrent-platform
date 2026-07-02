import pytest
from app.main import app

@pytest.mark.asyncio
async def test_csrf_cookie_auth_requires_csrf_token(client):
    # Send a request with access_token cookie but no CSRF headers
    response = await client.post(
        "/api/bookings",
        json={"equipment_id": 1, "start_date": "2026-07-02", "end_date": "2026-07-03"},
        cookies={"access_token": "mock_token"}
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "CSRF token mismatch"

@pytest.mark.asyncio
async def test_csrf_cookie_auth_succeeds_with_matching_csrf_token(client):
    # Send a request with matching CSRF cookie and header
    # It should pass CSRF and fail at auth verification (401) instead of 403 CSRF mismatch
    response = await client.post(
        "/api/bookings",
        json={"equipment_id": 1, "start_date": "2026-07-02", "end_date": "2026-07-03"},
        cookies={"access_token": "invalid_mock_token", "csrf_token": "match_token"},
        headers={"x-csrf-token": "match_token"}
    )
    assert response.status_code == 401  # Passes CSRF, but token is invalid

@pytest.mark.asyncio
async def test_csrf_not_enforced_for_unauthenticated_requests(client):
    # No access_token cookie, so it should fail with 401 (not authenticated) instead of 403
    response = await client.post(
        "/api/bookings",
        json={"equipment_id": 1, "start_date": "2026-07-02", "end_date": "2026-07-03"}
    )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_csrf_bypassed_for_bearer_token_auth(client):
    # Using Authorization header, so CSRF should be bypassed and fail with 401 (invalid token)
    response = await client.post(
        "/api/bookings",
        json={"equipment_id": 1, "start_date": "2026-07-02", "end_date": "2026-07-03"},
        headers={"Authorization": "Bearer invalid_mock_token"}
    )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_csrf_bypassed_for_webhook_exemption(client):
    # Webhook endpoint should bypass CSRF and raise 400 (missing signature) instead of 403
    response = await client.post(
        "/api/financials/payment/webhook",
        json={},
        cookies={"access_token": "mock_token"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Missing signature"
