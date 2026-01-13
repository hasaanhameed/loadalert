from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta

import models
from database import get_db
from authorization.oauth2 import get_current_user
from schema import DashboardSummary, WeeklyLoadDay

router = APIRouter(prefix="/dashboard",tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    today = date.today()
    end_date = today + timedelta(days=6)

    deadlines = (
    db.query(models.Deadline)
    .filter(models.Deadline.user_id == current_user.id)
    .filter(models.Deadline.due_date >= today)
    .filter(models.Deadline.due_date <= end_date)
    .all())

    # Initialize Weekly Buckets
    weekly_map = {}

    for i in range(7):
        current_date = today + timedelta(days=i)
        weekday = current_date.strftime("%a")  # Mon, Tue, etc.

        weekly_map[current_date] = {
            "day": weekday,
            "date": current_date,
            "deadlines": 0,
            "hours": 0
        }
    
    # Aggregate Deadlines into Buckets
    for deadline in deadlines:
        bucket = weekly_map.get(deadline.due_date)
        if bucket:
            bucket["deadlines"] += 1
            bucket["hours"] += deadline.estimated_effort

    # Compute Totals
    upcoming_deadlines = len(deadlines)
    total_hours = sum(d["hours"] for d in weekly_map.values())

    weekly_load = [
        WeeklyLoadDay(
            day=day["day"],
            date=day["date"],
            deadlines=day["deadlines"],
            hours=day["hours"]
        )
        for day in weekly_map.values()
    ]

    return DashboardSummary(
        upcoming_deadlines=upcoming_deadlines,
        total_hours=total_hours,
        weekly_load=weekly_load
    )



