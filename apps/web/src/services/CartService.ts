import axios from 'axios';
import { CartItem, Product } from 'shared';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization header (assuming JWT is stored in localStorage)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or wherever your token is stored
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const CartService = {
  async addItem(productId: number, quantity: number): Promise<CartItem> {
    const response = await apiClient.post('/api/cart/items', { product_id: productId, quantity });
    return response.data;
  },

  async getCart(): Promise<CartItem[]> {
    const response = await apiClient.get('/api/cart');
    return response.data;
  },

  async updateItemQuantity(itemId: string, quantity: number): Promise<CartItem> {
    const response = await apiClient.put(`/api/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  async removeItem(itemId: string): Promise<void> {
    await apiClient.delete(`/api/cart/items/${itemId}`);
  },
};
