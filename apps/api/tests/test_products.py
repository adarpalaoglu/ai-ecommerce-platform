import sys
sys.path.append("apps/api")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.main import app
from src.database import Base, get_db
from src.models import product, category
from src.models.product import Product
from src.models.category import Category

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
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def seed_test_data(db_session):
    # Seed categories
    category1 = Category(name="Electronics")
    category2 = Category(name="Books")
    db_session.add_all([category1, category2])
    db_session.commit()
    db_session.refresh(category1)
    db_session.refresh(category2)

    # Seed products
    product1 = Product(name="Laptop", description="Powerful laptop", price=1200.00, image_url="url1", stock=50, category_id=category1.id)
    product2 = Product(name="Mouse", description="Wireless mouse", price=25.00, image_url="url2", stock=200, category_id=category1.id)
    product3 = Product(name="Keyboard", description="Mechanical keyboard", price=75.00, image_url="url5", stock=150, category_id=category1.id)
    product4 = Product(name="Monitor", description="4K monitor", price=300.00, image_url="url6", stock=80, category_id=category1.id)
    product5 = Product(name="Webcam", description="HD webcam", price=50.00, image_url="url7", stock=120, category_id=category1.id)
    product6 = Product(name="Book A", description="Fantasy novel", price=15.00, image_url="url3", stock=100, category_id=category2.id)
    product7 = Product(name="Book B", description="Sci-fi novel", price=20.00, image_url="url4", stock=75, category_id=category2.id)
    product8 = Product(name="Book C", description="Mystery novel", price=18.00, image_url="url8", stock=90, category_id=category2.id)
    product9 = Product(name="Book D", description="Thriller novel", price=22.00, image_url="url9", stock=60, category_id=category2.id)
    product10 = Product(name="Book E", description="Romance novel", price=12.00, image_url="url10", stock=110, category_id=category2.id)
    db_session.add_all([product1, product2, product3, product4, product5, product6, product7, product8, product9, product10])
    db_session.commit()
    db_session.refresh(product1)
    db_session.refresh(product2)
    db_session.refresh(product3)
    db_session.refresh(product4)


def test_read_products(client, db_session):
    seed_test_data(db_session)
    response = client.get("/api/products")
    assert response.status_code == 200
    assert len(response.json()) == 10

def test_read_products_pagination(client, db_session):
    seed_test_data(db_session)
    response = client.get("/api/products?skip=0&limit=2")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["name"] == "Laptop"

def test_read_products_filter_by_category(client, db_session):
    seed_test_data(db_session)
    electronics_category = db_session.query(Category).filter(Category.name == "Electronics").first()
    response = client.get(f"/api/products?category_id={electronics_category.id}")
    assert response.status_code == 200
    assert len(response.json()) == 5
    assert response.json()[0]["name"] == "Laptop"
    assert response.json()[1]["name"] == "Mouse"

def test_read_products_sort_by_price_asc(client, db_session):
    seed_test_data(db_session)
    response = client.get("/api/products?sort_by_price=asc")
    assert response.status_code == 200
    prices = [p["price"] for p in response.json()]
    assert prices == sorted(prices)

def test_read_products_sort_by_price_desc(client, db_session):
    seed_test_data(db_session)
    response = client.get("/api/products?sort_by_price=desc")
    assert response.status_code == 200
    prices = [p["price"] for p in response.json()]
    assert prices == sorted(prices, reverse=True)

def test_read_single_product(client, db_session):
    seed_test_data(db_session)
    product = db_session.query(Product).filter(Product.name == "Laptop").first()
    response = client.get(f"/api/products/{product.id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Laptop"

def test_read_single_product_not_found(client, db_session):
    seed_test_data(db_session)
    response = client.get("/api/products/999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Product not found"}
