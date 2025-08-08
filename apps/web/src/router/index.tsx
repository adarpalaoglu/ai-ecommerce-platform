import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import theme from '../theme';
import { ProductListPage } from '../pages/products/ProductListPage';
import ProductDetailPage from '../pages/products/ProductDetailPage';
import RegisterPage from '../pages/auth/RegisterPage';
import LoginPage from '../pages/auth/LoginPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <ProductListPage />,
      },
      {
        path: '/products',
        element: <ProductListPage />,
      },
      {
        path: '/products/:id',
        element: <ProductDetailPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;