from pydantic import BaseModel
from typing import Optional



# ✅ Category Response
class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


# ✅ Product Response (with nested category)
class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category: CategoryResponse

    class Config:
        from_attributes = True


# ✅ Product Create
class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category_id: int
    
class ProductUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None