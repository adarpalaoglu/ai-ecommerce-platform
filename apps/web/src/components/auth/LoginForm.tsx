import React, { useState } from 'react';
import { TextField, Button, Box, Link as MuiLink, CircularProgress, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setLogin = useAuthStore((state: any) => state.setLogin);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      setLogin(data.user, data.access_token);
      navigate('/'); // Redirect to home or dashboard after successful login
    } catch (err: any) {
      let errorMessage: string = 'Unknown error occurred.';
      console.error("Login error:", err);

      if (err.response) {
        if (err.response.data) {
          if (typeof err.response.data === 'object') {
            if (err.response.data.detail) {
              errorMessage = err.response.data.detail;
            } else if (err.response.data.msg && err.response.data.loc) {
              errorMessage = `Validation Error: ${err.response.data.loc.join('.')} - ${err.response.data.msg}`;
            } else {
              try {
                errorMessage = JSON.stringify(err.response.data);
              } catch (e) {
                errorMessage = 'Failed to parse error response.';
              }
            }
          } else if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          }
        } else if (err.response.statusText) {
          errorMessage = err.response.statusText;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : 'Unexpected error'}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>
      <MuiLink component={Link} to="#" variant="body2">
        Forgot password?
      </MuiLink>
    </Box>
  );
};

export default LoginForm;
