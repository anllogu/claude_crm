from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    nombre = Column(String, nullable=False)
    apellidos = Column(String, nullable=False)
    rol = Column(String, nullable=False, default="usuario")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    interactions = relationship("Interaction", back_populates="user")
    opportunities = relationship("Opportunity", back_populates="user")
