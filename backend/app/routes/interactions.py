from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, Interaction, Contact
from ..schemas import InteractionCreate, InteractionUpdate, Interaction as InteractionSchema
from ..auth import get_current_user

router = APIRouter(
    prefix="/interactions",
    tags=["interactions"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=InteractionSchema)
def create_interaction(
    interaction: InteractionCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if contact exists
    contact = db.query(Contact).filter(Contact.id == interaction.contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    db_interaction = Interaction(**interaction.dict(), user_id=current_user.id)
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@router.get("/", response_model=List[InteractionSchema])
def read_interactions(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interactions = db.query(Interaction).offset(skip).limit(limit).all()
    return interactions

@router.get("/contact/{contact_id}", response_model=List[InteractionSchema])
def read_contact_interactions(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if contact exists
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    interactions = db.query(Interaction).filter(Interaction.contact_id == contact_id).all()
    return interactions

@router.get("/{interaction_id}", response_model=InteractionSchema)
def read_interaction(
    interaction_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if interaction is None:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction

@router.put("/{interaction_id}", response_model=InteractionSchema)
def update_interaction(
    interaction_id: int, 
    interaction: InteractionUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if db_interaction is None:
        raise HTTPException(status_code=404, detail="Interaction not found")
    
    update_data = interaction.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_interaction, key, value)
    
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@router.delete("/{interaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interaction(
    interaction_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if db_interaction is None:
        raise HTTPException(status_code=404, detail="Interaction not found")
    
    db.delete(db_interaction)
    db.commit()
    return None
