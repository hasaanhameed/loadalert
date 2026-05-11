from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User


class UserService:
    @staticmethod
    def update_user(db: Session, user: User, user_update):
        update_data = user_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)
        
        db.commit()
        db.refresh(user)

        return user
