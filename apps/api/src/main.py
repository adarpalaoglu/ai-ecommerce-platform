from fastapi import FastAPI
from sqlalchemy.orm import Session

from . import models
from .database import engine
from .functions.products.routes import products_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(products_router, prefix="/api")

@app.get("/")
def read_root():
    return {"Hello": "World"}
