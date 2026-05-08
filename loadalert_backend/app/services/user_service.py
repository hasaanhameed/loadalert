from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.cache.cache_invalidation import invalidate_user_all_caches

class UserService:
    @staticmethod
    def update_user(db: Session, current_user, request):
        db_user = db.query(User).filter(User.id == current_user.id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        db_user.name = request.name
        if request.section:
            db_user.section = request.section

        db.commit()
        db.refresh(db_user)

        # Invalidate caches to ensure fresh data
        invalidate_user_all_caches(db_user.id, db_user.lms_username)

        return db_user
