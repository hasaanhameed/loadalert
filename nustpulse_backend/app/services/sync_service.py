import logging
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.services.lms_service import LMSSession
from app.models.deadline import Deadline
from app.models.user import User
from app.services.crypto_service import decrypt_password

logger = logging.getLogger(__name__)

# Moodle event types that represent student deadlines
DEADLINE_EVENT_TYPES = {"assign", "assignment", "quiz", "due", "turnitintool"}


class SyncService:
    @staticmethod
    async def sync_user_deadlines(db: Session, user: User, password: str) -> bool:
        """
        Synchronises assignments from NUST LMS for a specific user.
        Creates a fresh LMSSession per call to avoid stale-cookie failures.
        """
        session = LMSSession()
        try:
            # 1. Log into LMS with a clean session
            is_logged_in = await session.login(user.lms_username, password)
            if not is_logged_in:
                logger.error(f"Sync failed: Could not log in for user {user.lms_username}")
                return False

            # 2. Get sesskey
            sesskey = await session.get_sesskey()
            if not sesskey:
                logger.error(f"Sync failed: Could not retrieve sesskey for {user.lms_username}")
                return False

            # 3. Fetch calendar events
            events = await session.get_calendar_events(sesskey)
            logger.info(f"Retrieved {len(events)} events from LMS for {user.lms_username}")

            # 4. Process events and upsert into database
            synced_ids = []
            for event in events:
                event_type = (event.get("eventtype") or "").lower()
                if event_type not in DEADLINE_EVENT_TYPES:
                    continue

                lms_event_id = event.get("id")
                title        = event.get("name", "Untitled")
                timestart    = event.get("timestart")
                course_name  = event.get("course", {}).get("fullname", "Unknown Course")

                if not lms_event_id or not timestart:
                    continue

                synced_ids.append(lms_event_id)
                due_date = datetime.fromtimestamp(timestart, tz=timezone.utc)

                existing = (
                    db.query(Deadline)
                    .filter(
                        Deadline.user_id == user.id,
                        Deadline.lms_event_id == lms_event_id,
                    )
                    .first()
                )

                if existing:
                    existing.title       = title
                    existing.due_date    = due_date
                    existing.course_name = course_name
                else:
                    db.add(
                        Deadline(
                            title=title,
                            due_date=due_date,
                            course_name=course_name,
                            lms_event_id=lms_event_id,
                            user_id=user.id,
                        )
                    )

            # 5. Pruning: Remove deadlines that are no longer in the LMS response
            # (Only for deadlines that have an lms_event_id, to avoid deleting manual tasks)
            prune_query = db.query(Deadline).filter(
                Deadline.user_id == user.id,
                Deadline.lms_event_id.isnot(None)
            )
            
            if synced_ids:
                prune_query = prune_query.filter(Deadline.lms_event_id.notin_(synced_ids))
            
            deleted_count = prune_query.delete(synchronize_session=False)
            
            if deleted_count > 0:
                logger.info(f"Pruned {deleted_count} stale/submitted deadlines for {user.lms_username}")

            db.commit()
            logger.info(
                f"Successfully synced {len(synced_ids)} deadline(s) for {user.lms_username}"
            )
            return True

        except Exception as e:
            logger.error(f"Critical error during sync for {user.lms_username}: {str(e)}")
            db.rollback()
            return False
        finally:
            await session.close()

    @staticmethod
    async def sync_by_stored_credentials(db: Session, user: User) -> bool:
        """
        Syncs using the password stored in the DB (called from the /sync endpoint).
        """
        try:
            plain_password = decrypt_password(user.lms_password)
        except Exception as e:
            logger.error(f"Could not decrypt password for {user.lms_username}: {e}")
            return False

        return await SyncService.sync_user_deadlines(db, user, plain_password)


sync_service = SyncService()
