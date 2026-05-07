from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database.database import Base

class Deadline(Base):
    __tablename__ = "deadlines"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    due_date = Column(Date, nullable=False)
    estimated_effort = Column(Integer, nullable=False)
    importance_level = Column(String, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="deadlines")
