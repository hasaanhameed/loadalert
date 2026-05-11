from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    name: str
    lms_username: str

class UserCreate(UserBase):
    lms_password: str

class UserResponse(UserBase):
    id: int
    notification_email: Optional[str] = None
    notifications_enabled: bool

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    notification_email: Optional[str] = None
    notifications_enabled: Optional[bool] = None
