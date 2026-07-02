import httpx
import logging
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class RenflairSmsService:
    def __init__(self):
        self.api_key = settings.RENFLAIR_API_KEY
        self.base_url = "https://sms.renflair.in"

    async def _send_request(self, endpoint: str, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            logger.warning("RENFLAIR_API_KEY is not set. Simulating SMS send.")
            logger.info(f"Mock SMS Sent - Endpoint: {endpoint}, Params: {params}")
            return {"status": "mocked", "message": "SMS simulated successfully"}
            
        params["API"] = self.api_key
        url = f"{self.base_url}/{endpoint}"
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                
                try:
                    return response.json()
                except ValueError:
                    # In case the API returns plain text or unexpected format
                    logger.warning(f"Failed to parse JSON from Renflair SMS API: {response.text}")
                    return {"status": "success", "raw_response": response.text}
                    
        except httpx.HTTPError as e:
            logger.error(f"HTTP error occurred while calling Renflair SMS API: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error while calling Renflair SMS API: {str(e)}")
            return None

    async def send_otp(self, phone: str, otp: str) -> bool:
        """
        Sends an OTP code via SMS.
        """
        params = {
            "PHONE": phone,
            "OTP": otp
        }
        result = await self._send_request("V1.php", params)
        return result is not None

    async def send_order_successful(self, phone: str, order_id: str, customer_name: str) -> bool:
        """
        Sends an order successful SMS.
        """
        params = {
            "PHONE": phone,
            "OID": order_id,
            "CNAME": customer_name
        }
        result = await self._send_request("V3.php", params)
        return result is not None
        
    async def send_partner_order(self, phone: str, order_id: str) -> bool:
        """
        Sends a new order notification to a partner.
        """
        params = {
            "PHONE": phone,
            "OID": order_id
        }
        result = await self._send_request("V4.php", params)
        return result is not None
        
    async def send_service_booking(self, phone: str, order_id: str, hours: int = 2) -> bool:
        """
        Sends a service booking successful SMS.
        """
        params = {
            "PHONE": phone,
            "OID": order_id,
            "HOUR": hours
        }
        result = await self._send_request("V7.php", params)
        return result is not None

    async def send_recharge_confirmation(self, phone: str, amount_str: str) -> bool:
        """
        Sends a wallet recharge confirmation SMS.
        """
        params = {
            "PHONE": phone,
            "AMT": amount_str
        }
        result = await self._send_request("V6.php", params)
        return result is not None

sms_service = RenflairSmsService()
