from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.oauth2 import get_current_user
from app.core.config import settings
from app.services.user_service import UserService
from app.services.notification_service import NotificationService, conf
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
    """Sends a test email to the current user to verify SMTP settings."""
    from app.models.deadline import Deadline
    from app.services.notification_service import fm
    from fastapi_mail import MessageSchema, MessageType
    from datetime import datetime, timedelta

    smtp_info = {
        "server": settings.MAIL_SERVER,
        "port": settings.MAIL_PORT,
        "starttls": settings.MAIL_STARTTLS,
        "ssl_tls": settings.MAIL_SSL_TLS,
        "from": settings.MAIL_FROM,
        "recipient": current_user.notification_email,
    }

    recipient = current_user.notification_email
    if not recipient:
        raise HTTPException(status_code=400, detail="No notification email set. Go to Profile → Alert Preferences and add one.")

    message = MessageSchema(
        subject="NustPulse — SMTP Connection Test",
        recipients=[recipient],
        body=f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #8B0000; text-transform: uppercase; font-style: italic;">SMTP Test Successful</h2>
            <p>Hi <b>{current_user.name}</b>,</p>
            <p>Your NustPulse email notifications are correctly configured and working.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">NustPulse • Academic Precision</p>
        </div>
        """,
        subtype=MessageType.html
    )

    try:
        await fm.send_message(message)
        return {"message": "Test email sent successfully.", "smtp_config": smtp_info}
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"SMTP connection failed: {str(e)}. Config used: {smtp_info}"
        )
