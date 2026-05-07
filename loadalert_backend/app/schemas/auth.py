from pydantic import BaseModel
from .user import UserResponse

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
