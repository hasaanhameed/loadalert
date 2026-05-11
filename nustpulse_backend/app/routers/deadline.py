from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.oauth2 import get_current_user
from app.services.deadline_service import DeadlineService
from app.schemas.deadline import DeadlineCreate, DeadlineResponse, DeadlineUpdate
from app.models.user import User

router = APIRouter(prefix="/deadlines", tags=["Deadlines"])

@router.post("/", response_model=DeadlineResponse)
def create_deadline(
    deadline: DeadlineCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return DeadlineService.create_deadline(db, current_user, deadline)

@router.get("/", response_model=list[DeadlineResponse])
def get_my_deadlines(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return DeadlineService.get_user_deadlines(db, current_user)

@router.put("/{deadline_id}", response_model=DeadlineResponse)
def update_deadline(
    deadline_id: int, 
    deadline_update: DeadlineUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return DeadlineService.update_deadline(db, current_user, deadline_id, deadline_update)

@router.delete("/{deadline_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deadline(
    deadline_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DeadlineService.delete_deadline(db, current_user, deadline_id)

@router.put("/{deadline_id}/pin", response_model=DeadlineResponse)
def toggle_pin(
    deadline_id: int,
    is_pinned: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Pins or unpins a deadline (adds to My Deadlines)."""
    return DeadlineService.toggle_deadline_pin(db, current_user, deadline_id, is_pinned)