import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import CartIcon from './components/common/CartIcon';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated, setLogout } = useAuthStore();

  const handleLogout = () => {
    setLogout();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#3f51b5', zIndex: 1500 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            E-Commerce App
          </Typography>
          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>
          {!isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/manage-products">
                Manage Products
              </Button>
              <Button color="inherit" component={Link} to="/manage-users">
                Manage Users
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
          <Box sx={{ border: '2px solid red', backgroundColor: '#3f51b5' }}>
            <CartIcon />
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;