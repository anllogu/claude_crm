from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..database import Base

class OpportunityStatus(str, enum.Enum):
    IDENTIFIED = "Identificada"
    QUALIFIED = "Calificada"
    PROPOSAL = "Propuesta"
    DECISION = "Decisión"
    CLOSED_WON = "Cerrada Ganada"
    CLOSED_LOST = "Cerrada Perdida"
    CLOSED_DISCARDED = "Cerrada Descartada"

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    value = Column(Float, nullable=True)
    status = Column(String, default=OpportunityStatus.IDENTIFIED)
    expected_close_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    contact = relationship("Contact", back_populates="opportunities")
    user = relationship("User", back_populates="opportunities")
    tracking_entries = relationship("OpportunityTracking", back_populates="opportunity")
