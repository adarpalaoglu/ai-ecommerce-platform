import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductList from '../../src/components/specific/product-management/ProductList';
import * as productService from '../../src/services/productService';
import { Product } from '../../../../packages/shared/src/types';

// Mock the productService
jest.mock('../../src/services/productService');

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Test Product 1',
    description: 'Description 1',
    price: 10.00,
    imageUrl: 'http://example.com/image1.jpg',
    category: 'Category A',
    stock: 10,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'Description 2',
    price: 20.00,
    imageUrl: 'http://example.com/image2.jpg',
    category: 'Category B',
    stock: 20,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

describe('ProductList', () => {
  const mockOnEditProduct = jest.fn();
  const mockOnProductChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (productService.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);
  });

  test('displays loading spinner initially', () => {
    (productService.getAllProducts as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Never resolve
    render(<ProductList onEditProduct={mockOnEditProduct} onProductChange={mockOnProductChange} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays error message if fetching products fails', async () => {
    (productService.getAllProducts as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    render(<ProductList onEditProduct={mockOnEditProduct} onProductChange={mockOnProductChange} />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch products./i)).toBeInTheDocument();
    });
  });

  test('displays product data in the table', async () => {
    render(<ProductList onEditProduct={mockOnEditProduct} onProductChange={mockOnProductChange} />);
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('$10.00')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('Category A')).toBeInTheDocument();

      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
      expect(screen.getByText('$20.00')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('Category B')).toBeInTheDocument();
    });
  });

  test('calls onEditProduct with correct ID when Edit button is clicked', async () => {
    render(<ProductList onEditProduct={mockOnEditProduct} onProductChange={mockOnProductChange} />);
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    const editButton = screen.getAllByRole('button', { name: /Edit/i })[0];
    userEvent.click(editButton);

    expect(mockOnEditProduct).toHaveBeenCalledTimes(1);
    expect(mockOnEditProduct).toHaveBeenCalledWith('1');
  });
});
