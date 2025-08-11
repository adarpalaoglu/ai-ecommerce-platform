import React from 'react';
import { Badge, IconButton } from '@mui/material'; // Removed Button import
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';

const CartIcon: React.FC = () => {
  const { items } = useCartStore();
  const navigate = useNavigate();
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const handleCartClick = () => {
    navigate('/cart');
  };

  // Removed handleHistoryClick function

  return (
    <IconButton color="inherit" onClick={handleCartClick}>
      <Badge badgeContent={itemCount} color="secondary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default CartIcon;