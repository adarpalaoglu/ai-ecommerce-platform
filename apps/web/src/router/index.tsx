import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import theme from '../theme';
import { ProductListPage } from '../pages/products/ProductListPage';
import ProductDetailPage from '../pages/products/ProductDetailPage';

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
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;