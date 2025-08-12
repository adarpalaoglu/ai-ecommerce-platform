
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getAllUsers } from '../../services/userService';
import UserList from '../../components/users/UserList';
import { User } from 'shared';
import { Snackbar, Alert } from '@mui/material';

const ManageUsersPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      setSnackbarMessage('Failed to fetch users.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, fetchUsers]);

  const handleRoleChangeSuccess = () => {
    setSnackbarMessage('User role updated successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    fetchUsers(); // Re-fetch users to show updated roles
  };

  const handleRoleChangeError = (message: string) => {
    setSnackbarMessage(`Error: ${message}`);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <h1>Manage Users</h1>
      <UserList users={users} onRoleChange={handleRoleChangeSuccess} onRoleChangeError={handleRoleChangeError} />
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ManageUsersPage;
