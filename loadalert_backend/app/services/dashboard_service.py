from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.models.deadline import Deadline
from app.schemas.dashboard import DashboardSummary, WeeklyLoadDay
from app.cache.redis_client import redis_client
import logging

logger = logging.getLogger(__name__)

class DashboardService:
    @staticmethod
    def get_summary(db: Session, current_user):
        cache_key = f"dashboard:summary:{current_user.id}"
        cached_data = redis_client.get_json(cache_key)
        
        if cached_data:
            return DashboardSummary(**cached_data)
        
        today = date.today()
        end_date = today + timedelta(days=6)

        deadlines = db.query(Deadline).filter(
            Deadline.user_id == current_user.id,
            Deadline.due_date >= today,
            Deadline.due_date <= end_date
        ).all()

        weekly_map = {}
        for i in range(7):
            current_date = today + timedelta(days=i)
            weekly_map[current_date] = {
                "day": current_date.strftime("%a"),
                "date": current_date,
                "deadlines": 0,
                "hours": 0
            }
        
        for deadline in deadlines:
            bucket = weekly_map.get(deadline.due_date)
            if bucket:
                bucket["deadlines"] += 1
                bucket["hours"] += deadline.estimated_effort

        upcoming_deadlines = len(deadlines)
        total_hours = sum(d["hours"] for d in weekly_map.values())

        weekly_load = [
            WeeklyLoadDay(**day)
            for day in weekly_map.values()
        ]

        result = DashboardSummary(
            upcoming_deadlines=upcoming_deadlines,
            total_hours=total_hours,
            weekly_load=weekly_load
        )
        
        try:
            redis_client.set_json(cache_key, result.model_dump(mode='json'), expiry=300)
        except Exception as e:
            logger.error(f"Failed to cache dashboard: {e}")
        
        return result
