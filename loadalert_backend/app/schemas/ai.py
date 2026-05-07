from pydantic import BaseModel
from datetime import date

# Stress Prediction
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

# Priorities
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

# Stress Contributors
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
