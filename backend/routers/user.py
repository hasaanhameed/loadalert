from fastapi import APIRouter, Depends, status, HTTPException
import models, schema, database
from sqlalchemy.orm import Session
from hashing import Hash
from authorization.oauth2 import get_current_user
from cache.cache_invalidation import invalidate_user_session_cache, invalidate_user_all_caches


router = APIRouter(prefix="/users", tags=["users"])

# Create a new user/Sign UP
@router.post("/")
def create_user(request: schema.User, db : Session = Depends(database.get_db)):
    new_user = models.User(name=request.name, email=request.email, password=Hash.bcrypt(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Update a user information
@router.put("/me", status_code=status.HTTP_200_OK)
def update_current_user(
    request: schema.UserUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Get the user from the database session using the ID from cached user
    db_user = db.query(models.User).filter(models.User.id == current_user.id).first()
    
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Check if email is already used by another user
    existing_user = (
        db.query(models.User)
        .filter(models.User.email == request.email)
        .filter(models.User.id != current_user.id)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already in use"
        )

    # Store old email for cache invalidation
    old_email = db_user.email
    
    # Update the database user object
    db_user.name = request.name
    db_user.email = request.email

    db.commit()
    db.refresh(db_user)
    
    # Invalidate cache for both old and new email (if changed)
    invalidate_user_session_cache(old_email)
    if old_email != request.email:
        invalidate_user_session_cache(request.email)
    
    # Invalidate all user caches
    invalidate_user_all_caches(db_user.id, request.email)

    return {
        "id": db_user.id,
        "name": db_user.name,
        "email": db_user.email
    }

@router.put("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    request: schema.ChangePasswordRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Get user from database session
    db_user = db.query(models.User).filter(models.User.id == current_user.id).first()
    
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # 1. Verify current password
    if not Hash.verify(
        plain_password=request.current_password,
        hashed_password=db_user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )

    # 2. Prevent reusing the same password
    if Hash.verify(
        plain_password=request.new_password,
        hashed_password=db_user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current password"
        )

    # 3. Hash and store new password
    db_user.password = Hash.bcrypt(request.new_password)

    db.commit()
    
    # 4. Invalidate user session cache (force re-login)
    invalidate_user_session_cache(db_user.email)

    return {
        "message": "Password updated successfully"
    }