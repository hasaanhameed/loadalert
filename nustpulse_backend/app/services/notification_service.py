import logging
import smtplib
import ssl
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.models.deadline import Deadline
from app.models.user import User

logger = logging.getLogger(__name__)

logger.info(
    f"[SMTP] Config loaded: {settings.MAIL_SERVER}:{settings.MAIL_PORT} "
    f"| STARTTLS={settings.MAIL_STARTTLS} | SSL={settings.MAIL_SSL_TLS} "
    f"| USER={settings.MAIL_USERNAME}"
)


def _send_email_sync(to: str, subject: str, html_body: str):
    """
    Sends an email using Python's built-in smtplib (synchronous).
    Uses STARTTLS on port 587 — the standard that works on all cloud providers.
    Call this via asyncio.to_thread() from async contexts.
    """
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.MAIL_FROM
    msg["To"] = to
    msg.attach(MIMEText(html_body, "html"))

    context = ssl.create_default_context()

    logger.info(f"[SMTP] Connecting to {settings.MAIL_SERVER}:{settings.MAIL_PORT}...")
    with smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT, timeout=30) as smtp:
        smtp.ehlo()
        smtp.starttls(context=context)
        smtp.ehlo()
        smtp.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        smtp.sendmail(settings.MAIL_FROM, [to], msg.as_string())
    logger.info(f"[SMTP] Email sent successfully to {to}")


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

        try:
            await asyncio.to_thread(
                _send_email_sync,
                user.notification_email,
                f"Pulse Alert: {deadline.title}",
                html
            )
            logger.info(f"New deadline notification sent to {user.notification_email}")
        except Exception as e:
            logger.error(f"Failed to send notification to {user.notification_email}: {e}")

    @staticmethod
    async def send_proximity_reminder(user: User, deadline: Deadline, days_left: int):
        if not user.notification_email or not user.notifications_enabled:
            return

        status_text = "DUE TODAY" if days_left == 0 else f"{days_left} Days Remaining"

        html = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #8B0000; text-transform: uppercase; font-style: italic;">{status_text}</h2>
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

        subject_text = "🚨 DUE TODAY" if days_left == 0 else f"Deadline Reminder: {days_left} days left"

        try:
            await asyncio.to_thread(
                _send_email_sync,
                user.notification_email,
                f"{subject_text} for {deadline.title}",
                html
            )
            logger.info(f"Proximity reminder sent to {user.notification_email} for {deadline.title}")
        except Exception as e:
            logger.error(f"Failed to send reminder to {user.notification_email}: {e}")
