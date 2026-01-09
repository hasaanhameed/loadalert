from fastapi import APIRouter, Depends
import models, schema
from database import get_db
from sqlalchemy.orm import Session
from hashing import Hash
router = APIRouter(prefix="/users", tags=["users"])

# Create a new user
@router.post("/")
def create_user(request: schema.User, db : Session = Depends(get_db)):
    new_user = models.User(name=request.name, email=request.email, password=Hash.bcrypt(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

