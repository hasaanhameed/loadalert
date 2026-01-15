from fastapi import APIRouter, Depends, status, HTTPException
import models, schema, database
from sqlalchemy.orm import Session
from hashing import Hash
from authorization.oauth2 import get_current_user


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

    current_user.name = request.name
    current_user.email = request.email

    db.commit()
    db.refresh(current_user)

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }

@router.put("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    request: schema.ChangePasswordRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not Hash.verify(
        plain_password=request.current_password,
        hashed_password=current_user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )

    # 2. Prevent reusing the same password (optional but good practice)
    if Hash.verify(
        plain_password=request.new_password,
        hashed_password=current_user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current password"
        )

    # 3. Hash and store new password
    current_user.password = Hash.bcrypt(request.new_password)

    db.commit()

    return {
        "message": "Password updated successfully"
    }

