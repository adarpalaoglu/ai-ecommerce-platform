import sys
sys.path.append(".")

import pytest
from src.database import SessionLocal
from src.models.category import Category
from src.models.product import Product
from scripts.seed import seed_categories, seed_products

@pytest.fixture(scope="module")
def db_session():
    session = SessionLocal()
    yield session
    session.close()

def test_seed_categories(db_session):
    seed_categories()
    categories = db_session.query(Category).all()
    assert len(categories) >= 4
    category_names = [c.name for c in categories]
    assert "Electronics" in category_names
    assert "Books" in category_names
    assert "Home Goods" in category_names
    assert "Clothing" in category_names

def test_seed_products(db_session):
    seed_categories() # Ensure categories exist for products
    seed_products()
    products = db_session.query(Product).all()
    assert len(products) >= 10
    product_names = [p.name for p in products]
    assert "Laptop" in product_names
    assert "E-reader" in product_names
    assert "Coffee Maker" in product_names
    assert "T-shirt" in product_names
    assert "Smartphone" in product_names
    assert "Novel" in product_names
    assert "Blender" in product_names
    assert "Jeans" in product_names
    assert "Headphones" in product_names
    assert "Cookbook" in product_names