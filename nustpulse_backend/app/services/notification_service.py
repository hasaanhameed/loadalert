import logging
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings
from app.models.deadline import Deadline
from app.models.user import User

logger = logging.getLogger(__name__)

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fm = FastMail(conf)

class NotificationService:
    @staticmethod
    async def send_new_deadline_notification(user: User, deadline: Deadline):
        if not user.notification_email or not user.notifications_enabled:
            return

        html = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #8B0000; text-transform: uppercase; font-style: italic;">New Deadline Detected</h2>
            <p>Hi <b>{user.name}</b>,</p>
            <p>A new deadline has been detected in your Universal Pulse stream:</p>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #8B0000; margin: 20px 0;">
                <h3 style="margin: 0;">{deadline.title}</h3>
                <p style="margin: 5px 0; color: #666;">Course: {deadline.course_name or "General"}</p>
                <p style="margin: 5px 0; font-weight: bold;">Due Date: {deadline.due_date.strftime("%B %d, %Y at %I:%M %p")}</p>
            </div>
            <p>Head over to <a href="http://nustpulse.com/universal-pulse" style="color: #8B0000; text-decoration: none; font-weight: bold;">Universal Pulse</a> to pin this to your list.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">NustPulse • Academic Precision</p>
        </div>
        """

        message = MessageSchema(
            subject=f"Pulse Alert: {deadline.title}",
            recipients=[user.notification_email],
            body=html,
            subtype=MessageType.html
        )

        try:
            await fm.send_message(message)
            logger.info(f"New deadline notification sent to {user.notification_email}")
        except Exception as e:
            logger.error(f"Failed to send notification to {user.notification_email}: {e}")

    @staticmethod
    async def send_proximity_reminder(user: User, deadline: Deadline, days_left: int):
        if not user.notification_email or not user.notifications_enabled:
            return

        html = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #8B0000; text-transform: uppercase; font-style: italic;">{days_left} Days Remaining</h2>
            <p>Hi <b>{user.name}</b>,</p>
            <p>This is a reminder for your upcoming deadline:</p>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #8B0000; margin: 20px 0;">
                <h3 style="margin: 0;">{deadline.title}</h3>
                <p style="margin: 5px 0; color: #666;">Course: {deadline.course_name or "General"}</p>
                <p style="margin: 5px 0; font-weight: bold; color: #8B0000;">Due Date: {deadline.due_date.strftime("%B %d, %Y at %I:%M %p")}</p>
            </div>
            <p>Don't let it slip! Keep your pulse steady.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">NustPulse • Academic Precision</p>
        </div>
        """

        message = MessageSchema(
            subject=f"Deadline Reminder: {days_left} days left for {deadline.title}",
            recipients=[user.notification_email],
            body=html,
            subtype=MessageType.html
        )

        try:
            await fm.send_message(message)
            logger.info(f"Proximity reminder sent to {user.notification_email} for {deadline.title}")
        except Exception as e:
            logger.error(f"Failed to send reminder to {user.notification_email}: {e}")
