import { getAllProducts, getProductById } from './productService';

// Mock the global fetch function
global.fetch = jest.fn();

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('fetches products successfully', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', description: 'Desc 1', price: 10, imageUrl: 'url1', category: 'cat1', stock: 10, createdAt: 'now', updatedAt: 'now' },
        { id: '2', name: 'Product 2', description: 'Desc 2', price: 20, imageUrl: 'url2', category: 'cat2', stock: 20, createdAt: 'now', updatedAt: 'now' },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      });

      const products = await getAllProducts();
      expect(products).toEqual(mockProducts);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/products');
    });

    it('returns empty array on fetch failure', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const products = await getAllProducts();
      expect(products).toEqual([]);
    });

    it('handles network errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const products = await getAllProducts();
      expect(products).toEqual([]);
    });
  });

  describe('getProductById', () => {
    it('fetches a product by ID successfully', async () => {
      const mockProduct = { id: '1', name: 'Product 1', description: 'Desc 1', price: 10, imageUrl: 'url1', category: 'cat1', stock: 10, createdAt: 'now', updatedAt: 'now' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      });

      const product = await getProductById('1');
      expect(product).toEqual(mockProduct);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/products/1');
    });

    it('throws an error on fetch failure', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getProductById('1')).rejects.toThrow('HTTP error! status: 404');
    });

    it('handles network errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(getProductById('1')).rejects.toThrow('Network error');
    });
  });
});