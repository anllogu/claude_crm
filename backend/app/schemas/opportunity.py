from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.opportunity import OpportunityStatus

class OpportunityBase(BaseModel):
    contact_id: int
    name: str
    description: Optional[str] = None
    value: Optional[float] = None
    status: str = OpportunityStatus.IDENTIFIED
    expected_close_date: Optional[datetime] = None

class OpportunityCreate(OpportunityBase):
    pass

class OpportunityUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    value: Optional[float] = None
    status: Optional[str] = None
    expected_close_date: Optional[datetime] = None

class Opportunity(OpportunityBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
