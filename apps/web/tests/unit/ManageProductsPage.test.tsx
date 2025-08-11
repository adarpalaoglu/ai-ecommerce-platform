import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ManageProductsPage from '../../src/pages/products/ManageProductsPage';
import * as productService from '../../src/services/productService';
import * as authStore from '../../src/store/authStore';

// Mock the ProductList component to avoid its internal dependencies
jest.mock('../../src/components/specific/product-management/ProductList', () => {
  const MockProductList = ({ onEditProduct }: any) => (
    <div data-testid="product-list">
      Product List Component
      <button onClick={() => onEditProduct('123')}>Edit Product 123</button>
    </div>
  );
  return MockProductList;
});

// Mock the AddProductForm component
jest.mock('../../src/components/specific/product-management/AddProductForm', () => {
  const MockAddProductForm = ({ onProductAdded }: any) => (
    <div data-testid="add-product-form">
      Add Product Form Component
      <button onClick={onProductAdded}>Simulate Add</button>
    </div>
  );
  return MockAddProductForm;
});

// Mock the EditProductForm component
jest.mock('../../src/components/specific/product-management/EditProductForm', () => {
  const MockEditProductForm = ({ productId, onProductUpdated, onCancel }: any) => (
    <div data-testid="edit-product-form">
      Edit Product Form Component for ID: {productId}
      <button onClick={onProductUpdated}>Simulate Update</button>
      <button onClick={onCancel}>Cancel Edit</button>
    </div>
  );
  return MockEditProductForm;
});

// Mock the authStore to control authentication state
jest.mock('../../src/store/authStore', () => ({
  useAuthStore: () => ({
    isAuthenticated: true, // Assume authenticated for testing this page
    setLogout: jest.fn(),
  }),
}));

describe('ManageProductsPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders the Manage Products title', () => {
    render(
      <Router>
        <ManageProductsPage />
      </Router>
    );
    expect(screen.getByText(/Manage Products/i)).toBeInTheDocument();
  });

  test('renders the Add New Product button', () => {
    render(
      <Router>
        <ManageProductsPage />
      </Router>
    );
    expect(screen.getByRole('button', { name: /Add New Product/i })).toBeInTheDocument();
  });

  test('renders the ProductList component', () => {
    render(
      <Router>
        <ManageProductsPage />
      </Router>
    );
    expect(screen.getByTestId('product-list')).toBeInTheDocument();
  });

  test('opens Add New Product dialog when button is clicked', async () => {
    render(
      <Router>
        <ManageProductsPage />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /Add New Product/i }));

    await waitFor(() => {
      expect(screen.getByTestId('add-product-form')).toBeInTheDocument();
    });
  });

  test('opens Edit Product dialog when edit button in ProductList is clicked', async () => {
    render(
      <Router>
        <ManageProductsPage />
      </Router>
    );

    fireEvent.click(screen.getByText(/Edit Product 123/i));

    await waitFor(() => {
      expect(screen.getByTestId('edit-product-form')).toBeInTheDocument();
      expect(screen.getByText(/Edit Product Form Component for ID: 123/i)).toBeInTheDocument();
    });
  });

  test('closes Add New Product dialog when close button is clicked', async () => {
    render(
      <Router>
        <ManageProductsPage />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /Add New Product/i }));
    await waitFor(() => {
      expect(screen.getByTestId('add-product-form')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText(/close/i)); // Close button for dialog

    await waitFor(() => {
      expect(screen.queryByTestId('add-product-form')).not.toBeInTheDocument();
    });
  });

  test('closes Edit Product dialog when cancel button is clicked', async () => {
    render(
      <Router>
        <ManageProductsPage />
      </Router>
    );

    fireEvent.click(screen.getByText(/Edit Product 123/i));
    await waitFor(() => {
      expect(screen.getByTestId('edit-product-form')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Cancel Edit/i }));

    await waitFor(() => {
      expect(screen.queryByTestId('edit-product-form')).not.toBeInTheDocument();
    });
  });
});
