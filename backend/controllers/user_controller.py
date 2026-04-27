from sqlalchemy.orm import Session
from models.user import User
from schemas.user_schema import UserCreate, UserLogin
from auth import hash_password, verify_password, create_access_token

def create_user(db: Session, user: UserCreate):
    print("PASSWORD:", user.password)
    print("TYPE:", type(user.password))
    print("LENGTH:", len(user.password))    
    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)  # 🔐 hashed
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def login_user(db: Session, user: UserLogin):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        return None

    # 🎟️ Generate token
    token = create_access_token({"id": db_user.id})

    return {
        "user": db_user,
        "access_token": token
    }
