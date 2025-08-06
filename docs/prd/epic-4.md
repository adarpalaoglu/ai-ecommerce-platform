# Epic 4: Store Manager & Admin Capabilities
**Goal:** This epic delivers the essential backend functionality for store administration. It provides the tools for store managers to manage the product catalog and for system administrators to manage user roles, completing the core feature set for the application's management side.

### Story 4.1: Backend Product Management
**As a** store manager,
**I want** to be able to add, edit, and view products through the API,
**so that** I can manage the store's catalog.

**Acceptance Criteria:**
1.  A `POST /api/products` endpoint is created to add a new product to the database.
2.  A `PUT /api/products/:id` endpoint is created to update an existing product's details.
3.  A `DELETE /api/products/:id` endpoint is created to remove a product.
4.  These endpoints are protected and can only be accessed by users with the "manager" or "admin" role.
5.  The endpoints correctly handle product data, including name, description, price, and stock quantity.

### Story 4.2: Frontend Product Management Interface
**As a** store manager,
**I want** a simple interface where I can see a list of all products and have options to add a new one or edit an existing one,
**so that** I can easily manage the product catalog without using the API directly.

**Acceptance Criteria:**
1.  A new "Manage Products" page is created in the frontend application, accessible only to logged-in managers/admins.
2.  The page displays a table or list of all products, fetched from the `GET /api/products` endpoint.
3.  The interface includes forms for adding a new product and editing an existing one, which call the appropriate backend endpoints.
4.  User-friendly feedback is provided for successful or failed operations (e.g., "Product successfully created").

### Story 4.3: Backend User Role Management
**As an** admin,
**I want** to be able to change a user's role through the API,
**so that** I can grant or revoke store manager permissions.

**Acceptance Criteria:**
1.  A `GET /api/users` endpoint is created that returns a list of all users, accessible only to admins.
2.  A `PUT /api/users/:id/role` endpoint is created that allows an admin to change a user's role (e.g., from "buyer" to "manager").
3.  The endpoint is protected and can only be accessed by users with the "admin" role.

### Story 4.4: Frontend User Management Interface
**As an** admin,
**I want** a simple interface to view all users and change their roles,
**so that** I can manage system permissions.

**Acceptance Criteria:**
1.  A new "Manage Users" page is created, accessible only to admins.
2.  The page displays a list of all users, fetched from the `GET /api/users` endpoint.
3.  The interface provides a simple way (e.g., a dropdown menu next to each user) to change a user's role, which calls the `PUT /api/users/:id/role` endpoint.
4.  Clear feedback is provided upon successful role changes.
