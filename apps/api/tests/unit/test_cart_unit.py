import pytest
from unittest.mock import MagicMock
from sqlalchemy.orm import Session
from fastapi import HTTPException

from apps.api.src import crud, models, schemas
from apps.api.src.functions.cart.routes import (read_cart, add_item_to_cart, update_cart_item, delete_cart_item, get_current_user)

# Mock data
@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)

@pytest.fixture
def mock_user():
    return models.User(id=1, email="test@example.com", hashed_password="hashed_password")

@pytest.fixture
def mock_product():
    return models.Product(id=1, name="Test Product", stock=10)

@pytest.fixture
def mock_cart_item(mock_user, mock_product):
    return models.CartItem(id=1, user_id=mock_user.id, product_id=mock_product.id, quantity=1)

# Test get_current_user (unit test for JWT validation logic)
@pytest.mark.asyncio
async def test_get_current_user_success(mock_db, mock_user):
    # Mock jwt.decode to return a valid payload
    with pytest.MonkeyPatch.context() as mp:
        mp.setattr("jose.jwt.decode", lambda token, key, algorithms: {"sub": mock_user.email})
        crud.get_user_by_email = MagicMock(return_value=mock_user)
        user = await get_current_user(token="valid_token", db=mock_db)
        assert user.id == mock_user.id

@pytest.mark.asyncio
async def test_get_current_user_invalid_token(mock_db):
    with pytest.MonkeyPatch.context() as mp:
        mp.setattr("jose.jwt.decode", MagicMock(side_effect=Exception))
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token="invalid_token", db=mock_db)
        assert exc_info.value.status_code == 401

@pytest.mark.asyncio
async def test_get_current_user_user_not_found(mock_db):
    with pytest.MonkeyPatch.context() as mp:
        mp.setattr("jose.jwt.decode", lambda token, key, algorithms: {"sub": "nonexistent@example.com"})
        crud.get_user_by_email = MagicMock(return_value=None)
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token="valid_token", db=mock_db)
        assert exc_info.value.status_code == 401

# Test add_item_to_cart
@pytest.mark.asyncio
async def test_add_item_to_cart_new_item(mock_db, mock_user, mock_product):
    crud.get_product = MagicMock(return_value=mock_product)
    mock_db.query.return_value.filter.return_value.first.return_value = None
    mock_db.add = MagicMock()
    mock_db.commit = MagicMock()
    mock_db.refresh = MagicMock()

    item_create = schemas.CartItemCreate(product_id=mock_product.id, quantity=1)
    result = await add_item_to_cart(item=item_create, user=mock_user, db=mock_db)

    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once()
    assert result.product_id == mock_product.id
    assert result.quantity == 1

@pytest.mark.asyncio
async def test_add_item_to_cart_existing_item(mock_db, mock_user, mock_product, mock_cart_item):
    crud.get_product = MagicMock(return_value=mock_product)
    mock_db.query.return_value.filter.return_value.first.return_value = mock_cart_item
    mock_db.add = MagicMock()
    mock_db.commit = MagicMock()
    mock_db.refresh = MagicMock()

    item_create = schemas.CartItemCreate(product_id=mock_product.id, quantity=2)
    result = await add_item_to_cart(item=item_create, user=mock_user, db=mock_db)

    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once()
    assert result.product_id == mock_product.id
    assert result.quantity == 3  # 1 (initial) + 2 (new)

