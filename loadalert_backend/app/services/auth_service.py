from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.core.security import Hashing, create_access_token
from app.schemas.auth import LoginResponse

class AuthService:
    @staticmethod
    def login(db: Session, request):
        user = db.query(User).filter(User.email == request.username).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invalid credentials"
            )

        if not Hashing.verify(user.password, request.password):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invalid credentials"
            )

        access_token = create_access_token(data={"sub": user.email})

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user,
        }
