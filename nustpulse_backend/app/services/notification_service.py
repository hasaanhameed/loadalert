import logging
import base64
import pytz
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from app.core.config import settings
from app.models.deadline import Deadline
from app.models.user import User

logger = logging.getLogger(__name__)
PKT = pytz.timezone("Asia/Karachi")

def _get_gmail_service():
    """
    Authenticates and returns a Gmail API service instance using the Refresh Token.
    """
    creds = Credentials(
        None,
        refresh_token=settings.GMAIL_REFRESH_TOKEN,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
    )
    
    # Refresh the access token if it's expired
    if not creds.valid:
        creds.refresh(Request())
        
    return build('gmail', 'v1', credentials=creds)

async def _send_gmail_api(to: str, subject: str, html_body: str):
    """
    Sends an email via the Gmail API (Port 443).
    This is much more reliable than SMTP on cloud providers like Railway.
    """
    try:
        service = _get_gmail_service()
        
        # Create the email message
        message = MIMEText(html_body, 'html')
        message['to'] = to
        message['from'] = settings.MAIL_FROM
        message['subject'] = subject
        
        # Encode the message for the Gmail API
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        
        # Send the message
        service.users().messages().send(
            userId='me',
            body={'raw': raw_message}
        ).execute()
        
        logger.info(f"Gmail API: Email successfully sent to {to}")
    except Exception as e:
        logger.error(f"Gmail API error sending to {to}: {e}")
        raise e

class NotificationService:
    @staticmethod
    async def send_new_deadline_notification(user: User, deadline: Deadline):
        if not user.notification_email or not user.notifications_enabled:
            return

        local_due_date = deadline.due_date.astimezone(PKT)
        html = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #8B0000; text-transform: uppercase; font-style: italic;">New Deadline Added</h2>
            <p>Hi <b>{user.name}</b>,</p>
            <p>A new deadline has been synced for your account:</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #8B0000;">
                <h3 style="margin-top: 0;">{deadline.title}</h3>
                <p style="margin: 5px 0; color: #666;">Course: {deadline.course_name or "General"}</p>
                <p style="margin: 5px 0; font-weight: bold;">Due Date: {local_due_date.strftime("%B %d, %Y at %I:%M %p")}</p>
            </div>
            <p>Head over to <a href="https://nustpulse.com/universal-pulse" style="color: #8B0000; text-decoration: none; font-weight: bold;">Universal Pulse</a> to pin this to your list.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">NustPulse • Academic Precision</p>
        </div>
        """

        try:
            await _send_gmail_api(
                user.notification_email,
                f"Pulse Alert: {deadline.title}",
                html
            )
        except Exception as e:
            logger.error(f"Failed to send new deadline notification to {user.notification_email}: {e}")

    @staticmethod
    async def send_proximity_reminder(user: User, deadline: Deadline, days_left: int):
        if not user.notification_email or not user.notifications_enabled:
            return

        status_text = "DUE TODAY" if days_left == 0 else f"{days_left} Days Remaining"
        subject_text = "🚨 DUE TODAY" if days_left == 0 else f"Deadline Reminder: {days_left} days left"

        local_due_date = deadline.due_date.astimezone(PKT)
        html = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #8B0000; text-transform: uppercase; font-style: italic;">{status_text}</h2>
            <p>Hi <b>{user.name}</b>,</p>
            <p>This is a reminder for your upcoming deadline:</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #8B0000;">
                <h3 style="margin-top: 0;">{deadline.title}</h3>
                <p style="margin: 5px 0; color: #666;">Course: {deadline.course_name or "General"}</p>
                <p style="margin: 5px 0; font-weight: bold; color: #8B0000;">DUE: {local_due_date.strftime("%B %d, %Y at %I:%M %p")}</p>
            </div>
            <p>Stay ahead of the curve.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">NustPulse • Academic Precision</p>
        </div>
        """

        try:
            await _send_gmail_api(
                user.notification_email,
                f"{subject_text} for {deadline.title}",
                html
            )
        except Exception as e:
            logger.error(f"Failed to send proximity reminder to {user.notification_email}: {e}")
