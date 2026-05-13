from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database.database import Base

class Deadline(Base):
    __tablename__ = "deadlines"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=False)
    course_name = Column(String, nullable=True)
    lms_event_id = Column(Integer, nullable=True)
    is_pinned = Column(Boolean, default=False)
    
    # Notification tracking
    notified_new = Column(Boolean, default=False)
    last_reminder_sent_at = Column(DateTime(timezone=True), nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="deadlines")
