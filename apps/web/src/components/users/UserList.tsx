
import React from 'react';
import { User } from 'shared';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';
import { useAuthStore } from '../../store/authStore';
import { updateUserRole } from '../../services/userService';

interface UserListProps {
  users: User[];
  onRoleChange: () => void;
  onRoleChangeError: (message: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onRoleChange, onRoleChangeError }) => {
  const { user } = useAuthStore();

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateUserRole(userId, role);
      onRoleChange();
    } catch (error: any) {
      console.error('Failed to update user role', error);
      onRoleChangeError(error.message);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Role</TableCell>
            {user?.role === 'admin' && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((userItem) => (
            <TableRow key={userItem.id}>
              <TableCell>{userItem.id}</TableCell>
              <TableCell>{userItem.email}</TableCell>
              <TableCell>{userItem.firstName}</TableCell>
              <TableCell>{userItem.lastName}</TableCell>
              <TableCell>{userItem.role}</TableCell>
              {user?.role === 'admin' && (
                <TableCell>
                  <Select
                    value={userItem.role}
                    onChange={(e) => handleRoleChange(userItem.id, e.target.value as string)}
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;
