from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from controllers.category_controller import create_category, get_categories

router = APIRouter(prefix="/categories")

@router.post("/")
def add_category(name: str, db: Session = Depends(get_db)):
    return create_category(db, name)

@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    return get_categories(db)