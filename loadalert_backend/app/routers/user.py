from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.oauth2 import get_current_user
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserResponse, UserUpdate, ChangePasswordRequest
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse)
def create_user(request: UserCreate, db: Session = Depends(get_db)):
    return UserService.create_user(db, request)

@router.put("/me", response_model=UserResponse)
def update_current_user(
    request: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return UserService.update_user(db, current_user, request)

@router.put("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return UserService.change_password(db, current_user, request)
