import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProductList from '../../components/specific/product-management/ProductList';
import AddProductForm from '../../components/specific/product-management/AddProductForm';
import EditProductForm from '../../components/specific/product-management/EditProductForm';

const ManageProductsPage: React.FC = () => {
  // TODO: Implement authentication/authorization check here
  // For now, assuming access is granted for demonstration purposes

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [refreshProducts, setRefreshProducts] = useState(false);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (productId: string) => {
    setSelectedProductId(productId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedProductId(null);
    setOpenEditDialog(false);
  };

  const handleProductChange = useCallback(() => {
    setRefreshProducts((prev) => !prev);
  }, []);

  return (
    <Container maxWidth="lg" className="py-8">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom className="text-gray-800">
          Manage Products
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          This page will allow managers to view, add, and edit products.
        </Typography>

        <Box sx={{ mt: 4, mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
            Add New Product
          </Button>
        </Box>

        <Box className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <Typography variant="h5" component="h2" gutterBottom>
            Product List
          </Typography>
          <ProductList onEditProduct={handleOpenEditDialog} onProductChange={handleProductChange} />
        </Box>
      </Box>

      {/* Add Product Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="md">
        <DialogTitle>
          Add New Product
          <IconButton
            aria-label="close"
            onClick={handleCloseAddDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <AddProductForm onProductAdded={() => { handleCloseAddDialog(); handleProductChange(); }} />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="md">
        <DialogTitle>
          Edit Product
          <IconButton
            aria-label="close"
            onClick={handleCloseEditDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProductId && (
            <EditProductForm
              productId={selectedProductId}
              onProductUpdated={() => { handleCloseEditDialog(); handleProductChange(); }}
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ManageProductsPage;
