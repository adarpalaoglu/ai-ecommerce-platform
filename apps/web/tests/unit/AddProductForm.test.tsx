import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddProductForm from '../../src/components/specific/product-management/AddProductForm';
import * as productService from '../../src/services/productService';

// Mock the productService
jest.mock('../../src/services/productService');

describe('AddProductForm', () => {
  const mockOnProductAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (productService.addProduct as jest.Mock).mockResolvedValue({
      id: 'new-product-id',
      name: 'New Product',
      description: 'New Description',
      price: 100,
      imageUrl: 'http://example.com/new.jpg',
      category: 'Electronics',
      stock: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  test('renders all form fields', () => {
    render(<AddProductForm onProductAdded={mockOnProductAdded} />);

    expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Image URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Stock/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Product/i })).toBeInTheDocument();
  });

  test('calls addProduct with correct data on submission', async () => {
    render(<AddProductForm onProductAdded={mockOnProductAdded} />);

    userEvent.type(screen.getByLabelText(/Product Name/i), 'Test Product');
    userEvent.type(screen.getByLabelText(/Description/i), 'Test Description');
    userEvent.type(screen.getByLabelText(/Price/i), '123.45');
    userEvent.type(screen.getByLabelText(/Image URL/i), 'http://test.com/image.jpg');
    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    fireEvent.click(screen.getByText('Books'));
    userEvent.type(screen.getByLabelText(/Stock/i), '50');

    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }));

    await waitFor(() => {
      expect(productService.addProduct).toHaveBeenCalledTimes(1);
      expect(productService.addProduct).toHaveBeenCalledWith({
        name: 'Test Product',
        description: 'Test Description',
        price: 123.45,
        imageUrl: 'http://test.com/image.jpg',
        category: 'Books',
        stock: 50,
      });
    });
  });

  test('displays success message on successful submission', async () => {
    render(<AddProductForm onProductAdded={mockOnProductAdded} />);

    userEvent.type(screen.getByLabelText(/Product Name/i), 'Test Product');
    userEvent.type(screen.getByLabelText(/Description/i), 'Test Description');
    userEvent.type(screen.getByLabelText(/Price/i), '10');
    userEvent.type(screen.getByLabelText(/Image URL/i), 'http://test.com/image.jpg');
    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    fireEvent.click(screen.getByText('Electronics'));
    userEvent.type(screen.getByLabelText(/Stock/i), '10');

    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }));

    await waitFor(() => {
      expect(screen.getByText(/Product added successfully!/i)).toBeInTheDocument();
    });
    expect(mockOnProductAdded).toHaveBeenCalledTimes(1);
  });

  test('displays error message on failed submission', async () => {
    (productService.addProduct as jest.Mock).mockRejectedValueOnce(new Error('Failed to add'));
    render(<AddProductForm onProductAdded={mockOnProductAdded} />);

    userEvent.type(screen.getByLabelText(/Product Name/i), 'Test Product');
    userEvent.type(screen.getByLabelText(/Description/i), 'Test Description');
    userEvent.type(screen.getByLabelText(/Price/i), '10');
    userEvent.type(screen.getByLabelText(/Image URL/i), 'http://test.com/image.jpg');
    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    fireEvent.click(screen.getByText('Electronics'));
    userEvent.type(screen.getByLabelText(/Stock/i), '10');

    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to add product./i)).toBeInTheDocument();
    });
    expect(mockOnProductAdded).not.toHaveBeenCalled();
  });
});
