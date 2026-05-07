from fastapi import APIRouter, Depends
from app.core.oauth2 import get_current_user
from app.services.ai_service import AIService
from app.schemas.ai import (
    StressContributorsRequest, StressContributorsResponse,
)
from app.models.user import User

router = APIRouter(prefix="/stress", tags=["Stress"])
ai_service = AIService()

@router.post("/contributors", response_model=StressContributorsResponse)
def calculate_stress_contributors(
    request: StressContributorsRequest, 
    current_user: User = Depends(get_current_user)
):
    return ai_service.calculate_contributors(request)