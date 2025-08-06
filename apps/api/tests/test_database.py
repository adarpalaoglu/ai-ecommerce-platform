import sys
sys.path.append("apps/api")

import pytest
from src.database import SessionLocal, engine

def test_database_connection():
    try:
        connection = engine.connect()
        connection.close()
        assert True
    except Exception as e:
        pytest.fail(f"Database connection failed: {e}")
