from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, database
from authorization import auth_token
from cache.redis_client import redis_client
import json

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(database.get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = auth_token.verify_token(token, credentials_exception)
    
    # Create Redis key for this user's session
    cache_key = f"user_session:{token_data.email}"
    
    # Try to get user from Redis cache
    cached_user = redis_client.get_json(cache_key)
    
    if cached_user:
        print(f"Cache HIT: User {token_data.email} loaded from Redis")
        # Convert cached dict back to User object
        user = models.User(**cached_user)
        return user
    
    print(f"Cache MISS: User {token_data.email} loading from database")
    
    # Fetch the actual user from database
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    
    if user is None:
        raise credentials_exception
    
    # Store user in Redis for future requests
    # Convert SQLAlchemy model to dict
    user_dict = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        # Add other fields you need
        # Don't cache sensitive data like hashed_password
    }
    
    # Cache for 1 hour (3600 seconds)
    redis_client.set_json(cache_key, user_dict, expiry=3600)
    print(f"Cached user {token_data.email} in Redis")
    
    return user