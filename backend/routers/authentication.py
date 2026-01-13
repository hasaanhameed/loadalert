from fastapi import APIRouter, Depends, HTTPException, status
import database, models, hashing, schema
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from authorization import auth_token


router = APIRouter(tags=['Authentication'])

@router.post('/login', response_model=schema.LoginResponse)
def login(
    request: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(
        models.User.email == request.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid credentials"
        )

    if not hashing.Hash.verify(
        plain_password=request.password,
        hashed_password=user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid credentials"
        )

    access_token = auth_token.create_access_token(
        data={"sub": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,  
    }
