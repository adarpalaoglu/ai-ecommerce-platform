# Frontend Architecture

### Component Architecture

#### Component Organization
```text
src/
├── components/         # Reusable UI components (e.g., Button, Card, Modal)
│   ├── common/
│   ├── layout/
│   └── specific/
├── pages/              # Page-level components (e.g., HomePage, ProductDetailPage)
├── hooks/              # Custom React hooks for reusable logic
├── services/           # API client services for backend communication
├── store/              # Zustand stores for global state management
├── styles/             # Global styles, themes, Tailwind CSS configuration
├── utils/              # Frontend utility functions
└── App.tsx             # Main application component
```

#### Component Template
```typescript
import React from 'react';

interface MyComponentProps {
  // Define props here
  title: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>This is a generic component.</p>
    </div>
  );
};

export default MyComponent;
```

### State Management Architecture

#### State Structure
```typescript
interface AppState {
  user: User | null;
  cart: CartState;
  products: Product[];
  // ... other global states
}

interface CartState {
  items: { productId: string; quantity: number; }[];
  total: number;
}
```

#### State Management Patterns
- **Zustand Stores:** For global application state, each domain (e.g., user, cart, products) will have its own store.
- **Local Component State:** For UI-specific state that doesn't need to be shared globally.
- **Derived State:** Using selectors to compute derived state from existing stores to avoid redundancy.

### Routing Architecture

#### Route Organization
```text
src/
├── router/
│   ├── index.tsx       # Main router configuration
│   ├── routes.tsx      # Defines all application routes
│   └── ProtectedRoute.tsx # Component for protected routes
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── products/
│   │   ├── ProductListPage.tsx
│   │   └── ProductDetailPage.tsx
│   ├── cart/
│   │   └── CartPage.tsx
│   ├── checkout/
│   │   └── CheckoutPage.tsx
│   └── user/
│       └── ProfilePage.tsx
```

#### Protected Route Pattern
```typescript
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // Assuming Zustand auth store

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
```

### Frontend Services Layer

#### API Client Setup
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Or from a state management store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
```

#### Service Example
```typescript
import apiClient from './apiClient';
import { Product } from '../types'; // Assuming shared types

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // ... other product-related API calls
};
```