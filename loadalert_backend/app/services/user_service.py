from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.core.security import Hashing
from app.cache.cache_invalidation import invalidate_user_session_cache, invalidate_user_all_caches

class UserService:
    @staticmethod
    def create_user(db: Session, request):
        new_user = User(
            name=request.name, 
            email=request.email, 
            password=Hashing.bcrypt(request.password)
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def update_user(db: Session, current_user, request):
        db_user = db.query(User).filter(User.id == current_user.id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        existing_user = db.query(User).filter(User.email == request.email).filter(User.id != current_user.id).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already in use")

        old_email = db_user.email
        db_user.name = request.name
        db_user.email = request.email

        db.commit()
        db.refresh(db_user)

        invalidate_user_session_cache(old_email)
        if old_email != request.email:
            invalidate_user_session_cache(request.email)
        invalidate_user_all_caches(db_user.id, request.email)

        return db_user

    @staticmethod
    def change_password(db: Session, current_user, request):
        db_user = db.query(User).filter(User.id == current_user.id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if not Hashing.verify(db_user.password, request.current_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Current password is incorrect"
            )

        if Hashing.verify(db_user.password, request.new_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be different from the current password"
            )

        db_user.password = Hashing.bcrypt(request.new_password)
        db.commit()
        
        invalidate_user_session_cache(db_user.email)
        return {"message": "Password updated successfully"}
