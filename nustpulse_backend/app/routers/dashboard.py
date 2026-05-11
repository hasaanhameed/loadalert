from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.oauth2 import get_current_user
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import DashboardSummary
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return DashboardService.get_summary(db, current_user)