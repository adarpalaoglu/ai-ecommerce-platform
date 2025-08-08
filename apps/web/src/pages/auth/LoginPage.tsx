import React from 'react';
import { Container, Box, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <LoginForm />
        <MuiLink component={Link} to="/register" variant="body2" sx={{ mt: 2 }}>
          Don't have an account? Sign Up
        </MuiLink>
      </Box>
    </Container>
  );
};

export default LoginPage;
