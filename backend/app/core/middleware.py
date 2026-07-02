import logging
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("agent_monitor")

class AgentMonitoringMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        method = request.method
        path = request.url.path
        
        # Special focus on GET and POST methods as requested
        if method in ["GET", "POST"]:
            logger.info(f"[AGENT MONITOR] -> Incoming {method} Request on {path}")
            # Query params can be safely logged
            if request.query_params:
                logger.info(f"[AGENT MONITOR]    Query Params: {request.query_params}")
        else:
            logger.info(f"[AGENT MONITOR] -> Incoming {method} Request on {path}")

        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            
            if method in ["GET", "POST"]:
                logger.info(f"[AGENT MONITOR] <- Completed {method} {path} | Status: {response.status_code} | Time: {process_time:.4f}s")
            else:
                logger.info(f"[AGENT MONITOR] <- Completed {method} {path} | Status: {response.status_code} | Time: {process_time:.4f}s")
                
            return response
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(f"[AGENT MONITOR] !! Error on {method} {path} | Time: {process_time:.4f}s | Error: {str(e)}")
            raise e
