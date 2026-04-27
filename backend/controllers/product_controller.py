from sqlalchemy.orm import Session
from models.product import Product
from sqlalchemy import or_

def create_product(db: Session, data):
    product = Product(**data.dict())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def get_products(
    db,
    category_id=None,
    cursor=None,
    limit=10,
    search=None,
    min_price=None,
    max_price=None,
    sort=None,
    offset=0
):
    query = db.query(Product)

    # Category filter
    if category_id:
        query = query.filter(Product.category_id == category_id)

    # Search (name + description)
    if search:
        query = query.filter(
            Product.name.ilike(f"%{search}%") |
            Product.description.ilike(f"%{search}%")
        )

    # Price filter
    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Sorting
    if sort == "price_asc":
        query = query.order_by(Product.price.asc(), Product.id.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc(), Product.id.desc())
    else:
        query = query.order_by(Product.id.asc())

    # Pagination
    if sort:
        query = query.offset(offset).limit(limit)
    else:
        if cursor is not None:   # ✅ fix
            query = query.filter(Product.id > cursor)
        query = query.limit(limit)
    return query.all()