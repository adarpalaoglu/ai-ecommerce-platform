import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../../types';
import { getProductById } from '../../services/productService'; // We will create this function
import { Box, Typography, CircularProgress, Card, CardContent, CardMedia, Button } from '@mui/material';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Assuming getProductById will be implemented in productService.ts
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Product not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, maxWidth: 800 }}>
        <CardMedia
          component="img"
          sx={{ width: { xs: '100%', md: 300 }, height: { xs: 200, md: 'auto' }, objectFit: 'contain' }}
          image={product.imageUrl}
          alt={product.name}
        />
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {product.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {product.description}
          </Typography>
          <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Category: {product.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            In Stock: {product.stock}
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 3 }}>
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDetailPage;