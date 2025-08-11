import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';
import { MemoryRouter } from 'react-router-dom';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'This is a test product',
  price: 10.99,
  imageUrl: 'http://example.com/image.jpg',
  category: { name: 'Electronics', id: 1 },
  stock: 100,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a test product/i)).toBeInTheDocument();
    expect(screen.getByText(/\$10.99/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Test Product/i })).toHaveAttribute(
      'src', 'http://example.com/image.jpg'
    );
  });
});
