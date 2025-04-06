from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, Opportunity, Contact
from ..schemas import OpportunityCreate, OpportunityUpdate, Opportunity as OpportunitySchema
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
