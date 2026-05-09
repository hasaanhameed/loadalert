from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.oauth2 import get_current_user
from app.services.user_service import UserService
from app.schemas.user import UserResponse, UserUpdate
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Returns the current user's profile."""
    return current_user
