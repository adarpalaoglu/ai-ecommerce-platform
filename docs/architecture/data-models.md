# Data Models

### User
**Purpose:** Represents a user of the e-commerce platform.

**Key Attributes:**
- `id`: `string` - Unique identifier for the user.
- `email`: `string` - User's email address (unique).
- `passwordHash`: `string` - Hashed password for security.
- `firstName`: `string` - User's first name.
- `lastName`: `string` - User's last name.
- `createdAt`: `string` - Timestamp of user creation.
- `updatedAt`: `string` - Timestamp of last user update.

#### TypeScript Interface
```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Relationships
- One-to-many with `Order` (a user can have many orders)
- One-to-many with `Address` (a user can have many addresses)

### Product
**Purpose:** Represents a product available for sale on the e-commerce platform.

**Key Attributes:**
- `id`: `string` - Unique identifier for the product.
- `name`: `string` - Name of the product.
- `description`: `string` - Detailed description of the product.
- `price`: `number` - Price of the product.
- `imageUrl`: `string` - URL of the product image.
- `category`: `string` - Category of the product.
- `stock`: `number` - Current stock quantity.
- `createdAt`: `string` - Timestamp of product creation.
- `updatedAt`: `string` - Timestamp of last product update.

#### TypeScript Interface
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  updatedAt: string;
}
```

#### Relationships
- Many-to-many with `Order` (through `OrderItem`)

### Order
**Purpose:** Represents a customer order.

**Key Attributes:**
- `id`: `string` - Unique identifier for the order.
- `userId`: `string` - ID of the user who placed the order.
- `orderDate`: `string` - Date and time the order was placed.
- `totalAmount`: `number` - Total amount of the order.
- `status`: `string` - Current status of the order (e.g., "pending", "shipped", "delivered").
- `shippingAddressId`: `string` - ID of the shipping address.
- `createdAt`: `string` - Timestamp of order creation.
- `updatedAt`: `string` - Timestamp of last order update.

#### TypeScript Interface
```typescript
interface Order {
  id: string;
  userId: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddressId: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Relationships
- Many-to-one with `User` (an order belongs to one user)
- One-to-many with `OrderItem` (an order can have many items)
- Many-to-one with `Address` (an order has one shipping address)

### OrderItem
**Purpose:** Represents a single item within an order.

**Key Attributes:**
- `id`: `string` - Unique identifier for the order item.
- `orderId`: `string` - ID of the order this item belongs to.
- `productId`: `string` - ID of the product in this order item.
- `quantity`: `number` - Quantity of the product.
- `price`: `number` - Price of the product at the time of order.

#### TypeScript Interface
```typescript
interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}
```

#### Relationships
- Many-to-one with `Order` (an order item belongs to one order)
- Many-to-one with `Product` (an order item refers to one product)

### Address
**Purpose:** Represents a user's address.

**Key Attributes:**
- `id`: `string` - Unique identifier for the address.
- `userId`: `string` - ID of the user this address belongs to.
- `street`: `string` - Street name and number.
- `city`: `string` - City.
- `state`: `string` - State/Province.
- `zipCode`: `string` - Zip/Postal code.
- `country`: `string` - Country.
- `isDefault`: `boolean` - Whether this is the user's default address.

#### TypeScript Interface
```typescript
interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}
```

#### Relationships
- Many-to-one with `User` (an address belongs to one user)
- One-to-many with `Order` (an address can be a shipping address for many orders)