from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from apps.api.src import crud, schemas, models
from apps.api.src.database import get_db
from apps.api.src.config import oauth2_scheme, SECRET_KEY, ALGORITHM
from jose import JWTError, jwt

cart_router = APIRouter()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

@cart_router.get("/cart", response_model=List[schemas.CartItem])
async def read_cart(user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == user.id).all()
    return cart_items

@cart_router.post("/cart/items", response_model=schemas.CartItem)
async def add_item_to_cart(item: schemas.CartItemCreate, user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id=item.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if item.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be positive")
    if product.stock < item.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")

    db_cart_item = db.query(models.CartItem).filter(
        models.CartItem.user_id == user.id,
        models.CartItem.product_id == item.product_id
    ).first()

    if db_cart_item:
        db_cart_item.quantity += item.quantity
        db.add(db_cart_item)
        db.commit()
        db.refresh(db_cart_item)
        return db_cart_item
    else:
        new_cart_item = models.CartItem(user_id=user.id, product_id=item.product_id, quantity=item.quantity)
        db.add(new_cart_item)
        db.commit()
        db.refresh(new_cart_item)
        return new_cart_item

@cart_router.put("/cart/items/{item_id}", response_model=schemas.CartItem)
async def update_cart_item(item_id: int, item: schemas.CartItemCreate, user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_cart_item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == user.id
    ).first()

    if not db_cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    product = crud.get_product(db, product_id=item.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if item.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be positive")
    if product.stock < item.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")

    db_cart_item.quantity = item.quantity
    db.add(db_cart_item)
    db.commit()
    db.refresh(db_cart_item)
    return db_cart_item

@cart_router.delete("/cart/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cart_item(item_id: int, user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_cart_item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == user.id
    ).first()

    if not db_cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(db_cart_item)
    db.commit()
    return {"message": "Cart item deleted successfully"}
