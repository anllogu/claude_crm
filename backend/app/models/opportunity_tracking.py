from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class OpportunityTracking(Base):
    __tablename__ = "opportunity_tracking"

    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    tracking_type = Column(String)  # "status_change" o "comment"
    old_status = Column(String, nullable=True)
    new_status = Column(String, nullable=True)
    comment = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    opportunity = relationship("Opportunity", back_populates="tracking_entries")
    user = relationship("User")
