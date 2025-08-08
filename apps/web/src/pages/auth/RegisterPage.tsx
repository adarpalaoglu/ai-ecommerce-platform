import React from 'react';
import { Container, Box, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
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
          Register
        </Typography>
        <RegisterForm />
        <MuiLink component={Link} to="/login" variant="body2" sx={{ mt: 2 }}>
          Already have an account? Sign In
        </MuiLink>
      </Box>
    </Container>
  );
};

export default RegisterPage;
