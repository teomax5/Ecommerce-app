from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from controllers.product_controller import create_product, get_products
from schemas.product_schema import ProductCreate, ProductResponse, ProductUpdateSchema
from auth import get_current_user
from typing import List
from models.product import Product

router = APIRouter(prefix="/products")


# ➕ CREATE
@router.post("/")
def add_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return create_product(db, data)


# 📦 GET ALL
@router.get("/", response_model=List[ProductResponse])
def read_products(
    category_id: int = Query(None),
    cursor: int = Query(None),
    limit: int = Query(10),
    search: str = None,
    min_price: float = None,
    max_price: float = None,
    sort: str = None,
    offset: int = Query(0),
    db: Session = Depends(get_db)
):
    return get_products(
        db, category_id, cursor, limit,
        search, min_price, max_price, sort, offset
    )


# 🔍 GET ONE ✅ FIXED
@router.get("/{id}")
def get_product(id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


# ✏️ UPDATE ✅ FIXED
@router.patch("/{id}")
def update_product(
    id: int,
    data: ProductUpdateSchema,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = data.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product