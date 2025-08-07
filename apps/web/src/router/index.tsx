
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import App from '../App';
import theme from '../theme';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
]);

const AppRouter: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default AppRouter;
