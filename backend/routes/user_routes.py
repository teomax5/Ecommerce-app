from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.user_schema import UserCreate, UserLogin, UserResponse
from controllers.user_controller import create_user, login_user
from schemas.user_schema import TokenResponse
from auth import get_current_user
from models.user import User

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)


@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    result = login_user(db, user)

    if not result:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    return result

@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }    