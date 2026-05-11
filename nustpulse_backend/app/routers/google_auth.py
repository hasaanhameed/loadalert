from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
import httpx
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.config import settings
from app.core.oauth2 import get_current_user
from app.models.user import User
from app.core.security import verify_token

router = APIRouter(prefix="/api/auth/google", tags=["Google OAuth"])

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

@router.get("/authorize")
async def authorize(token: str):
    """
    Step 1: Redirect user to Google for authorization.
    We pass the user's current JWT in the 'state' parameter.
    """
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "state": token,  # Pass the user's JWT as state
        "access_type": "offline",
        "prompt": "consent"
    }
    
    url = f"{GOOGLE_AUTH_URL}?" + "&".join([f"{k}={v}" for k, v in params.items()])
    return {"url": url}

@router.get("/callback")
async def callback(
    code: str, 
    state: str, 
    db: Session = Depends(get_db)
):
    """
    Step 2: Handle the callback from Google.
    1. Verify the user using the JWT in 'state'.
    2. Exchange 'code' for an ID token.
    3. Get email from Google profile.
    4. Update user's notification_email.
    """
    # 1. Verify User from state (JWT)
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid state parameter",
        headers={"WWW-Authenticate": "Bearer"},
    )
    username = verify_token(state, credentials_exception)
    user = db.query(User).filter(User.lms_username == username).first()
    
    if not user:
        raise credentials_exception

    # 2. Exchange code for token
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            },
        )
        token_data = token_response.json()
        
        if "error" in token_data:
            raise HTTPException(status_code=400, detail=token_data.get("error_description", "Failed to exchange code"))

        access_token = token_data.get("access_token")
        
        # 3. Get user info (email)
        userinfo_response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user_info = userinfo_response.json()
        google_email = user_info.get("email")

    if not google_email:
        raise HTTPException(status_code=400, detail="Could not retrieve email from Google")

    # 4. Update user notification email and enable alerts
    user.notification_email = google_email
    user.notifications_enabled = True
    db.commit()

    # Redirect back to the frontend profile page
    return RedirectResponse(url="http://localhost:8080/profile?connected=true")
