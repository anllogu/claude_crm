from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User as UserModel
from ..schemas.user import User, UserCreate
from typing import List

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[User])
def list_users(db: Session = Depends(get_db)):
    return db.query(UserModel).all()

@router.post("/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter((UserModel.username == user.username) | (UserModel.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    new_user = UserModel(
        username=user.username,
        email=user.email,
        hashed_password=user.password,  # Aquí deberías hashear la contraseña
        nombre=user.nombre,
        apellidos=user.apellidos,
        rol=user.rol
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.put("/{user_id}", response_model=User)
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.username = user.username
    db_user.email = user.email
    db_user.hashed_password = user.password  # Aquí deberías hashear la contraseña
    db_user.nombre = user.nombre
    db_user.apellidos = user.apellidos
    db_user.rol = user.rol
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/{user_id}", response_model=User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
