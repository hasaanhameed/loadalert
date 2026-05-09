from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.cache.cache_invalidation import invalidate_user_all_caches

class UserService:
    pass
