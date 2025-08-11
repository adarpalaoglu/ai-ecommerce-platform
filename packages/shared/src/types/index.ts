export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: { name: string; id: number; };
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface ProductUpdate extends ProductCreate {
  id: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product; // Assuming the product details are embedded
}

export interface Order {
  id: string;
  userId: string;
  orderDate: string;
  totalAmount: number;
  status: string; // e.g., "Pending", "Shipped", "Delivered", "Cancelled"
  shippingAddressId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  role?: 'customer' | 'manager' | 'admin'; // Added role for authorization
}