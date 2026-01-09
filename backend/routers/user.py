from fastapi import APIRouter, Depends
import models, schema, database
from sqlalchemy.orm import Session
from hashing import Hash
router = APIRouter(prefix="/users", tags=["users"])

# Create a new user/Sign UP
@router.post("/")
def create_user(request: schema.User, db : Session = Depends(database.get_db)):
    new_user = models.User(name=request.name, email=request.email, password=Hash.bcrypt(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/by-email/{email}")
def get_user_by_email(email: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
