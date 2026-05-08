from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    name: str
    lms_username: str
    section: Optional[str] = None

class UserCreate(UserBase):
    lms_password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    section: Optional[str] = None
