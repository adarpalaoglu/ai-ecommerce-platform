from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from apps.api.src.database import SessionLocal
from apps.api.src.models.order import Order
from apps.api.src.models.order_item import OrderItem
from apps.api.src.models.product import Product
from apps.api.src.models.cart import CartItem
from apps.api.src.schemas import OrderCreate, OrderResponse, OrderItemCreate
from apps.api.src.functions.auth import get_current_user # Assuming this exists for JWT auth

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate, # This will likely be empty or contain shipping info, cart will be fetched
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user) # Assuming get_current_user returns a dict with 'id'
):
    user_id = current_user['id']

    # 1. Retrieve the current user's cart contents
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    if not cart_items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty. Cannot create an order.")

    total_amount = 0
    order_items_to_create = []
    products_to_update = []

    # 2. Validate product stock and prepare order items
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product with ID {item.product_id} not found.")
        if product.stock < item.quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Insufficient stock for product {product.name}. Available: {product.stock}, Requested: {item.quantity}")

        order_items_to_create.append(
            OrderItem(
                product_id=item.product_id,
                quantity=item.quantity,
                price=product.price # Use current product price
            )
        )
        total_amount += item.quantity * product.price
        product.stock -= item.quantity # Decrease stock
        products_to_update.append(product)

    # 3. Create a new order entry
    new_order = Order(
        user_id=user_id,
        total_amount=total_amount,
        status="Pending",
        shipping_address_id=order_data.shipping_address_id # Assuming shipping_address_id comes from request
    )
    db.add(new_order)
    db.flush() # Flush to get the new_order.id

    # 4. Populate the order_items table
    for order_item in order_items_to_create:
        order_item.order_id = new_order.id
        db.add(order_item)

    # Update product stock
    for product in products_to_update:
        db.add(product)

    # 5. Clear the user's shopping cart
    for item in cart_items:
        db.delete(item)

    db.commit()
    db.refresh(new_order)

    # 6. Return a confirmation of the newly created order
    return new_order
