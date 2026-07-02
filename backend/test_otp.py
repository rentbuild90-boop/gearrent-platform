import httpx
import asyncio

async def test():
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        print("Sending OTP...")
        resp = await client.post("/api/auth/send-otp", json={
            "phone": "8761006911",
            "purpose": "REGISTER"
        })
        print(resp.status_code)
        print(resp.text)

asyncio.run(test())
