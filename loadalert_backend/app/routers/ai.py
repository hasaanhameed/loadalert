from fastapi import APIRouter, Depends
from app.core.oauth2 import get_current_user
from app.services.ai_service import AIService
from app.schemas.ai import (
    StressPredictionRequest, StressPredictionResponse,
    PrioritiesRequest, PrioritiesResponse
)
from app.models.user import User

router = APIRouter(prefix="/ai", tags=["AI"])
ai_service = AIService()

@router.post("/stress-prediction", response_model=StressPredictionResponse)
def predict_stress(request: StressPredictionRequest, current_user: User = Depends(get_current_user)):
    return ai_service.predict_stress(request)

@router.post("/priorities", response_model=PrioritiesResponse)
def generate_priorities(request: PrioritiesRequest, current_user: User = Depends(get_current_user)):
    return ai_service.generate_priorities(request)