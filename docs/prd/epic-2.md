# Epic 2: User Authentication & Cart Management
**Goal:** This epic focuses on implementing user accounts and a functional shopping cart. It will allow users to register, log in, and manage the items they wish to purchase. The cart's state will be synchronized between the backend and frontend, ensuring a consistent experience.

### Story 2.1: Backend User & Auth Setup
**As a** developer,
**I want** to create the backend infrastructure for user registration and JWT-based authentication,
**so that** users can securely create accounts and log in.

**Acceptance Criteria:**
1.  The `users` table is added to the database with fields for email, hashed password, and role.
2.  API endpoints for user registration (`POST /api/auth/register`) and login (`POST /api/auth/login`) are created.
3.  The login endpoint successfully returns a JWT access token upon valid authentication.
4.  Password hashing (e.g., using passlib) is implemented to securely store user passwords.
5.  A default role of "buyer" is assigned to newly registered users.

### Story 2.2: Frontend User Authentication
**As a** user,
**I want** to be able to register for a new account and log in through the website,
**so that** I can access my account and save my shopping cart.

**Acceptance Criteria:**
1.  The frontend has dedicated pages for user registration and login with corresponding forms.
2.  The forms capture the necessary information (e.g., email, password) and call the respective backend API endpoints.
3.  Upon successful login, the JWT is securely stored in the browser (e.g., in an HttpOnly cookie or local storage).
4.  The application state is updated to reflect the user's authenticated status (e.g., showing a "Logout" button).
5.  Appropriate error messages are displayed for failed registration or login attempts.

### Story 2.3: Backend Cart Functionality
**As a** developer,
**I want** to create the backend API endpoints for managing a user's shopping cart,
**so that** items can be added, updated, and removed.

**Acceptance Criteria:**
1.  The `cart_items` table is added to the database, linking users, products, and quantities.
2.  A `GET /api/cart` endpoint is created to retrieve the current user's cart contents.
3.  A `POST /api/cart/items` endpoint is created to add a new item to the cart.
4.  `PUT /api/cart/items/:id` and `DELETE /api/cart/items/:id` endpoints are created to update the quantity of an item or remove it from the cart.
5.  All cart endpoints are protected and require a valid JWT for access.

### Story 2.4: Frontend Cart Interaction
**As a** user,
**I want** to be able to add products to my shopping cart and see the cart update immediately,
**so that** I can keep track of the items I want to buy.

**Acceptance Criteria:**
1.  Clicking the "Add to Cart" button on a product page calls the `POST /api/cart/items` endpoint.
2.  The application has a dedicated shopping cart page that displays all items in the cart, fetched from the `GET /api/cart` endpoint.
3.  On the cart page, users can change the quantity of an item or remove it completely, triggering the appropriate API calls.
4.  The cart page displays a subtotal of all items.
5.  A visual indicator (e.g., a badge on a cart icon in the header) shows the number of items in the cart and updates in real-time.
