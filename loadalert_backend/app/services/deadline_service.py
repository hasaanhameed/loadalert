from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.deadline import Deadline
from app.cache.cache_invalidation import invalidate_user_dashboard_cache

class DeadlineService:
    @staticmethod
    def create_deadline(db: Session, current_user, deadline_data):
        new_deadline = Deadline(**deadline_data.model_dump(), user_id=current_user.id)
        db.add(new_deadline)
        db.commit()
        db.refresh(new_deadline)
        invalidate_user_dashboard_cache(current_user.id)
        return new_deadline

    @staticmethod
    def get_user_deadlines(db: Session, current_user):
        return db.query(Deadline).filter(Deadline.user_id == current_user.id).all()

    @staticmethod
    def update_deadline(db: Session, current_user, deadline_id, deadline_update):
        deadline = db.query(Deadline).filter(
            Deadline.id == deadline_id,
            Deadline.user_id == current_user.id
        ).first()

        if not deadline:
            raise HTTPException(status_code=404, detail="Deadline not found")

        update_data = deadline_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(deadline, key, value)

        db.commit()
        db.refresh(deadline)
        invalidate_user_dashboard_cache(current_user.id)
        return deadline

    @staticmethod
    def delete_deadline(db: Session, current_user, deadline_id):
        deadline = db.query(Deadline).filter(
            Deadline.id == deadline_id,
            Deadline.user_id == current_user.id
        ).first()

        if not deadline:
            raise HTTPException(status_code=404, detail="Deadline not found")

        db.delete(deadline)
        db.commit()
        invalidate_user_dashboard_cache(current_user.id)
        return None
