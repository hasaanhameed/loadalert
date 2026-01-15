from pydantic import BaseModel
from datetime import date
from typing import Optional

""" ---- USER ---- """

class User(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: str
    email: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


""" ---- AUTHENTICATION ---- """

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None  

""" ---- DEADLINES ---- """

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

""" ---- DASHBOARD ---- """

class WeeklyLoadDay(BaseModel):
    day: str
    date: date
    deadlines: int
    hours: int

class DashboardSummary(BaseModel):
    upcoming_deadlines: int
    total_hours: int
    weekly_load: list[WeeklyLoadDay]

""" ---- AI STRESS PREDICTION ---- """

class StressPredictionDayInput(BaseModel):
    day: str
    hours: int
    deadlines: int


class StressPredictionRequest(BaseModel):
    weekly_load: list[StressPredictionDayInput]


class StressPredictionDayOutput(BaseModel):
    day: str
    stressLevel: int  # 0–100


class StressPredictionResponse(BaseModel):
    daily_stress: list[StressPredictionDayOutput]
    weekly_stress_score: int  # 0–100
    risk_level: str           # "low" | "medium" | "high"
    peak_stress_day: str
    explanation: str

""" ---- AI PRIORITIES ---- """

class PriorityTaskInput(BaseModel):
    id: int
    title: str
    due_date: date
    estimated_effort: int
    importance_level: str


class PrioritiesRequest(BaseModel):
    tasks: list[PriorityTaskInput]

class PriorityTaskOutput(BaseModel):
    id: int
    title: str
    rank: int
    reason: str
    estimated_effort: int
    due_date: date

class PrioritiesResponse(BaseModel):
    priorities: list[PriorityTaskOutput]

""" ---- AI STRESS CONTRIBUTORS ---- """

class StressContributorInput(BaseModel):
    id: int
    title: str
    due_date: date
    estimated_effort: int
    importance_level: str

class StressContributorsRequest(BaseModel):
    deadlines: list[StressContributorInput]

class StressContributorOutput(BaseModel):
    id: int
    title: str
    contribution: int  # percentage 0-100
    due_date: date

class StressContributorsResponse(BaseModel):
    contributors: list[StressContributorOutput]
    max_contribution: int