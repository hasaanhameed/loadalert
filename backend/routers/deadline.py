from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
import logging

from database import get_db
import models
from schema import Deadline, DeadlineResponse, DeadlineUpdate
from authorization.oauth2 import get_current_user
from cache.cache_invalidation import invalidate_user_dashboard_cache

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/deadlines", tags=["Deadlines"])

# Create a deadline
@router.post("/", response_model=DeadlineResponse)
def create_deadline(
    deadline: Deadline, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    # Use model_dump() instead of dict() for Pydantic v2
    new_deadline = models.Deadline(**deadline.model_dump(), user_id=current_user.id)

    db.add(new_deadline)
    db.commit()
    db.refresh(new_deadline)

    # Invalidate dashboard cache since data changed
    invalidate_user_dashboard_cache(current_user.id)
    logger.info(f"Created deadline and invalidated cache for user {current_user.id}")

    return new_deadline

# Get all deadlines for the current user
@router.get("/", response_model=list[DeadlineResponse])
def get_my_deadlines(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    logger.info(f"Fetching deadlines for user {current_user.id}")
    # No cache invalidation needed for GET requests
    return db.query(models.Deadline).filter(
        models.Deadline.user_id == current_user.id
    ).all()
    
# Update a deadline
@router.put("/{deadline_id}", response_model=DeadlineResponse)
def update_deadline(
    deadline_id: int, 
    deadline_update: DeadlineUpdate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    deadline = db.query(models.Deadline).filter(
        models.Deadline.id == deadline_id,
        models.Deadline.user_id == current_user.id
    ).first()

    if not deadline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deadline not found"
        )

    # Use model_dump() with exclude_unset for Pydantic v2
    update_data = deadline_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(deadline, key, value)

    db.commit()
    db.refresh(deadline)
    
    # Invalidate dashboard cache since data changed
    invalidate_user_dashboard_cache(current_user.id)
    logger.info(f"Updated deadline {deadline_id} and invalidated cache for user {current_user.id}")
    
    return deadline

# Delete a deadline
@router.delete("/{deadline_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deadline(
    deadline_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    deadline = db.query(models.Deadline).filter(
        models.Deadline.id == deadline_id,
        models.Deadline.user_id == current_user.id
    ).first()

    if not deadline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deadline not found"
        )

    db.delete(deadline)
    db.commit()
    
    # Invalidate dashboard cache since data changed
    invalidate_user_dashboard_cache(current_user.id)
    logger.info(f"Deleted deadline {deadline_id} and invalidated cache for user {current_user.id}")
    
    # FastAPI automatically returns 204 No Content, no return needed
    return None