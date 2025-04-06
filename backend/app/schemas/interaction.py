from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InteractionBase(BaseModel):
    contact_id: int
    type: str
    description: str
    interaction_date: datetime

class InteractionCreate(InteractionBase):
    pass

class InteractionUpdate(BaseModel):
    type: Optional[str] = None
    description: Optional[str] = None
    interaction_date: Optional[datetime] = None

class Interaction(InteractionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
