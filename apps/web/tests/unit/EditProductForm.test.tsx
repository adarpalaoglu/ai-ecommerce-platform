import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProductForm from '../../src/components/specific/product-management/EditProductForm';
import * as productService from '../../src/services/productService';
import { Product } from '../../../../packages/shared/src/types';

// Mock the productService
jest.mock('../../src/services/productService');

const mockProduct: Product = {
  id: '123',
  name: 'Existing Product',
  description: 'Existing Description',
  price: 99.99,
  imageUrl: 'http://example.com/existing.jpg',
  category: 'Electronics',
  stock: 100,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('EditProductForm', () => {
  const mockOnProductUpdated = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (productService.getProductById as jest.Mock).mockResolvedValue(mockProduct);
    (productService.updateProduct as jest.Mock).mockResolvedValue({
      ...mockProduct,
      name: 'Updated Product',
    });
  });

  test('displays loading spinner initially', () => {
    (productService.getProductById as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Never resolve
    render(
      <EditProductForm
        productId="123"
        onProductUpdated={mockOnProductUpdated}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays error message if fetching product fails', async () => {
    (productService.getProductById as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'));
    render(
      <EditProductForm
        productId="123"
        onProductUpdated={mockOnProductUpdated}
        onCancel={mockOnCancel}
      />
    );
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch product details./i)).toBeInTheDocument();
    });
  });

  test('pre-populates form fields with existing product data', async () => {
    render(
      <EditProductForm
        productId="123"
        onProductUpdated={mockOnProductUpdated}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Product Name/i)).toHaveValue('Existing Product');
      expect(screen.getByLabelText(/Description/i)).toHaveValue('Existing Description');
      expect(screen.getByLabelText(/Price/i)).toHaveValue(99.99);
      expect(screen.getByLabelText(/Image URL/i)).toHaveValue('http://example.com/existing.jpg');
      expect(screen.getByLabelText(/Category/i)).toHaveValue('Electronics');
      expect(screen.getByLabelText(/Stock/i)).toHaveValue(100);
    });
  });

  test('calls updateProduct with correct data on submission', async () => {
    render(
      <EditProductForm
        productId="123"
        onProductUpdated={mockOnProductUpdated}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Product Name/i)).toHaveValue('Existing Product');
    });

    userEvent.clear(screen.getByLabelText(/Product Name/i));
    userEvent.type(screen.getByLabelText(/Product Name/i), 'Updated Product Name');
    userEvent.clear(screen.getByLabelText(/Price/i));
    userEvent.type(screen.getByLabelText(/Price/i), '150.00');

    fireEvent.click(screen.getByRole('button', { name: /Update Product/i }));

    await waitFor(() => {
      expect(productService.updateProduct).toHaveBeenCalledTimes(1);
      expect(productService.updateProduct).toHaveBeenCalledWith({
        ...mockProduct,
        name: 'Updated Product Name',
        price: 150,
      });
    });
  });

  test('displays success message on successful submission', async () => {
    render(
      <EditProductForm
        productId="123"
        onProductUpdated={mockOnProductUpdated}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Product Name/i)).toHaveValue('Existing Product');
    });

    fireEvent.click(screen.getByRole('button', { name: /Update Product/i }));

    await waitFor(() => {
      expect(screen.getByText(/Product updated successfully!/i)).toBeInTheDocument();
    });
    expect(mockOnProductUpdated).toHaveBeenCalledTimes(1);
  });

  test('displays error message on failed submission', async () => {
    (productService.updateProduct as jest.Mock).mockRejectedValueOnce(new Error('Update error'));
    render(
      <EditProductForm
        productId="123"
        onProductUpdated={mockOnProductUpdated}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Product Name/i)).toHaveValue('Existing Product');
    });

    fireEvent.click(screen.getByRole('button', { name: /Update Product/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to update product./i)).toBeInTheDocument();
    });
    expect(mockOnProductUpdated).not.toHaveBeenCalled();
  });

  test('calls onCancel when Cancel button is clicked', async () => {
    render(
      <EditProductForm
        productId="123"
        onProductUpdated={mockOnProductUpdated}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Product Name/i)).toHaveValue('Existing Product');
    });

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
