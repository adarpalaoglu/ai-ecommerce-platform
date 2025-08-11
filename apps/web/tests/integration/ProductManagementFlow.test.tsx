import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import ManageProductsPage from '../../src/pages/products/ManageProductsPage';
import * as productService from '../../src/services/productService';
import { Product } from '../../../../packages/shared/src/types';

// Mock the productService
jest.mock('../../src/services/productService');

// Mock the authStore to control authentication state
jest.mock('../../src/store/authStore', () => ({
  useAuthStore: () => ({
    isAuthenticated: true, // Assume authenticated for testing this page
    setLogout: jest.fn(),
  }),
}));

describe('Product Management Flow Integration', () => {
  const initialProducts: Product[] = [
    {
      id: 'prod1',
      name: 'Initial Product 1',
      description: 'Desc 1',
      price: 10,
      imageUrl: 'url1',
      category: 'Electronics',
      stock: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (productService.getAllProducts as jest.Mock).mockResolvedValue(initialProducts);
    (productService.addProduct as jest.Mock).mockImplementation(async (product) => {
      const newProduct = { ...product, id: 'new-prod', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      initialProducts.push(newProduct);
      return newProduct;
    });
    (productService.updateProduct as jest.Mock).mockImplementation(async (updatedProduct) => {
      const index = initialProducts.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        initialProducts[index] = { ...initialProducts[index], ...updatedProduct, updatedAt: new Date().toISOString() };
      }
      return initialProducts[index];
    });
    (productService.getProductById as jest.Mock).mockImplementation(async (id) => {
      return initialProducts.find(p => p.id === id);
    });
  });

  test('should allow adding a new product and display it in the list', async () => {
    render(
      <Router>
        <ManageProductsPage />
      </Router>
    );

    // Verify initial product is displayed
    await waitFor(() => {
      expect(screen.getByText('Initial Product 1')).toBeInTheDocument();
    });

    // Open Add Product form
    fireEvent.click(screen.getByRole('button', { name: /Add New Product/i }));
    await waitFor(() => {
      expect(screen.getByText(/Add New Product/i)).toBeInTheDocument();
    });

    // Fill and submit the form
    userEvent.type(screen.getByLabelText(/Product Name/i), 'New Test Product');
    userEvent.type(screen.getByLabelText(/Description/i), 'New Test Description');
    userEvent.type(screen.getByLabelText(/Price/i), '25.50');
    userEvent.type(screen.getByLabelText(/Image URL/i), 'http://new.image.com/new.jpg');
    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    fireEvent.click(screen.getByText('Books'));
    userEvent.type(screen.getByLabelText(/Stock/i), '30');

    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }));

    // Verify success message and form closure
    await waitFor(() => {
      expect(screen.getByText(/Product added successfully!/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText(/close/i)); // Close the dialog

    // Verify new product appears in the list
    await waitFor(() => {
      expect(screen.getByText('New Test Product')).toBeInTheDocument();
      expect(screen.getByText('$25.50')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });
  });

  test('should allow editing an existing product and display updates in the list', async () => {
    render(
      <Router>
        <ManageProductsPage />
      </Router>
    );

    // Verify initial product is displayed
    await waitFor(() => {
      expect(screen.getByText('Initial Product 1')).toBeInTheDocument();
    });

    // Open Edit Product form
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    await waitFor(() => {
      expect(screen.getByText(/Edit Product/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Product Name/i)).toHaveValue('Initial Product 1');
    });

    // Edit form fields
    userEvent.clear(screen.getByLabelText(/Product Name/i));
    userEvent.type(screen.getByLabelText(/Product Name/i), 'Updated Product Name');
    userEvent.clear(screen.getByLabelText(/Price/i));
    userEvent.type(screen.getByLabelText(/Price/i), '15.75');

    fireEvent.click(screen.getByRole('button', { name: /Update Product/i }));

    // Verify success message and form closure
    await waitFor(() => {
      expect(screen.getByText(/Product updated successfully!/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText(/close/i)); // Close the dialog

    // Verify updated product appears in the list
    await waitFor(() => {
      expect(screen.getByText('Updated Product Name')).toBeInTheDocument();
      expect(screen.getByText('$15.75')).toBeInTheDocument();
    });
  });
});
