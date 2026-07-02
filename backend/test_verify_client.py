from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("Sending send-otp...")
response = client.post("/api/auth/send-otp", json={
    "phone": "8761006911",
    "purpose": "REGISTER"
})
print("send-otp status:", response.status_code)

print("Sending verify-otp...")
try:
    response = client.post("/api/auth/verify-otp", json={
        "phone": "8761006911",
        "code": "123456",
        "purpose": "REGISTER"
    })
    print("verify-otp status:", response.status_code)
    print("verify-otp text:", response.text)
except Exception as e:
    import traceback
    traceback.print_exc()
