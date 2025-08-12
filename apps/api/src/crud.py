from sqlalchemy.orm import Session
from . import models, schemas
from .models.category import Category # Import Category model
from passlib.context import CryptContext
from fastapi import HTTPException # Import HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

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

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    product_data = product.model_dump()
    category_name = product_data.pop("category")
    db_category = db.query(models.Category).filter(models.Category.name == category_name).first()
    if db_category is None:
        raise HTTPException(status_code=400, detail=f"Category '{category_name}' not found")
    
    db_product = models.Product(**product_data, category_id=db_category.id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductUpdate):
    print(f"[DEBUG] crud.update_product - Received product_id: {product_id}, product data: {product.model_dump()}")
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        update_data = product.model_dump(exclude_unset=True)
        print(f"[DEBUG] crud.update_product - update_data: {update_data}") # Added log
        if "category" in update_data:
            category_name = update_data.pop("category")
            db_category = db.query(models.Category).filter(models.Category.name == category_name).first()
            if db_category is None:
                raise HTTPException(status_code=400, detail=f"Category '{category_name}' not found")
            db_product.category_id = db_category.id

        for key, value in update_data.items():
            setattr(db_product, key, value)
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product
    return None

def get_cart_items(db: Session, user_id: int):
    return db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()

def add_item_to_cart(db: Session, user_id: int, product_id: int, quantity: int):
    db_cart_item = models.CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
    db.add(db_cart_item)
    db.commit()
    db.refresh(db_cart_item)
    return db_cart_item

def get_cart_item(db: Session, cart_item_id: int):
    return db.query(models.CartItem).filter(models.CartItem.id == cart_item_id).first()

def remove_item_from_cart(db: Session, cart_item_id: int):
    db_cart_item = get_cart_item(db, cart_item_id)
    if db_cart_item:
        db.delete(db_cart_item)
        db.commit()
    return db_cart_item

def clear_cart(db: Session, user_id: int):
    db.query(models.CartItem).filter(models.CartItem.user_id == user_id).delete()
    db.commit()

def create_order(db: Session, user_id: int):
    cart_items = get_cart_items(db, user_id)
    if not cart_items:
        return None # Or raise an exception

    total_amount = sum(item.product.price * item.quantity for item in cart_items)
    
    db_order = models.Order(user_id=user_id, total_amount=total_amount)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in cart_items:
        db_order_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price
        )
        db.add(db_order_item)
    
    db.commit()
    
    clear_cart(db, user_id)
    
    db.refresh(db_order)
    return db_order

def update_user_role(db: Session, user_id: int, new_role: str):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.role = new_role
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    return None