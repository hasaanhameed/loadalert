from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.core.security import verify_token
from app.cache.redis_client import redis_client

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    email = verify_token(token, credentials_exception)
    cache_key = f"user_session:{email}"
    cached_user = redis_client.get_json(cache_key)
    
    if cached_user:
        return User(**cached_user)
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    
    user_dict = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
    }
    redis_client.set_json(cache_key, user_dict, expiry=3600)
    return user
