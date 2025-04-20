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
    status_counts = {status.value: 0 for status in OpportunityStatus}
    for status, count in results:
        # status puede ser string, aseguramos que coincida con el valor del enum
        if isinstance(status, OpportunityStatus):
            key = status.value
        else:
            key = str(status)
        status_counts[key] = count
    
    return status_counts

@router.get("/opportunities-by-client")
def get_opportunities_by_client(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Obtener la suma del valor de oportunidades agrupadas por cliente
        results = db.query(
            Contact.company,
            func.sum(Opportunity.value).label("total_value")
        ).join(Contact, Contact.id == Opportunity.contact_id)\
         .group_by(Contact.company)\
         .order_by(func.sum(Opportunity.value).desc())\
         .all()
        
        # Convertir a diccionario, ignorando company o total_value nulos
        client_values = {
            str(company) if company is not None else "Sin empresa": float(total_value) if total_value is not None else 0.0
            for company, total_value in results
        }
        return client_values
    except Exception as e:
        print("Error en /dashboard/opportunities-by-client:", e)
        raise HTTPException(status_code=500, detail=str(e))
