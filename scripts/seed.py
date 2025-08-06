import sys
sys.path.append("apps/api")

from src.database import SessionLocal
from src.models.category import Category

def seed_categories():
    db = SessionLocal()
    categories = ["Electronics", "Books", "Home Goods", "Clothing"]
    for category_name in categories:
        if not db.query(Category).filter(Category.name == category_name).first():
            db.add(Category(name=category_name))
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_categories()
