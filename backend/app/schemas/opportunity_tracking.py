from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OpportunityTrackingBase(BaseModel):
    tracking_type: str
    old_status: Optional[str] = None
    new_status: Optional[str] = None
    comment: Optional[str] = None

class OpportunityTrackingCreate(OpportunityTrackingBase):
    opportunity_id: int

class OpportunityTracking(OpportunityTrackingBase):
    id: int
    opportunity_id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
