from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.core.security import create_access_token
from app.services.lms_service import LMSSession
from app.services.crypto_service import encrypt_password
from app.services.sync_service import SyncService
import logging

logger = logging.getLogger(__name__)


from app.database.database import SessionLocal

class AuthService:
    @staticmethod
    async def login(db: Session, request, background_tasks):
        # Normalize email/username
        request.email = request.email.strip().lower()

        # 1. Open a fresh LMS session and authenticate
        lms = LMSSession()
        try:
            is_valid = await lms.login(request.email, request.password)

            if not is_valid:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid LMS credentials. Please check your email and password.",
                )

            # 2. Check if user already exists in our system
            user = db.query(User).filter(User.lms_username == request.email).first()

            # 3. If new user, create their account (Just-In-Time)
            if not user:
                # Fetch their name using the already-authenticated session
                full_name = await lms.get_user_full_name()

                user = User(
                    name=full_name,
                    lms_username=request.email,
                    lms_password=encrypt_password(request.password),
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                logger.info(f"Created new NustPulse account for {full_name}")
            else:
                # Always refresh name in case it was previously missing/wrong
                full_name = await lms.get_user_full_name()
                if full_name and full_name != "NUST Student":
                    user.name = full_name
                # Update stored password in case it changed
                user.lms_password = encrypt_password(request.password)
                db.commit()
        finally:
            await lms.close()

        # 4. Trigger sync in the background so login is instant
        background_tasks.add_task(AuthService._background_sync, user.id, request.password)

        # 5. Generate our App Session Token (JWT)
        access_token = create_access_token(data={"sub": user.lms_username})

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user,
        }

    @staticmethod
    async def _background_sync(user_id: int, password: str):
        """Helper to run sync with a fresh DB session in the background."""
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                await SyncService.sync_user_deadlines(db, user, password)
        finally:
            db.close()
