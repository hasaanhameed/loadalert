import asyncio
import logging
from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.core.celery_app import celery_app
from app.models.user import User
from app.models.deadline import Deadline
from app.services.sync_service import SyncService
from app.services.notification_service import NotificationService

logger = logging.getLogger(__name__)

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()

@celery_app.task(name="sync_all_users")
def sync_all_users():
    """
    Background task to sync LMS deadlines for all users with stored credentials.
    Runs every 4 hours via Celery Beat.
    """
    db = SessionLocal()
    try:
        users = db.query(User).all()
        logger.info(f"Starting background sync for {len(users)} users.")
        
        for user in users:
            # We run the sync in an event loop because SyncService is async
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # This should not happen in a typical celery worker
                # but we handle it just in case
                asyncio.ensure_future(SyncService.sync_by_stored_credentials(db, user))
            else:
                loop.run_until_complete(SyncService.sync_by_stored_credentials(db, user))
                
        # After sync, we check for new deadlines that haven't been notified
        new_deadlines = db.query(Deadline).filter(Deadline.notified_new == False).all()
        for deadline in new_deadlines:
            user = deadline.user
            if user.notification_email and user.notifications_enabled:
                loop.run_until_complete(NotificationService.send_new_deadline_notification(user, deadline))
                deadline.notified_new = True
        
        db.commit()
        logger.info("Background sync and notification pass completed.")
    except Exception as e:
        logger.error(f"Error in sync_all_users task: {e}")
    finally:
        db.close()

@celery_app.task(name="daily_reminder_check")
def daily_reminder_check():
    """
    Checks for pinned deadlines due in less than 3 days.
    Runs once a day via Celery Beat.
    """
    db = SessionLocal()
    try:
        today = date.today()
        three_days_from_now = today + timedelta(days=3)
        
        # Fetch pinned deadlines due soon
        upcoming = db.query(Deadline).filter(
            Deadline.is_pinned == True,
            Deadline.due_date >= today,
            Deadline.due_date <= three_days_from_now
        ).all()
        
        logger.info(f"Checking reminders for {len(upcoming)} upcoming deadlines.")
        
        loop = asyncio.get_event_loop()
        
        for deadline in upcoming:
            user = deadline.user
            logger.info(f"Processing reminder for {user.notification_email} - {deadline.title}")

            # Check if we already sent a reminder today
            if deadline.last_reminder_sent_at and deadline.last_reminder_sent_at.date() == today:
                logger.info(f"Skipping {deadline.title}: Already sent today.")
                continue
                
            days_left = (deadline.due_date.date() - today).days
            logger.info(f"Days left for {deadline.title}: {days_left}")
            
            if user.notification_email and user.notifications_enabled:
                logger.info(f"TRIGGERING EMAIL to {user.notification_email} for {deadline.title}")
                loop.run_until_complete(NotificationService.send_proximity_reminder(user, deadline, days_left))
                deadline.last_reminder_sent_at = datetime.now()
            else:
                logger.info(f"Skipping {deadline.title}: User notifications disabled or email missing.")
        
        db.commit()
        logger.info("Daily reminder check completed.")
    except Exception as e:
        logger.error(f"Error in daily_reminder_check task: {e}")
    finally:
        db.close()
