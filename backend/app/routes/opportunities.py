from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, Opportunity, Contact, OpportunityTracking
from ..schemas import OpportunityCreate, OpportunityUpdate, Opportunity as OpportunitySchema
from ..schemas import OpportunityTracking as OpportunityTrackingSchema, OpportunityTrackingCreate
from ..auth import get_current_user

router = APIRouter(
    prefix="/opportunities",
    tags=["opportunities"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=OpportunitySchema)
def create_opportunity(
    opportunity: OpportunityCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if contact exists
    contact = db.query(Contact).filter(Contact.id == opportunity.contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    db_opportunity = Opportunity(**opportunity.dict(), user_id=current_user.id)
    db.add(db_opportunity)
    db.commit()
    db.refresh(db_opportunity)
    return db_opportunity

@router.get("/", response_model=List[OpportunitySchema])
def read_opportunities(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    opportunities = db.query(Opportunity).offset(skip).limit(limit).all()
    return opportunities

@router.get("/contact/{contact_id}", response_model=List[OpportunitySchema])
def read_contact_opportunities(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if contact exists
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    opportunities = db.query(Opportunity).filter(Opportunity.contact_id == contact_id).all()
    return opportunities

@router.get("/{opportunity_id}", response_model=OpportunitySchema)
def read_opportunity(
    opportunity_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if opportunity is None:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opportunity

@router.put("/{opportunity_id}", response_model=OpportunitySchema)
def update_opportunity(
    opportunity_id: int, 
    opportunity: OpportunityUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if db_opportunity is None:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    update_data = opportunity.dict(exclude_unset=True)
    
    # Check if status is being updated to track the change
    if 'status' in update_data and update_data['status'] != db_opportunity.status:
        # Create a tracking entry for status change
        tracking_entry = OpportunityTracking(
            opportunity_id=opportunity_id,
            user_id=current_user.id,
            tracking_type="status_change",
            old_status=db_opportunity.status,
            new_status=update_data['status']
        )
        db.add(tracking_entry)
    
    # Update opportunity fields
    for key, value in update_data.items():
        setattr(db_opportunity, key, value)
    
    db.commit()
    db.refresh(db_opportunity)
    return db_opportunity

@router.delete("/{opportunity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_opportunity(
    opportunity_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if db_opportunity is None:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    db.delete(db_opportunity)
    db.commit()
    return None

@router.get("/{opportunity_id}/tracking", response_model=List[OpportunityTrackingSchema])
def read_opportunity_tracking(
    opportunity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all tracking entries for an opportunity"""
    # Check if opportunity exists
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if opportunity is None:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    tracking_entries = db.query(OpportunityTracking).filter(
        OpportunityTracking.opportunity_id == opportunity_id
    ).order_by(OpportunityTracking.created_at.desc()).all()
    
    return tracking_entries

@router.post("/{opportunity_id}/tracking", response_model=OpportunityTrackingSchema)
def create_tracking_entry(
    opportunity_id: int,
    tracking: OpportunityTrackingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new tracking entry (comment or status change)"""
    # Check if opportunity exists
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if opportunity is None:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    # Ensure the opportunity_id in the path matches the one in the request body
    if tracking.opportunity_id != opportunity_id:
        raise HTTPException(status_code=400, detail="Opportunity ID mismatch")
    
    db_tracking = OpportunityTracking(
        **tracking.dict(),
        user_id=current_user.id
    )
    
    db.add(db_tracking)
    db.commit()
    db.refresh(db_tracking)
    
    return db_tracking
