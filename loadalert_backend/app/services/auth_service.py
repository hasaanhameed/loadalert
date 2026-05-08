from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.core.security import create_access_token
from app.services.lms_service import lms_service
from app.services.crypto_service import encrypt_password
from app.services.sync_service import sync_user_deadlines
import logging

logger = logging.getLogger(__name__)

class AuthService:
    @staticmethod
    async def login(db: Session, request):
        # 1. Try to log into NUST LMS
        is_valid = await lms_service.login(request.email, request.password)
        
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid LMS credentials. Please check your email and password."
            )

        # 2. Check if user already exists in our system
        user = db.query(User).filter(User.lms_username == request.email).first()

        # 3. If new user, create their account (Just-In-Time)
        if not user:
            # Fetch their name from the portal automatically
            full_name = await lms_service.get_user_full_name()
            
            user = User(
                name=full_name,
                lms_username=request.email,
                lms_password=encrypt_password(request.password),
                section=request.section
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"Created new NustPulse account for {full_name}")
        else:
            # Update their password/section in case they changed it
            user.lms_password = encrypt_password(request.password)
            user.section = request.section
            db.commit()

        # 4. Trigger an initial sync of deadlines
        await sync_user_deadlines(db, user)

        # 5. Generate our own App Session Token (JWT)
        access_token = create_access_token(data={"sub": user.lms_username})

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user,
        }
