from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserUpdate(UserBase):
    pass

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
