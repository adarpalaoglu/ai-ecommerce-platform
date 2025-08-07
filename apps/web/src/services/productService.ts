import { Product } from '../types';

const API_BASE_URL = 'http://localhost:8000'; // Assuming your backend runs on this URL

export const getAllProducts = async (): Promise<Product[]> => {
  // Mock data for demonstration purposes
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Mock Product 1',
      description: 'This is a description for mock product 1.',
      price: 10.99,
      imageUrl: 'https://via.placeholder.com/150',
      category: 'Electronics',
      stock: 100,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Mock Product 2',
      description: 'This is a description for mock product 2.',
      price: 20.50,
      imageUrl: 'https://via.placeholder.com/150',
      category: 'Books',
      stock: 50,
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
    {
      id: '3',
      name: 'Mock Product 3',
      description: 'This is a description for mock product 3.',
      price: 5.00,
      imageUrl: 'https://via.placeholder.com/150',
      category: 'Food',
      stock: 200,
      createdAt: '2023-01-03T00:00:00Z',
      updatedAt: '2023-01-03T00:00:00Z',
    },
  ];

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockProducts;
};

export const getProductById = async (id: string): Promise<Product> => {
  // Mock data for demonstration purposes
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Mock Product 1',
      description: 'This is a description for mock product 1.',
      price: 10.99,
      imageUrl: 'https://via.placeholder.com/150',
      category: 'Electronics',
      stock: 100,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Mock Product 2',
      description: 'This is a description for mock product 2.',
      price: 20.50,
      imageUrl: 'https://via.placeholder.com/150',
      category: 'Books',
      stock: 50,
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
    {
      id: '3',
      name: 'Mock Product 3',
      description: 'This is a description for mock product 3.',
      price: 5.00,
      imageUrl: 'https://via.placeholder.com/150',
      category: 'Food',
      stock: 200,
      createdAt: '2023-01-03T00:00:00Z',
      updatedAt: '2023-01-03T00:00:00Z',
    },
  ];

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const product = mockProducts.find(p => p.id === id);
  if (product) {
    return product;
  } else {
    throw new Error(`Product with ID ${id} not found.`);
  }
};