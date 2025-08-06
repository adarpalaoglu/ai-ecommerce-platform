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
