import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ConfirmationPage: React.FC = () => {
  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Thank you for your order!
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Your payment has been confirmed and your order is being processed.
      </Typography>
      <Button component={Link} to="/" variant="contained" color="primary">
        Continue Shopping
      </Button>
    </Box>
  );
};

export default ConfirmationPage;
