from app.core.config import settings
from celery.schedules import crontab
from celery import Celery

celery_app = Celery(
    "worker",
    broker=f"{settings.REDIS_URL}",
    backend=f"{settings.REDIS_URL}"
)

celery_app.conf.task_routes = {
    "app.tasks.*": "main-queue",
}

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Karachi",
    enable_utc=True,
)

# Optional: Automatic discovery of tasks
celery_app.autodiscover_tasks(["app"])

celery_app.conf.beat_schedule = {
    "sync-every-4-hours": {
        "task": "sync_all_users",
        "schedule": crontab(minute=0, hour="*/4"),
    },
    "daily-reminders-at-1130am": {
        "task": "daily_reminder_check",
        "schedule": crontab(minute=30, hour=11),
    },
}
