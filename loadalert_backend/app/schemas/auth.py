from pydantic import BaseModel
from .user import UserResponse

class LMSLoginRequest(BaseModel):
    email: str
    password: str
    section: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
