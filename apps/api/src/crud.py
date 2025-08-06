from sqlalchemy.orm import Session
from . import models, schemas

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100, category_id: int = None, sort_by_price: str = None):
    query = db.query(models.Product)
    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    if sort_by_price == "asc":
        query = query.order_by(models.Product.price.asc())
    elif sort_by_price == "desc":
        query = query.order_by(models.Product.price.desc())
    return query.offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
