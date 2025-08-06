# Epic 3: "Buy Now" & Order Management
**Goal:** This epic implements the core transaction of the application. It introduces the one-click "Buy Now" functionality that converts a shopping cart into a formal order. It also provides the necessary interfaces for customers to view their order history and for store managers to begin managing those orders.

### Story 3.1: Backend Order Creation
**As a** developer,
**I want** to create the backend infrastructure to handle order creation from a user's cart,
**so that** a user's intention to buy is recorded in the system.

**Acceptance Criteria:**
1.  The `orders` and `order_items` tables are added to the database.
2.  A `POST /api/orders` endpoint is created that takes the current user's cart, creates a new order, and populates the `order_items` table with the cart's contents.
3.  Upon successful order creation, the user's shopping cart is cleared.
4.  The order is created with a default status of "Pending".
5.  The endpoint returns a confirmation of the newly created order.

### Story 3.2: Frontend "Buy Now" and Order History
**As a** user,
**I want** to be able to click a "Buy Now" button to place my order and then see that order in my account history,
**so that** I have a record of my purchase.

**Acceptance Criteria:**
1.  A "Buy Now" button is present on the shopping cart page.
2.  Clicking the "Buy Now" button calls the `POST /api/orders` endpoint.
3.  After a successful order, the user is redirected to a simple "Thank You" or order confirmation page.
4.  The user's account section has an "Order History" page that lists all their past orders, fetched from a `GET /api/orders` endpoint.
5.  Each order in the history displays the order date, total amount, and current status.

### Story 3.3: Backend Order Management for Store Managers
**As a** developer,
**I want** to create the backend API endpoints for store managers to view and manage customer orders,
**so that** they can process incoming purchases.

**Acceptance Criteria:**
1.  A `GET /api/orders` endpoint is created that allows users with a "manager" role to view all orders across the system.
2.  A `PUT /api/orders/:id/status` endpoint is created that allows managers to update the status of an order (e.g., from "Pending" to "Shipped").
3.  These endpoints are protected and can only be accessed by users with the "manager" or "admin" role.
