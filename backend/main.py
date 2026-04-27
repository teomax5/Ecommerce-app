from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from database import engine, Base
from routes import user_routes,category_routes, product_routes
import models  # IMPORTANT: This imports all models to ensure they are registered with SQLAlchemy
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
app.include_router(user_routes.router)
app.include_router(category_routes.router)
app.include_router(product_routes.router)
@app.get("/")
def home():
    return {"message": "Backend is running"}



