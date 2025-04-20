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

# Cuadro de mandos de oportunidades
from datetime import date, timedelta

@router.get("/opportunity-dashboard")
def get_opportunity_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    first_day_month = today.replace(day=1)
    first_day_prev_month = (first_day_month - timedelta(days=1)).replace(day=1)
    last_day_prev_month = first_day_month - timedelta(days=1)

    # Ventas cerradas este mes y mes anterior
    sales_this_month = db.query(func.sum(Opportunity.value)).filter(
        Opportunity.status == OpportunityStatus.CLOSED_WON,
        Opportunity.updated_at >= first_day_month,
        Opportunity.updated_at <= today
    ).scalar() or 0

    sales_prev_month = db.query(func.sum(Opportunity.value)).filter(
        Opportunity.status == OpportunityStatus.CLOSED_WON,
        Opportunity.updated_at >= first_day_prev_month,
        Opportunity.updated_at <= last_day_prev_month
    ).scalar() or 0

    monthly_sales_trend = 0
    if sales_prev_month > 0:
        monthly_sales_trend = ((sales_this_month - sales_prev_month) / sales_prev_month) * 100

    # Valor del pipeline (oportunidades abiertas)
    pipeline_value = db.query(func.sum(Opportunity.value)).filter(
        Opportunity.status.in_([
            OpportunityStatus.IDENTIFIED,
            OpportunityStatus.QUALIFIED,
            OpportunityStatus.PROPOSAL,
            OpportunityStatus.DECISION
        ])
    ).scalar() or 0

    # Ticket promedio este mes y mes anterior
    tickets_this_month = db.query(func.avg(Opportunity.value)).filter(
        Opportunity.status == OpportunityStatus.CLOSED_WON,
        Opportunity.updated_at >= first_day_month,
        Opportunity.updated_at <= today
    ).scalar() or 0

    tickets_prev_month = db.query(func.avg(Opportunity.value)).filter(
        Opportunity.status == OpportunityStatus.CLOSED_WON,
        Opportunity.updated_at >= first_day_prev_month,
        Opportunity.updated_at <= last_day_prev_month
    ).scalar() or 0

    avg_ticket_trend = 0
    if tickets_prev_month > 0:
        avg_ticket_trend = ((tickets_this_month - tickets_prev_month) / tickets_prev_month) * 100

    # Ratio de conversión este mes y mes anterior
    total_won_this_month = db.query(func.count(Opportunity.id)).filter(
        Opportunity.status == OpportunityStatus.CLOSED_WON,
        Opportunity.updated_at >= first_day_month,
        Opportunity.updated_at <= today
    ).scalar() or 0

    total_closed_this_month = db.query(func.count(Opportunity.id)).filter(
        Opportunity.status.in_([
            OpportunityStatus.CLOSED_WON,
            OpportunityStatus.CLOSED_LOST,
            OpportunityStatus.CLOSED_DISCARDED
        ]),
        Opportunity.updated_at >= first_day_month,
        Opportunity.updated_at <= today
    ).scalar() or 0

    conversion_rate_this_month = (total_won_this_month / total_closed_this_month * 100) if total_closed_this_month > 0 else 0

    total_won_prev_month = db.query(func.count(Opportunity.id)).filter(
        Opportunity.status == OpportunityStatus.CLOSED_WON,
        Opportunity.updated_at >= first_day_prev_month,
        Opportunity.updated_at <= last_day_prev_month
    ).scalar() or 0

    total_closed_prev_month = db.query(func.count(Opportunity.id)).filter(
        Opportunity.status.in_([
            OpportunityStatus.CLOSED_WON,
            OpportunityStatus.CLOSED_LOST,
            OpportunityStatus.CLOSED_DISCARDED
        ]),
        Opportunity.updated_at >= first_day_prev_month,
        Opportunity.updated_at <= last_day_prev_month
    ).scalar() or 0

    conversion_rate_prev_month = (total_won_prev_month / total_closed_prev_month * 100) if total_closed_prev_month > 0 else 0

    conversion_rate_trend = 0
    if conversion_rate_prev_month > 0:
        conversion_rate_trend = (conversion_rate_this_month - conversion_rate_prev_month)

    # Valor por etapa del pipeline
    pipeline_stages = [
        OpportunityStatus.IDENTIFIED.value,
        OpportunityStatus.QUALIFIED.value,
        OpportunityStatus.PROPOSAL.value,
        OpportunityStatus.DECISION.value,
        OpportunityStatus.CLOSED_WON.value,
        OpportunityStatus.CLOSED_LOST.value,
        OpportunityStatus.CLOSED_DISCARDED.value
    ]
    pipeline_by_stage = {}
    for stage in pipeline_stages:
        value = db.query(func.sum(Opportunity.value)).filter(
            Opportunity.status == stage
        ).scalar() or 0
        pipeline_by_stage[stage] = value

    return {
        "monthlySales": {
            "value": float(sales_this_month),
            "trend": float(monthly_sales_trend)
        },
        "pipelineValue": float(pipeline_value),
        "averageTicket": {
            "value": float(tickets_this_month),
            "trend": float(avg_ticket_trend)
        },
        "conversionRate": {
            "value": float(conversion_rate_this_month),
            "trend": float(conversion_rate_trend)
        },
        "pipelineByStage": [
            {"name": stage, "value": float(value)} for stage, value in pipeline_by_stage.items()
        ]
    }
