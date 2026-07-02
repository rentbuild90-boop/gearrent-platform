from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class RegisterChallengeResponse(BaseModel):
    challenge: Dict[str, Any]

class RegisterVerifyRequest(BaseModel):
    response: Dict[str, Any]

class AuthenticateChallengeResponse(BaseModel):
    challenge: Dict[str, Any]

class AuthenticateVerifyRequest(BaseModel):
    response: Dict[str, Any]

class PinSetupRequest(BaseModel):
    pin: str

class PinLoginRequest(BaseModel):
    identifier: str # Email or phone
    pin: str

class PinChangeRequest(BaseModel):
    old_pin: str
    new_pin: str
