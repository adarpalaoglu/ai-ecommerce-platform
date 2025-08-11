from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

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

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

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