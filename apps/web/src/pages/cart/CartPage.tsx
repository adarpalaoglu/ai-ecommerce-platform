import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, Button, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartItem } from 'shared';
import { CartService } from '../../services/CartService';
import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { items, setCart, removeItem, updateItemQuantity, clearCart } = useCartStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await CartService.getCart();
        setCart(data);
      } catch (err) {
        setError("Failed to load cart details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [setCart]);

  const handleUpdateQuantity = async (itemId: string, productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await CartService.updateItemQuantity(itemId, productId, newQuantity);
      updateItemQuantity(itemId, newQuantity);
    } catch (err) {
      console.error('Failed to update item quantity:', err);
      alert('Failed to update item quantity.');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await CartService.removeItem(itemId);
      removeItem(itemId);
    } catch (err) {
      console.error('Failed to remove item:', err);
      alert('Failed to remove item.');
    }
  };

  const handleCheckout = async () => {
    try {
      await CartService.createOrder();
      clearCart();
      navigate('/confirmation');
    } catch (err) {
      console.error('Failed to create order:', err);
      alert('Failed to create order.');
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

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

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Shopping Cart
      </Typography>
      {items.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          {items.map((item) => (
            <Card key={item.id} sx={{ display: 'flex', marginBottom: 2, alignItems: 'center' }}>
              <CardContent sx={{ flex: '1 0 auto', display: 'flex', alignItems: 'center' }}>
                <img src={item.product.imageUrl} alt={item.product.name} style={{ width: 80, height: 80, marginRight: 16, objectFit: 'contain' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{item.product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">${item.product.price.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => handleUpdateQuantity(item.id, parseInt(item.product.id), item.quantity - 1)}>
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    value={item.quantity}
                    onChange={(e) => handleUpdateQuantity(item.id, parseInt(item.product.id), parseInt(e.target.value))}
                    type="number"
                    inputProps={{ min: 1 }}
                    sx={{ width: 60, mx: 1, textAlign: 'center' }}
                    size="small"
                  />
                  <IconButton onClick={() => handleUpdateQuantity(item.id, parseInt(item.product.id), item.quantity + 1)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={() => handleRemoveItem(item.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
            <Typography variant="h5">
              Subtotal: ${calculateSubtotal().toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CartPage;
