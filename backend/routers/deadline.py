from fastapi import APIRouter, Depends, status  
from sqlalchemy.orm import Session

from database import get_db
import models
from schema import Deadline, DeadlineResponse, DeadlineUpdate
from authorization.oauth2 import get_current_user

router = APIRouter(prefix="/deadlines",tags=["Deadlines"])

# Create a deadline
@router.post("/", response_model=DeadlineResponse)
def create_deadline(deadline: Deadline, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_deadline = models.Deadline(**deadline.dict(), user_id=current_user.id)

    db.add(new_deadline)
    db.commit()
    db.refresh(new_deadline)

    return new_deadline

# Get all deadlines for the current user
@router.get("/", response_model=list[DeadlineResponse])
def get_my_deadlines(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Deadline).filter(models.Deadline.user_id == current_user.id).all()
    
# Update a dealine
@router.put("/{deadline_id}", response_model=Deadline)
def update_deadline(deadline_id: int, deadline_update: DeadlineUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    deadline = db.query(models.Deadline).filter(
        models.Deadline.id == deadline_id,
        models.Deadline.user_id == current_user.id
    ).first()

    if not deadline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deadline not found"
        )

    for key, value in deadline_update.dict(exclude_unset=True).items():
        setattr(deadline, key, value)

    db.commit()
    db.refresh(deadline)
    return deadline

# Delete a deadline
@router.delete("/{deadline_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deadline(deadline_id: int,db: Session = Depends(get_db),current_user: models.User = Depends(get_current_user),):
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
