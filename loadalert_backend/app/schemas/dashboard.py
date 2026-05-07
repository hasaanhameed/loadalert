from pydantic import BaseModel
from datetime import date

class WeeklyLoadDay(BaseModel):
    day: str
    date: date
    deadlines: int
    hours: int

class DashboardSummary(BaseModel):
    upcoming_deadlines: int
    total_hours: int
    weekly_load: list[WeeklyLoadDay]
