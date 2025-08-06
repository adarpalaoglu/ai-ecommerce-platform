import sys
sys.path.append("apps/api")

from src.database import SessionLocal
from src.models.category import Category
from src.models.product import Product

def seed_categories():
    db = SessionLocal()
    categories = ["Electronics", "Books", "Home Goods", "Clothing"]
    for category_name in categories:
        if not db.query(Category).filter(Category.name == category_name).first():
            db.add(Category(name=category_name))
    db.commit()
    db.close()

def seed_products():
    db = SessionLocal()
    products_data = [
        {"name": "Laptop", "description": "Powerful laptop for work and gaming", "price": 1200.00, "image_url": "https://example.com/laptop.jpg", "stock": 50, "category_name": "Electronics"},
        {"name": "E-reader", "description": "Portable e-reader with long battery life", "price": 150.00, "image_url": "https://example.com/ereader.jpg", "stock": 200, "category_name": "Books"},
        {"name": "Coffee Maker", "description": "Automatic coffee maker with grinder", "price": 80.00, "image_url": "https://example.com/coffee-maker.jpg", "stock": 100, "category_name": "Home Goods"},
        {"name": "T-shirt", "description": "Comfortable cotton t-shirt", "price": 20.00, "image_url": "https://example.com/tshirt.jpg", "stock": 500, "category_name": "Clothing"},
        {"name": "Smartphone", "description": "Latest model smartphone with advanced camera", "price": 900.00, "image_url": "https://example.com/smartphone.jpg", "stock": 150, "category_name": "Electronics"},
        {"name": "Novel", "description": "Bestselling novel by a renowned author", "price": 15.00, "image_url": "https://example.com/novel.jpg", "stock": 300, "category_name": "Books"},
        {"name": "Blender", "description": "High-speed blender for smoothies and shakes", "price": 60.00, "image_url": "https://example.com/blender.jpg", "stock": 120, "category_name": "Home Goods"},
        {"name": "Jeans", "description": "Durable denim jeans", "price": 45.00, "image_url": "https://example.com/jeans.jpg", "stock": 250, "category_name": "Clothing"},
        {"name": "Headphones", "description": "Noise-cancelling over-ear headphones", "price": 200.00, "image_url": "https://example.com/headphones.jpg", "stock": 80, "category_name": "Electronics"},
        {"name": "Cookbook", "description": "Collection of delicious recipes", "price": 25.00, "image_url": "https://example.com/cookbook.jpg", "stock": 180, "category_name": "Books"},
    ]

    for product_data in products_data:
        category = db.query(Category).filter(Category.name == product_data["category_name"]).first()
        if category:
            product_data["category_id"] = category.id
            del product_data["category_name"]
            if not db.query(Product).filter(Product.name == product_data["name"]).first():
                db.add(Product(**product_data))
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_categories()
    seed_products()

