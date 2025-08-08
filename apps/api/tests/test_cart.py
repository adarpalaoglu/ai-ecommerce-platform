import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from apps.api.src.database import Base, get_db
from apps.api.src.main import app
from apps.api.src.models import User, Product, Category
from apps.api.src.crud import get_user_by_email, create_user, get_product
from apps.api.src.schemas import UserCreate

# Use a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(name="db_session")
def db_session_fixture():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(name="client")
def client_fixture(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture(name="test_user")
def test_user_fixture(db_session):
    user_data = UserCreate(email="test@example.com", password="password")
    user = create_user(db_session, user_data)
    return user

@pytest.fixture(name="test_product")
def test_product_fixture(db_session):
    category = Category(name="Electronics")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)
    product = Product(
        name="Test Product",
        description="A product for testing",
        price=10.0,
        image_url="http://example.com/image.jpg",
        stock=100,
        category_id=category.id
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)
    return product

@pytest.fixture(name="auth_headers")
def auth_headers_fixture(client, test_user):
    response = client.post(
        "/api/auth/login",
        data={"username": test_user.email, "password": "password"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_add_item_to_cart(client, auth_headers, test_product):
    response = client.post(
        "/api/cart/items",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 1}
    )
    assert response.status_code == 200
    assert response.json()["product_id"] == test_product.id
    assert response.json()["quantity"] == 1

def test_add_existing_item_to_cart(client, auth_headers, test_product):
    client.post(
        "/api/cart/items",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 1}
    )
    response = client.post(
        "/api/cart/items",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 2}
    )
    assert response.status_code == 200
    assert response.json()["product_id"] == test_product.id
    assert response.json()["quantity"] == 3

def test_add_item_to_cart_product_not_found(client, auth_headers):
    response = client.post(
        "/api/cart/items",
        headers=auth_headers,
        json={"product_id": 999, "quantity": 1}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"

def test_add_item_to_cart_invalid_quantity(client, auth_headers, test_product):
    response = client.post(
        "/api/cart/items",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 0}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Quantity must be positive"

def test_add_item_to_cart_not_enough_stock(client, auth_headers, test_product):
    response = client.post(
        "/api/cart/items",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 200}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Not enough stock"

def test_read_cart(client, auth_headers, test_product):
    client.post(
        "/api/cart/items",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 1}
    )
    response = client.get(
        "/api/cart",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["product_id"] == test_product.id
    assert response.json()[0]["quantity"] == 1

def test_update_cart_item(client, auth_headers, test_product):
    add_response = client.post(
        "/api/cart/items",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 1}
    )
    cart_item_id = add_response.json()["id"]

    update_response = client.put(
        f"/api/cart/items/{cart_item_id}",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 5}
    )
    assert update_response.status_code == 200
    assert update_response.json()["quantity"] == 5

def test_update_cart_item_not_found(client, auth_headers, test_product):
    response = client.put(
        "/api/cart/items/999",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 5}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Cart item not found"

def test_update_cart_item_invalid_quantity(client, auth_headers, test_product):
    add_response = client.post(
        "/api/cart/items",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 1}
    )
    cart_item_id = add_response.json()["id"]

    response = client.put(
        f"/api/cart/items/{cart_item_id}",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 0}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Quantity must be positive"

def test_update_cart_item_not_enough_stock(client, auth_headers, test_product):
    add_response = client.post(
        "/api/cart/items",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 1}
    )
    cart_item_id = add_response.json()["id"]

    response = client.put(
        f"/api/cart/items/{cart_item_id}",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 200}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Not enough stock"

def test_delete_cart_item(client, auth_headers, test_product):
    add_response = client.post(
        "/api/cart/items",
        headers=auth_headers,
        json={"product_id": test_product.id, "quantity": 1}
    )
    cart_item_id = add_response.json()["id"]

    response = client.delete(
        f"/api/cart/items/{cart_item_id}",
        headers=auth_headers
    )
    assert response.status_code == 204

def test_delete_cart_item_not_found(client, auth_headers):
    response = client.delete(
        "/api/cart/items/999",
        headers=auth_headers
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Cart item not found"

def test_cart_unauthorized_access(client):
    response = client.get("/api/cart")
    assert response.status_code == 401

    response = client.post("/api/cart/items", json={"product_id": 1, "quantity": 1})
    assert response.status_code == 401

    response = client.put("/api/cart/items/1", json={"product_id": 1, "quantity": 1})
    assert response.status_code == 401

    response = client.delete("/api/cart/items/1")
    assert response.status_code == 401
