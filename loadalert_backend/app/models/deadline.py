from sqlalchemy import Column, Integer, String, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from app.database.database import Base

class Deadline(Base):
    __tablename__ = "deadlines"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    due_date = Column(Date, nullable=False)
    course_name = Column(String, nullable=True)
    lms_event_id = Column(Integer, unique=True, nullable=True)
    is_pinned = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="deadlines")
