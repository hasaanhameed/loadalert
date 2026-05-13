from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.oauth2 import get_current_user
from app.services.user_service import UserService
from app.services.notification_service import NotificationService
from app.schemas.user import UserResponse, UserUpdate
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Returns the current user's profile."""
    return current_user

@router.put("/me", response_model=UserResponse)
def update_current_user_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Updates the current user's profile settings."""
    return UserService.update_user(db, current_user, user_update)

@router.post("/me/test-email")
async def send_test_email(
    current_user: User = Depends(get_current_user)
):
    """Sends a test email via Gmail API to verify connection."""
    from app.models.deadline import Deadline
    from datetime import datetime, timedelta
    
    dummy_deadline = Deadline(
        title="NustPulse Connection Test",
        course_name="System Check",
        due_date=datetime.now() + timedelta(days=1)
    )
    
    await NotificationService.send_proximity_reminder(current_user, dummy_deadline, 1)
    return {"message": "Test email sent successfully via Gmail API"}
