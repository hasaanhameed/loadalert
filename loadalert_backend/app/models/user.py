from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    lms_username = Column(String, unique=True, nullable=False)
    lms_password = Column(String, nullable=False)

    deadlines = relationship("Deadline", back_populates="user", cascade="all, delete")