@pytest.mark.asyncio
async def test_add_item_to_cart_product_not_found(mock_db, mock_user):
    crud.get_product = MagicMock(return_value=None)
    item_create = schemas.CartItemCreate(product_id=999, quantity=1)
    with pytest.raises(HTTPException) as exc_info:
        await add_item_to_cart(item=item_create, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 404

@pytest.mark.asyncio
async def test_add_item_to_cart_invalid_quantity(mock_db, mock_user, mock_product):
    crud.get_product = MagicMock(return_value=mock_product)
    item_create = schemas.CartItemCreate(product_id=mock_product.id, quantity=0)
    with pytest.raises(HTTPException) as exc_info:
        await add_item_to_cart(item=item_create, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 400

@pytest.mark.asyncio
async def test_add_item_to_cart_not_enough_stock(mock_db, mock_user, mock_product):
    crud.get_product = MagicMock(return_value=mock_product)
    item_create = schemas.CartItemCreate(product_id=mock_product.id, quantity=100)
    with pytest.raises(HTTPException) as exc_info:
        await add_item_to_cart(item=item_create, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 400

# Test read_cart
@pytest.mark.asyncio
async def test_read_cart_success(mock_db, mock_user, mock_cart_item):
    mock_db.query.return_value.filter.return_value.all.return_value = [mock_cart_item]
    result = await read_cart(user=mock_user, db=mock_db)
    assert len(result) == 1
    assert result[0].id == mock_cart_item.id

@pytest.mark.asyncio
async def test_read_cart_empty(mock_db, mock_user):
    mock_db.query.return_value.filter.return_value.all.return_value = []
    result = await read_cart(user=mock_user, db=mock_db)
    assert len(result) == 0

# Test update_cart_item
@pytest.mark.asyncio
async def test_update_cart_item_success(mock_db, mock_user, mock_product, mock_cart_item):
    mock_db.query.return_value.filter.return_value.first.return_value = mock_cart_item
    crud.get_product = MagicMock(return_value=mock_product)
    mock_db.add = MagicMock()
    mock_db.commit = MagicMock()
    mock_db.refresh = MagicMock()

    item_update = schemas.CartItemCreate(product_id=mock_product.id, quantity=5)
    result = await update_cart_item(item_id=mock_cart_item.id, item=item_update, user=mock_user, db=mock_db)

    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once()
    assert result.quantity == 5

@pytest.mark.asyncio
async def test_update_cart_item_not_found(mock_db, mock_user, mock_product):
    mock_db.query.return_value.filter.return_value.first.return_value = None
    item_update = schemas.CartItemCreate(product_id=mock_product.id, quantity=5)
    with pytest.raises(HTTPException) as exc_info:
        await update_cart_item(item_id=999, item=item_update, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 404

@pytest.mark.asyncio
async def test_update_cart_item_invalid_quantity(mock_db, mock_user, mock_product, mock_cart_item):
    mock_db.query.return_value.filter.return_value.first.return_value = mock_cart_item
    crud.get_product = MagicMock(return_value=mock_product)
    item_update = schemas.CartItemCreate(product_id=mock_product.id, quantity=0)
    with pytest.raises(HTTPException) as exc_info:
        await update_cart_item(item_id=mock_cart_item.id, item=item_update, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 400

@pytest.mark.asyncio
async def test_update_cart_item_not_enough_stock(mock_db, mock_user, mock_product, mock_cart_item):
    mock_db.query.return_value.filter.return_value.first.return_value = mock_cart_item
    crud.get_product = MagicMock(return_value=mock_product)
    item_update = schemas.CartItemCreate(product_id=mock_product.id, quantity=100)
    with pytest.raises(HTTPException) as exc_info:
        await update_cart_item(item_id=mock_cart_item.id, item=item_update, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 400

# Test delete_cart_item
@pytest.mark.asyncio
async def test_delete_cart_item_success(mock_db, mock_user, mock_cart_item):
    mock_db.query.return_value.filter.return_value.first.return_value = mock_cart_item
    mock_db.delete = MagicMock()
    mock_db.commit = MagicMock()

    result = await delete_cart_item(item_id=mock_cart_item.id, user=mock_user, db=mock_db)

    mock_db.delete.assert_called_once_with(mock_cart_item)
    mock_db.commit.assert_called_once()
    assert result == {"message": "Cart item deleted successfully"}

@pytest.mark.asyncio
async def test_delete_cart_item_not_found(mock_db, mock_user):
    mock_db.query.return_value.filter.return_value.first.return_value = None
    with pytest.raises(HTTPException) as exc_info:
        await delete_cart_item(item_id=999, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 404


# Mock data
@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)

@pytest.fixture
def mock_user():
    return models.User(id=1, email="test@example.com", hashed_password="hashed_password")

@pytest.fixture
def mock_product():
    return models.Product(id=1, name="Test Product", stock=10)

@pytest.fixture
def mock_cart_item(mock_user, mock_product):
    return models.CartItem(id=1, user_id=mock_user.id, product_id=mock_product.id, quantity=1)

# Test get_current_user (unit test for JWT validation logic)
def test_get_current_user_success(mock_db, mock_user):
    # Mock jwt.decode to return a valid payload
    with pytest.MonkeyPatch.context() as mp:
        mp.setattr("jose.jwt.decode", lambda token, key, algorithms: {"sub": mock_user.email})
        crud.get_user_by_email = MagicMock(return_value=mock_user)
        user = get_current_user(token="valid_token", db=mock_db)
        assert user.id == mock_user.id

def test_get_current_user_invalid_token(mock_db):
    with pytest.MonkeyPatch.context() as mp:
        mp.setattr("jose.jwt.decode", MagicMock(side_effect=Exception))
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token="invalid_token", db=mock_db)
        assert exc_info.value.status_code == 401

@pytest.mark.asyncio
def test_get_current_user_user_not_found(mock_db):
    with pytest.MonkeyPatch.context() as mp:
        mp.setattr("jose.jwt.decode", lambda token, key, algorithms: {"sub": "nonexistent@example.com"})
        crud.get_user_by_email = MagicMock(return_value=None)
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token="valid_token", db=mock_db)
        assert exc_info.value.status_code == 401

# Test add_item_to_cart
@pytest.mark.asyncio
def test_add_item_to_cart_new_item(mock_db, mock_user, mock_product):
    crud.get_product = MagicMock(return_value=mock_product)
    mock_db.query.return_value.filter.return_value.first.return_value = None
    mock_db.add = MagicMock()
    mock_db.commit = MagicMock()
    mock_db.refresh = MagicMock()

    item_create = schemas.CartItemCreate(product_id=mock_product.id, quantity=1)
    result = await add_item_to_cart(item=item_create, user=mock_user, db=mock_db)

    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once()
    assert result.product_id == mock_product.id
    assert result.quantity == 1

@pytest.mark.asyncio
def test_add_item_to_cart_existing_item(mock_db, mock_user, mock_product, mock_cart_item):
    crud.get_product = MagicMock(return_value=mock_product)
    mock_db.query.return_value.filter.return_value.first.return_value = mock_cart_item
    mock_db.add = MagicMock()
    mock_db.commit = MagicMock()
    mock_db.refresh = MagicMock()

    item_create = schemas.CartItemCreate(product_id=mock_product.id, quantity=2)
    result = await add_item_to_cart(item=item_create, user=mock_user, db=mock_db)

    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once()
    assert result.product_id == mock_product.id
    assert result.quantity == 3  # 1 (initial) + 2 (new)

@pytest.mark.asyncio
def test_add_item_to_cart_product_not_found(mock_db, mock_user):
    crud.get_product = MagicMock(return_value=None)
    item_create = schemas.CartItemCreate(product_id=999, quantity=1)
    with pytest.raises(HTTPException) as exc_info:
        await add_item_to_cart(item=item_create, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 404

@pytest.mark.asyncio
def test_add_item_to_cart_invalid_quantity(mock_db, mock_user, mock_product):
    crud.get_product = MagicMock(return_value=mock_product)
    item_create = schemas.CartItemCreate(product_id=mock_product.id, quantity=0)
    with pytest.raises(HTTPException) as exc_info:
        await add_item_to_cart(item=item_create, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 400

@pytest.mark.asyncio
def test_add_item_to_cart_not_enough_stock(mock_db, mock_user, mock_product):
    crud.get_product = MagicMock(return_value=mock_product)
    item_create = schemas.CartItemCreate(product_id=mock_product.id, quantity=100)
    with pytest.raises(HTTPException) as exc_info:
        await add_item_to_cart(item=item_create, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 400

# Test read_cart
@pytest.mark.asyncio
def test_read_cart_success(mock_db, mock_user, mock_cart_item):
    mock_db.query.return_value.filter.return_value.all.return_value = [mock_cart_item]
    result = await read_cart(user=mock_user, db=mock_db)
    assert len(result) == 1
    assert result[0].id == mock_cart_item.id

@pytest.mark.asyncio
def test_read_cart_empty(mock_db, mock_user):
    mock_db.query.return_value.filter.return_value.all.return_value = []
    result = await read_cart(user=mock_user, db=mock_db)
    assert len(result) == 0

# Test update_cart_item
@pytest.mark.asyncio
def test_update_cart_item_success(mock_db, mock_user, mock_product, mock_cart_item):
    mock_db.query.return_value.filter.return_value.first.return_value = mock_cart_item
    crud.get_product = MagicMock(return_value=mock_product)
    mock_db.add = MagicMock()
    mock_db.commit = MagicMock()
    mock_db.refresh = MagicMock()

    item_update = schemas.CartItemCreate(product_id=mock_product.id, quantity=5)
    result = await update_cart_item(item_id=mock_cart_item.id, item=item_update, user=mock_user, db=mock_db)

    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once()
    assert result.quantity == 5

@pytest.mark.asyncio
def test_update_cart_item_not_found(mock_db, mock_user, mock_product):
    mock_db.query.return_value.filter.return_value.first.return_value = None
    item_update = schemas.CartItemCreate(product_id=mock_product.id, quantity=5)
    with pytest.raises(HTTPException) as exc_info:
        await update_cart_item(item_id=999, item=item_update, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 404

@pytest.mark.asyncio
def test_update_cart_item_invalid_quantity(mock_db, mock_user, mock_product, mock_cart_item):
    mock_db.query.return_value.filter.return_value.first.return_value = mock_cart_item
    crud.get_product = MagicMock(return_value=mock_product)
    item_update = schemas.CartItemCreate(product_id=mock_product.id, quantity=0)
    with pytest.raises(HTTPException) as exc_info:
        await update_cart_item(item_id=mock_cart_item.id, item=item_update, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 400

@pytest.mark.asyncio
def test_update_cart_item_not_enough_stock(mock_db, mock_user, mock_product, mock_cart_item):
    mock_db.query.return_value.filter.return_value.first.return_value = mock_cart_item
    crud.get_product = MagicMock(return_value=mock_product)
    item_update = schemas.CartItemCreate(product_id=mock_product.id, quantity=100)
    with pytest.raises(HTTPException) as exc_info:
        await update_cart_item(item_id=mock_cart_item.id, item=item_update, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 400

# Test delete_cart_item
@pytest.mark.asyncio
def test_delete_cart_item_success(mock_db, mock_user, mock_cart_item):
    mock_db.query.return_value.filter.return_value.first.return_value = mock_cart_item
    mock_db.delete = MagicMock()
    mock_db.commit = MagicMock()

    result = await delete_cart_item(item_id=mock_cart_item.id, user=mock_user, db=mock_db)

    mock_db.delete.assert_called_once_with(mock_cart_item)
    mock_db.commit.assert_called_once()
    assert result == {"message": "Cart item deleted successfully"}

@pytest.mark.asyncio
def test_delete_cart_item_not_found(mock_db, mock_user):
    mock_db.query.return_value.filter.return_value.first.return_value = None
    with pytest.raises(HTTPException) as exc_info:
        await delete_cart_item(item_id=999, user=mock_user, db=mock_db)
    assert exc_info.value.status_code == 404
