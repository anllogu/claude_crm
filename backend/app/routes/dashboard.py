from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import User, Contact, Opportunity, OpportunityStatus
from ..auth import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
    responses={404: {"description": "Not found"}},
)

@router.get("/kpis")
def get_kpis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Count total contacts
    total_contacts = db.query(func.count(Contact.id)).scalar()
    
    # Count open opportunities
    open_opportunities = db.query(func.count(Opportunity.id)).filter(
        Opportunity.status.in_([
            OpportunityStatus.IDENTIFIED,
            OpportunityStatus.QUALIFIED,
            OpportunityStatus.PROPOSAL,
            OpportunityStatus.DECISION
        ])
    ).scalar()
    
    # Count won opportunities
    won_opportunities = db.query(func.count(Opportunity.id)).filter(
        Opportunity.status == OpportunityStatus.CLOSED_WON
    ).scalar()
    
    # Sum value of won opportunities
    total_won_value = db.query(func.sum(Opportunity.value)).filter(
        Opportunity.status == OpportunityStatus.CLOSED_WON
    ).scalar() or 0
    
    return {
        "total_contacts": total_contacts,
        "open_opportunities": open_opportunities,
        "won_opportunities": won_opportunities,
        "total_won_value": total_won_value
    }

@router.get("/opportunities-by-status")
def get_opportunities_by_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Count opportunities by status
    results = db.query(
        Opportunity.status,
        func.count(Opportunity.id).label("count")
    ).group_by(Opportunity.status).all()
    
    # Convert to dictionary
    status_counts = {status: 0 for status in OpportunityStatus}
    for status, count in results:
        status_counts[status] = count
    
    return status_counts
