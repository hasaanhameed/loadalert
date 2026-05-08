from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.auth_service import AuthService
from app.schemas.auth import LoginResponse, LMSLoginRequest

router = APIRouter(tags=['Authentication'])

@router.post('/login', response_model=LoginResponse)
async def login(
    request: LMSLoginRequest,
    db: Session = Depends(get_db)
):
    return await AuthService.login(db, request)
