from pydantic import BaseModel
from datetime import date
from typing import Optional

class DeadlineBase(BaseModel):
    title: str
    due_date: date
    estimated_effort: int
    importance_level: str

class DeadlineCreate(DeadlineBase):
    pass

class DeadlineResponse(DeadlineBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class DeadlineUpdate(BaseModel):
    title: Optional[str] = None
    due_date: Optional[date] = None
    estimated_effort: Optional[int] = None
    importance_level: Optional[str] = None
