import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { ProductUpdate } from 'shared';
import { getProductById, updateProduct } from '../../../services/productService';

interface EditProductFormProps {
  productId: string;
  onProductUpdated: () => void;
  onCancel: () => void;
}

const categories = [
  'Electronics',
  'Books',
  'Home Goods',
  'Clothing',
];

const EditProductForm: React.FC<EditProductFormProps> = ({
  productId,
  onProductUpdated,
  onCancel,
}) => {
  const [product, setProduct] = useState<ProductUpdate>({
    id: productId,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    stock: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct({
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrl: data.imageUrl || '', // Ensure imageUrl is always a string
          category: data.category.name, // Convert object to string
          stock: data.stock,
        });
      } catch (err) {
        setError("Failed to fetch product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct: ProductUpdate) => ({
      ...prevProduct,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateProduct(product);
      setSuccess("Product updated successfully!");
      onProductUpdated(); // Notify parent component to refresh product list
    } catch (err) {
      setError("Failed to update product.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Typography>Product not found.</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Edit Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Product Name"
          name="name"
          value={product.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={3}
          required
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          inputProps={{ step: "0.01" }}
        />
        <TextField
          label="Image URL"
          name="imageUrl"
          value={product.imageUrl}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Category"
          name="category"
          value={product?.category || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={product.stock}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Product'}
          </Button>
          <Button type="button" variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}
      </form>
    </Paper>
  );
};

export default EditProductForm;
