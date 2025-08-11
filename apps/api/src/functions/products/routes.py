from typing import List, Optional

from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session

from ... import crud, schemas
from ...database import get_db

products_router = APIRouter()

@products_router.get("/products", response_model=List[schemas.Product])
def read_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    sort_by_price: Optional[str] = None,
    db: Session = Depends(get_db),
):
    products = crud.get_products(db, skip=skip, limit=limit, category_id=category_id, sort_by_price=sort_by_price)
    return products


@products_router.get("/products/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@products_router.post("/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

@products_router.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    print(f"[DEBUG] update_product endpoint - Received product_id: {product_id}, product data: {product.model_dump()}")
    db_product = crud.update_product(db, product_id=product_id, product=product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@products_router.options("/products/{product_id}")
async def options_product_id_handler(product_id: int):
    return {"Allow": "GET, PUT, DELETE, OPTIONS"}
