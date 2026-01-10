from pydantic import BaseModel
from datetime import date
from typing import Optional

class User(BaseModel):
    name: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None  


class Deadline(BaseModel):
    title: str
    due_date: date
    estimated_effort: int
    importance_level: str

class DeadlineResponse(Deadline):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class DeadlineUpdate(BaseModel):
    title: Optional[str] = None
    due_date: Optional[date] = None
    estimated_effort: Optional[int] = None
    importance_level: Optional[str] = None