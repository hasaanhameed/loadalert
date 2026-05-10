from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.models.deadline import Deadline
from app.schemas.dashboard import DashboardSummary, WeeklyLoadDay, CourseSummary
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
        # Fetch deadlines for the next 14 days for a better overview
        end_date = today + timedelta(days=13)

        deadlines = db.query(Deadline).filter(
            Deadline.user_id == current_user.id,
            func.date(Deadline.due_date) >= today,
            Deadline.is_pinned == True
        ).all()

        # 1. Weekly Load (Next 7 days)
        weekly_map = {}
        for i in range(7):
            current_date = today + timedelta(days=i)
            weekly_map[current_date] = {
                "day": current_date.strftime("%a"),
                "date": current_date,
                "deadlines": 0,
                "deadlines_list": []
            }
        
        for deadline in deadlines:
            deadline_date = deadline.due_date.date()
            if today <= deadline_date <= today + timedelta(days=6):
                bucket = weekly_map.get(deadline_date)
                if bucket:
                    bucket["deadlines"] += 1
                    bucket["deadlines_list"].append(deadline)

        weekly_load = [
            WeeklyLoadDay(**day)
            for day in weekly_map.values()
        ]

        # 2. Course Summary
        course_counts = {}
        for deadline in deadlines:
            name = deadline.course_name or "General"
            course_counts[name] = course_counts.get(name, 0) + 1
        
        course_summary = [
            CourseSummary(course_name=name, count=count)
            for name, count in sorted(course_counts.items(), key=lambda x: x[1], reverse=True)
        ]

        result = DashboardSummary(
            upcoming_deadlines=len(deadlines),
            weekly_load=weekly_load,
            course_summary=course_summary
        )
        
        try:
            redis_client.set_json(cache_key, result.model_dump(mode='json'), expiry=300)
        except Exception as e:
            logger.error(f"Failed to cache dashboard: {e}")
        
        return result
