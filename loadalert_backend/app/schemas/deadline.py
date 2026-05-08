from pydantic import BaseModel
from datetime import date
from typing import Optional

class DeadlineBase(BaseModel):
    title: str
    due_date: date
    course_name: Optional[str] = None
    lms_event_id: Optional[int] = None
    estimated_effort: Optional[int] = None
    importance_level: Optional[str] = None
    is_pinned: bool = False

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
    course_name: Optional[str] = None
    estimated_effort: Optional[int] = None
    importance_level: Optional[str] = None
