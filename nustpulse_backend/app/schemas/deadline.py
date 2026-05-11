from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DeadlineBase(BaseModel):
    title: str
    due_date: datetime
    course_name: Optional[str] = None
    lms_event_id: Optional[int] = None
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
    due_date: Optional[datetime] = None
    course_name: Optional[str] = None
