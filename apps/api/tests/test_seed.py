import sys
sys.path.append(".")

import pytest
from src.database import SessionLocal
from src.models.category import Category
from scripts.seed import seed_categories

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
