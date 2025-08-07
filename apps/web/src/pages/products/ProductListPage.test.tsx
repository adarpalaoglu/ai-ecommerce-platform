import { render, screen, waitFor } from '@testing-library/react';
import { ProductListPage } from './ProductListPage';
import * as productService from '../../services/productService';
import { MemoryRouter } from 'react-router-dom';

// Mock the productService
jest.mock('../../services/productService', () => ({
  getAllProducts: jest.fn(),
}));

const mockProducts = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    price: 10.00,
    imageUrl: 'image1.jpg',
    category: 'Category A',
    stock: 10,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Product 2',
    description: 'Description 2',
    price: 20.00,
    imageUrl: 'image2.jpg',
    category: 'Category B',
    stock: 20,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

describe('ProductListPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('displays loading spinner initially', () => {
    (productService.getAllProducts as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Never resolve
    render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays products after successful fetch', async () => {
    (productService.getAllProducts as jest.Mock).mockResolvedValueOnce(mockProducts);
    render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    (productService.getAllProducts as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load products.')).toBeInTheDocument();
    });
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});