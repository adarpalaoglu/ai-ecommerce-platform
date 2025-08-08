import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from apps.api.src.database import Base
from apps.api.src.main import app
from apps.api.src.models.user import User
from apps.api.src.models.product import Product
from apps.api.src.models.cart import CartItem
from apps.api.src.models.order import Order
from apps.api.src.models.order_item import OrderItem
from apps.api.src.config import SECRET_KEY, ALGORITHM
from jose import jwt
from datetime import datetime, timedelta

# Setup test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(name="session")
def session_fixture():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    with TestingSessionLocal() as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session):
    def override_get_db():
        yield session

    app.dependency_overrides[app.dependency_overrides.get(session)] = override_get_db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(session):
    user = User(email="test@example.com", hashed_password="testpassword", role="buyer")
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture
def test_product(session):
    product = Product(name="Test Product", description="A test product", price=10.0, image_url="", stock=5, category_id=1)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@pytest.fixture
def test_cart_item(session, test_user, test_product):
    cart_item = CartItem(user_id=test_user.id, product_id=test_product.id, quantity=2)
    session.add(cart_item)
    session.commit()
    session.refresh(cart_item)
    return cart_item


@pytest.fixture
def auth_token(test_user):
    to_encode = {"sub": test_user.email}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def test_create_order_integration_success(client, session, test_user, test_product, test_cart_item, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post("/api/orders", headers=headers, json={"shipping_address_id": 1})

    assert response.status_code == 201
    order_data = response.json()
    assert order_data["user_id"] == test_user.id
    assert order_data["total_amount"] == 20.0
    assert order_data["status"] == "Pending"
    assert len(order_data["order_items"]) == 1
    assert order_data["order_items"][0]["product_id"] == test_product.id
    assert order_data["order_items"][0]["quantity"] == 2

    # Verify cart is cleared
    cart_items_in_db = session.query(CartItem).filter(CartItem.user_id == test_user.id).all()
    assert len(cart_items_in_db) == 0

    # Verify product stock updated
    updated_product = session.query(Product).filter(Product.id == test_product.id).first()
    assert updated_product.stock == 3 # Original 5 - 2 = 3

    # Verify order and order items in DB
    order_in_db = session.query(Order).filter(Order.id == order_data["id"]).first()
    assert order_in_db is not None
    assert order_in_db.user_id == test_user.id

    order_items_in_db = session.query(OrderItem).filter(OrderItem.order_id == order_data["id"]).all()
    assert len(order_items_in_db) == 1
    assert order_items_in_db[0].product_id == test_product.id


def test_create_order_integration_empty_cart(client, session, test_user, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post("/api/orders", headers=headers, json={"shipping_address_id": 1})

    assert response.status_code == 400
    assert "Cart is empty" in response.json()["detail"]


def test_create_order_integration_unauthorized(client):
    response = client.post("/api/orders", json={"shipping_address_id": 1})
    assert response.status_code == 401
    assert "Not authenticated" in response.json()["detail"]


def test_create_order_integration_insufficient_stock(client, session, test_user, test_product, auth_token):
    # Add a cart item with quantity exceeding stock
    cart_item = CartItem(user_id=test_user.id, product_id=test_product.id, quantity=100)
    session.add(cart_item)
    session.commit()
    session.refresh(cart_item)

    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post("/api/orders", headers=headers, json={"shipping_address_id": 1})

    assert response.status_code == 400
    assert "Insufficient stock" in response.json()["detail"]


def test_create_order_integration_product_not_found(client, session, test_user, auth_token):
    # Add a cart item with a non-existent product ID
    cart_item = CartItem(user_id=test_user.id, product_id=999, quantity=1)
    session.add(cart_item)
    session.commit()
    session.refresh(cart_item)

    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post("/api/orders", headers=headers, json={"shipping_address_id": 1})

    assert response.status_code == 404
    assert "Product with ID 999 not found" in response.json()["detail"]
