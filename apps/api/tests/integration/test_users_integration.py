import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from apps.api.src.main import app
from apps.api.src.database import Base, get_db
from apps.api.src import models, crud, schemas
from apps.api.src.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from jose import jwt
from datetime import datetime, timedelta

# Use a SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(name="db_session")
def db_session_fixture():
    Base.metadata.create_all(bind=engine)  # Create tables
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)  # Drop tables after tests


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


@pytest.fixture
def admin_user_token(db_session):
    # Create an admin user
    admin_user = models.User(email="admin@example.com", hashed_password=crud.pwd_context.hash("adminpass"), role="admin")
    db_session.add(admin_user)
    db_session.commit()
    db_session.refresh(admin_user)

    # Generate a token for the admin user
    to_encode = {"sub": admin_user.email}
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token


@pytest.fixture
def normal_user_token(db_session):
    # Create a normal user
    normal_user = models.User(email="user@example.com", hashed_password=crud.pwd_context.hash("userpass"), role="buyer")
    db_session.add(normal_user)
    db_session.commit()
    db_session.refresh(normal_user)

    # Generate a token for the normal user
    to_encode = {"sub": normal_user.email}
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token


def test_get_users_as_admin(client, db_session, admin_user_token):
    # Create some users
    user1 = models.User(email="user1@example.com", hashed_password="hashedpass", role="buyer")
    user2 = models.User(email="user2@example.com", hashed_password="hashedpass", role="manager")
    db_session.add_all([user1, user2])
    db_session.commit()

    response = client.get(
        "/api/users",
        headers={
            "Authorization": f"Bearer {admin_user_token}"
        }
    )
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 2  # Account for admin user created in fixture
    assert any(u["email"] == "user1@example.com" for u in users)
    assert any(u["email"] == "user2@example.com" for u in users)

def test_get_users_as_normal_user(client, normal_user_token):
    response = client.get(
        "/api/users",
        headers={
            "Authorization": f"Bearer {normal_user_token}"
        }
    )
    assert response.status_code == 403  # Forbidden

def test_get_users_unauthenticated(client):
    response = client.get("/api/users")
    assert response.status_code == 401  # Unauthorized

def test_update_user_role_as_admin(client, db_session, admin_user_token):
    # Create a user to update
    user_to_update = models.User(email="update_me@example.com", hashed_password="hashedpass", role="buyer")
    db_session.add(user_to_update)
    db_session.commit()
    db_session.refresh(user_to_update)

    new_role = "manager"
    response = client.put(
        f"/api/users/{user_to_update.id}/role",
        json={"role": new_role},
        headers={
            "Authorization": f"Bearer {admin_user_token}"
        }
    )
    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["id"] == user_to_update.id
    assert updated_user["role"] == new_role

    # Verify in DB
    db_user = crud.get_user_by_email(db_session, email="update_me@example.com")
    assert db_user.role == new_role

def test_update_user_role_as_normal_user(client, db_session, normal_user_token):
    # Create a user to update
    user_to_update = models.User(email="another_user@example.com", hashed_password="hashedpass", role="buyer")
    db_session.add(user_to_update)
    db_session.commit()
    db_session.refresh(user_to_update)

    new_role = "manager"
    response = client.put(
        f"/api/users/{user_to_update.id}/role",
        json={"role": new_role},
        headers={
            "Authorization": f"Bearer {normal_user_token}"
        }
    )
    assert response.status_code == 403  # Forbidden

def test_update_user_role_user_not_found(client, admin_user_token):
    response = client.put(
        "/api/users/999/role",
        json={"role": "manager"},
        headers={
            "Authorization": f"Bearer {admin_user_token}"
        }
    )
    assert response.status_code == 404  # Not Found

