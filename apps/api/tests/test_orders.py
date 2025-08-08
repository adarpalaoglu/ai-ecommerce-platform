import pytest
from unittest.mock import MagicMock
from sqlalchemy.orm import Session
from fastapi import HTTPException

from apps.api.src.functions.orders.main import create_order
from apps.api.src.models.order import Order
from apps.api.src.models.order_item import OrderItem
from apps.api.src.models.product import Product
from apps.api.src.models.cart import CartItem
from apps.api.src.schemas import OrderCreate


@pytest.fixture
def mock_db_session():
    return MagicMock(spec=Session)

@pytest.fixture
def mock_current_user():
    return {"id": 1, "email": "test@example.com"}

@pytest.fixture
def mock_products():
    return [
        Product(id=1, name="Product A", price=10.0, stock=5),
        Product(id=2, name="Product B", price=20.0, stock=10),
    ]

@pytest.fixture
def mock_cart_items(mock_products):
    return [
        CartItem(user_id=1, product_id=1, quantity=2),
        CartItem(user_id=1, product_id=2, quantity=1),
    ]

def test_create_order_success(mock_db_session, mock_current_user, mock_products, mock_cart_items):
    # Mock query results
    mock_db_session.query.return_value.filter.return_value.all.return_value = mock_cart_items
    mock_db_session.query.return_value.filter.return_value.first.side_effect = mock_products

    order_data = OrderCreate(shipping_address_id=123)

    response_order = create_order(order_data, mock_db_session, mock_current_user)

    assert response_order.user_id == mock_current_user["id"]
    assert response_order.total_amount == (10.0 * 2) + (20.0 * 1) # 40.0
    assert response_order.status == "Pending"
    assert len(response_order.order_items) == 2

    # Verify stock reduction
    assert mock_products[0].stock == 3 # 5 - 2
    assert mock_products[1].stock == 9 # 10 - 1

    # Verify cart cleared
    mock_db_session.delete.call_count == len(mock_cart_items)
    mock_db_session.commit.assert_called_once()
    mock_db_session.refresh.assert_called_once_with(response_order)

def test_create_order_empty_cart(mock_db_session, mock_current_user):
    mock_db_session.query.return_value.filter.return_value.all.return_value = []

    order_data = OrderCreate(shipping_address_id=123)

    with pytest.raises(HTTPException) as exc_info:
        create_order(order_data, mock_db_session, mock_current_user)
    assert exc_info.value.status_code == 400
    assert "Cart is empty" in exc_info.value.detail

def test_create_order_insufficient_stock(mock_db_session, mock_current_user, mock_products, mock_cart_items):
    mock_cart_items[0].quantity = 10 # Request more than available stock
    mock_db_session.query.return_value.filter.return_value.all.return_value = mock_cart_items
    mock_db_session.query.return_value.filter.return_value.first.side_effect = mock_products

    order_data = OrderCreate(shipping_address_id=123)

    with pytest.raises(HTTPException) as exc_info:
        create_order(order_data, mock_db_session, mock_current_user)
    assert exc_info.value.status_code == 400
    assert "Insufficient stock" in exc_info.value.detail

def test_create_order_product_not_found(mock_db_session, mock_current_user, mock_cart_items):
    mock_cart_items[0].product_id = 999 # Non-existent product
    mock_db_session.query.return_value.filter.return_value.all.return_value = mock_cart_items
    mock_db_session.query.return_value.filter.return_value.first.return_value = None

    order_data = OrderCreate(shipping_address_id=123)

    with pytest.raises(HTTPException) as exc_info:
        create_order(order_data, mock_db_session, mock_current_user)
    assert exc_info.value.status_code == 404
    assert "Product with ID 999 not found" in exc_info.value.detail
