import pytest
from sqlalchemy.orm import Session
from unittest.mock import MagicMock

from apps.api.src import crud, models, schemas

# Mock database session
@pytest.fixture
def mock_db_session():
    return MagicMock(spec=Session)

def test_get_users(mock_db_session):
    # Arrange
    user_data = [
        models.User(id=1, email="test1@example.com", role="buyer"),
        models.User(id=2, email="test2@example.com", role="manager"),
    ]
    mock_db_session.query.return_value.offset.return_value.limit.return_value.all.return_value = user_data

    # Act
    users = crud.get_users(mock_db_session)

    # Assert
    assert len(users) == 2
    assert users[0].email == "test1@example.com"
    assert users[1].role == "manager"

def test_update_user_role(mock_db_session):
    # Arrange
    user_id = 1
    new_role = "admin"
    existing_user = models.User(id=user_id, email="test@example.com", role="buyer")
    mock_db_session.query.return_value.filter.return_value.first.return_value = existing_user

    # Act
    updated_user = crud.update_user_role(mock_db_session, user_id, new_role)

    # Assert
    assert updated_user is not None
    assert updated_user.id == user_id
    assert updated_user.role == new_role
    mock_db_session.add.assert_called_once_with(existing_user)
    mock_db_session.commit.assert_called_once()
    mock_db_session.refresh.assert_called_once_with(existing_user)

def test_update_user_role_user_not_found(mock_db_session):
    # Arrange
    user_id = 999
    new_role = "admin"
    mock_db_session.query.return_value.filter.return_value.first.return_value = None

    # Act
    updated_user = crud.update_user_role(mock_db_session, user_id, new_role)

    # Assert
    assert updated_user is None
    mock_db_session.add.assert_not_called()
    mock_db_session.commit.assert_not_called()
    mock_db_session.refresh.assert_not_called()

