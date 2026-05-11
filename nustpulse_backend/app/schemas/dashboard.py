from pydantic import BaseModel
from datetime import date
from typing import List
from app.schemas.deadline import DeadlineResponse

class WeeklyLoadDay(BaseModel):
    day: str
    date: date
    deadlines: int
    deadlines_list: List[DeadlineResponse] = []

class CourseSummary(BaseModel):
    course_name: str
    count: int

class DashboardSummary(BaseModel):
    upcoming_deadlines: int
    weekly_load: List[WeeklyLoadDay]
    course_summary: List[CourseSummary]
