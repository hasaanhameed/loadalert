from datetime import datetime
from sqlalchemy.orm import Session
from app.models.deadline import Deadline
from app.models.user import User
from app.services.lms_service import lms_service
from app.services.crypto_service import decrypt_password
import logging

logger = logging.getLogger(__name__)

async def sync_user_deadlines(db: Session, user: User):
    """Performs a full sync of deadlines from LMS for a specific user."""
    try:
        # 1. Unscramble the password
        password = decrypt_password(user.lms_password)

        # 2. Log into LMS
        logged_in = await lms_service.login(user.lms_username, password)
        if not logged_in:
            logger.error(f"Sync failed: Could not log in for user {user.lms_username}")
            return False

        # 3. Get the session key and fetch assignments
        sesskey = await lms_service.get_sesskey()
        if not sesskey:
            logger.error(f"Sync failed: Could not get sesskey for {user.lms_username}")
            return False

        raw_events = await lms_service.fetch_deadlines(sesskey)
        
        # 4. Filter and Save
        synced_count = 0
        for event in raw_events:
            title = event.get('name', '')
            course_name = event.get('course', {}).get('fullname', '')
            due_timestamp = event.get('timesort', 0)
            lms_id = event.get('id')

            # --- SMART FILTERING LOGIC ---
            if user.section:
                user_section_letter = user.section.split('-')[-1][-1].upper() if '-' in user.section else user.section[-1].upper()
                
                # Check if other sections are mentioned
                skip = False
                for other_letter in ['A', 'B', 'C', 'D', 'E', 'F']:
                    if other_letter != user_section_letter:
                        if f"Section {other_letter}" in title or f"({other_letter})" in title:
                            skip = True
                            break
                if skip:
                    continue

            # Check if this deadline already exists
            existing = db.query(Deadline).filter(
                Deadline.user_id == user.id,
                Deadline.lms_event_id == lms_id
            ).first()

            due_date = datetime.fromtimestamp(due_timestamp).date()

            if not existing:
                new_deadline = Deadline(
                    title=title,
                    due_date=due_date,
                    course_name=course_name,
                    lms_event_id=lms_id,
                    user_id=user.id
                )
                db.add(new_deadline)
                synced_count += 1
            else:
                existing.due_date = due_date
                existing.title = title

        db.commit()
        logger.info(f"Successfully synced {synced_count} new deadlines for {user.lms_username}")
        return True

    except Exception as e:
        logger.error(f"Error during sync process: {str(e)}")
        db.rollback()
        return False
