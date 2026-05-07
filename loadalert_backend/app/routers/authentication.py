from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database.database import get_db
from app.services.auth_service import AuthService
from app.schemas.auth import LoginResponse

router = APIRouter(tags=['Authentication'])

@router.post('/login', response_model=LoginResponse)
def login(
    request: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    return AuthService.login(db, request)
