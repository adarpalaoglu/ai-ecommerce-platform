# Barem Product Requirements Document (PRD)

## Goals and Background Context

### Goals
*   Complete a functional MVP e-commerce application with all defined features.
*   Create a high-quality codebase that showcases proficiency in FastAPI, PostgreSQL, React, and React Native.
*   Ensure a user can complete the buyer journey, from browsing to simulated checkout, without issues.
*   Enable a store manager to efficiently manage products and orders.

### Background Context
Barem is a full-stack e-commerce platform for electronics, designed to provide a seamless shopping experience. The project serves as a portfolio-worthy application for developers to gain hands-on experience building a complete product, from the backend API to the frontend web and mobile applications. It addresses the challenge developers face in integrating these components into a cohesive, real-world application.

### Change Log
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-08-05 | 1.0 | Initial draft | John (PM) |

---

## Requirements

### Functional
*   **FR1:** The system shall allow users to browse a paginated list of products with basic filtering by category and sorting by price.
*   **FR2:** The system shall provide a search functionality to find products by name or description.
*   **FR3:** The system shall display a detailed page for each product, including images, description, price, and an "Add to Cart" button.
*   **FR4:** The system shall allow users to add and remove items from their shopping cart and update quantities.
*   **FR5:** The system shall provide a "Buy Now" button in the shopping cart that, when clicked, creates an order with the current cart's contents.
*   **FR6:** The system shall allow users to create an account, log in, and view a history of their past orders.
*   **FR7:** The system shall provide a secure area for store managers to log in and manage the product catalog (add, edit, view products).
*   **FR8:** The system shall allow store managers to view and update the status of customer orders.
*   **FR9:** The system shall provide an administrative interface for managing user roles.

### Non-Functional
*   **NFR1:** The application must be responsive and accessible on modern web browsers (Chrome, Firefox, Safari) and mobile devices (iOS, Android) via React Native.
*   **NFR2:** Page load times for the main browsing and product pages should be under 3 seconds on a standard internet connection.
*   **NFR3:** The backend API must be secured using JWT-based authentication, protecting routes based on user roles.
*   **NFR4:** The codebase must adhere to established linting and formatting rules, ensuring consistency and readability.
*   **NFR5:** The system will use Redis for caching session and cart data to ensure a responsive user experience.

---

## User Interface Design Goals

### Overall UX Vision
The user experience should be clean, modern, and intuitive, prioritizing a frictionless path from product discovery to checkout. The design should feel familiar to users of popular e-commerce sites, ensuring that navigation and actions are predictable and easy to understand.

### Key Interaction Paradigms
*   **Browsing:** A standard grid-based layout for product listings with clear filtering and sorting options.
*   **Search:** A prominent search bar that leads to a dedicated results page.
*   **Cart Management:** A slide-out or mini-cart for quick additions, leading to a full-page view for final review and quantity adjustments.
*   **Checkout:** A linear, multi-step process that guides the user through shipping and payment information without distraction.

### Core Screens and Views
*   Homepage (with featured/trending products)
*   Shop/Product Listing Page
*   Product Detail Page
*   Shopping Cart Page
*   User Account Page (Login, Registration, Order History)
*   Store Manager Dashboard (Product & Order Management)

### Accessibility: WCAG AA
To ensure the application is usable by a wide range of people, we will aim for WCAG 2.1 Level AA compliance as a standard.

### Branding
The branding should be minimal and modern, with a focus on clean typography and a simple color palette that allows the product imagery to stand out. We will avoid overly complex or distracting design elements.

### Target Device and Platforms: Web Responsive
The primary platform will be a responsive web application that works seamlessly on both desktop and mobile browsers. A separate React Native application will be developed for a native mobile experience.

---

## Technical Assumptions

### Repository Structure: Polyrepo
The project will use a polyrepo structure, with two separate repositories: one for the FastAPI backend (`barem-api`) and one for the React/React Native frontend (`barem-client`). This maintains a clear separation of concerns between the frontend and backend codebases.

### Service Architecture: Monolith
The backend will be a single monolithic service built with FastAPI. This approach is simpler to develop, deploy, and manage for the scope of this MVP, providing all necessary API endpoints from a single application.

### Testing Requirements: Unit + Integration
The testing strategy will focus on a combination of unit tests for individual functions and components, along with integration tests to ensure the frontend and backend services communicate correctly. Full end-to-end testing is deferred to post-MVP.

### Additional Technical Assumptions and Requests
*   **Authentication:** JWT-based authentication will be used to secure the API.
*   **Database:** PostgreSQL will be the database of choice.
*   **Caching:** Redis will be used for session management and caching cart data to improve performance.
*   **Frontend State Management:** Redux Toolkit will be used for managing application state on the frontend.

---

## Epics & Stories

### Epic 1: Project Foundation & Core Product Browsing
**Goal:** This epic establishes the foundational infrastructure for both the backend and frontend applications. It includes setting up the database, creating the core API for products, and building the initial user interface for browsing and viewing product information. By the end of this epic, a user will be able to visit the website and see a list of products and their details.

#### Story 1.1: Backend & Database Setup
**As a** developer,
**I want** to set up the initial FastAPI project structure and connect it to a PostgreSQL database with the necessary tables,
**so that** we have a working foundation for the backend API.

**Acceptance Criteria:**
1.  A new FastAPI project is created with a logical directory structure.
2.  The application successfully connects to the PostgreSQL database.
3.  Database migration scripts (e.g., using Alembic) are created for the `products` and `categories` tables as defined in the project documentation.
4.  A script exists to seed the database with initial category data.

#### Story 1.2: Public Product API Endpoints
**As a** developer,
**I want** to create public API endpoints to fetch a list of all products and the details of a single product,
**so that** the frontend application can display product information to users.

**Acceptance Criteria:**
1.  A `GET /api/products` endpoint exists that returns a paginated, JSON-formatted list of all products.
2.  The `GET /api/products` endpoint supports basic filtering by category and sorting by price.
3.  A `GET /api/products/:id` endpoint exists that returns the complete details of a single product in JSON format.
4.  These endpoints are public and do not require authentication.
5.  A script is created to seed the database with at least 10 sample products for testing.

#### Story 1.3: Frontend Application Setup
**As a** developer,
**I want** to set up the initial React (TypeScript) application with basic routing and a UI component library,
**so that** we have a structured and visually consistent foundation for the frontend.

**Acceptance Criteria:**
1.  A new React project is created using TypeScript.
2.  React Router v6 is configured to handle basic navigation.
3.  A UI component library (e.g., Material-UI or Ant Design) is installed and configured.
4.  The project has a basic layout structure, including a header, main content area, and footer.

#### Story 1.4: Display Products on Homepage
**As a** user,
**I want** to see a list of featured products when I visit the homepage,
**so that** I can quickly discover items available in the store.

**Acceptance Criteria:**
1.  The homepage fetches data from the `GET /api/products` endpoint.
2.  Products are displayed in a clean, grid-based layout.
3.  Each product card in the grid displays the product image, name, and price.
4.  Clicking on a product card navigates the user to the corresponding product detail page.
5.  A loading indicator is shown while the products are being fetched.

#### Story 1.5: View Product Details
**As a** user,
**I want** to view a detailed page for a specific product,
**so that** I can get more information before deciding to add it to my cart.

**Acceptance Criteria:**
1.  The product detail page fetches data from the `GET /api/products/:id` endpoint based on the product ID in the URL.
2.  The page displays the product's name, multiple images (if available), a detailed description, and price.
3.  An "Add to Cart" button is prominently displayed on the page.
4.  A loading indicator is shown while the product details are being fetched.

### Epic 2: User Authentication & Cart Management
**Goal:** This epic focuses on implementing user accounts and a functional shopping cart. It will allow users to register, log in, and manage the items they wish to purchase. The cart's state will be synchronized between the backend and frontend, ensuring a consistent experience.

#### Story 2.1: Backend User & Auth Setup
**As a** developer,
**I want** to create the backend infrastructure for user registration and JWT-based authentication,
**so that** users can securely create accounts and log in.

**Acceptance Criteria:**
1.  The `users` table is added to the database with fields for email, hashed password, and role.
2.  API endpoints for user registration (`POST /api/auth/register`) and login (`POST /api/auth/login`) are created.
3.  The login endpoint successfully returns a JWT access token upon valid authentication.
4.  Password hashing (e.g., using passlib) is implemented to securely store user passwords.
5.  A default role of "buyer" is assigned to newly registered users.

#### Story 2.2: Frontend User Authentication
**As a** user,
**I want** to be able to register for a new account and log in through the website,
**so that** I can access my account and save my shopping cart.

**Acceptance Criteria:**
1.  The frontend has dedicated pages for user registration and login with corresponding forms.
2.  The forms capture the necessary information (e.g., email, password) and call the respective backend API endpoints.
3.  Upon successful login, the JWT is securely stored in the browser (e.g., in an HttpOnly cookie or local storage).
4.  The application state is updated to reflect the user's authenticated status (e.g., showing a "Logout" button).
5.  Appropriate error messages are displayed for failed registration or login attempts.

#### Story 2.3: Backend Cart Functionality
**As a** developer,
**I want** to create the backend API endpoints for managing a user's shopping cart,
**so that** items can be added, updated, and removed.

**Acceptance Criteria:**
1.  The `cart_items` table is added to the database, linking users, products, and quantities.
2.  A `GET /api/cart` endpoint is created to retrieve the current user's cart contents.
3.  A `POST /api/cart/items` endpoint is created to add a new item to the cart.
4.  `PUT /api/cart/items/:id` and `DELETE /api/cart/items/:id` endpoints are created to update the quantity of an item or remove it from the cart.
5.  All cart endpoints are protected and require a valid JWT for access.

#### Story 2.4: Frontend Cart Interaction
**As a** user,
**I want** to be able to add products to my shopping cart and see the cart update immediately,
**so that** I can keep track of the items I want to buy.

**Acceptance Criteria:**
1.  Clicking the "Add to Cart" button on a product page calls the `POST /api/cart/items` endpoint.
2.  The application has a dedicated shopping cart page that displays all items in the cart, fetched from the `GET /api/cart` endpoint.
3.  On the cart page, users can change the quantity of an item or remove it completely, triggering the appropriate API calls.
4.  The cart page displays a subtotal of all items.
5.  A visual indicator (e.g., a badge on a cart icon in the header) shows the number of items in the cart and updates in real-time.

### Epic 3: "Buy Now" & Order Management
**Goal:** This epic implements the core transaction of the application. It introduces the one-click "Buy Now" functionality that converts a shopping cart into a formal order. It also provides the necessary interfaces for customers to view their order history and for store managers to begin managing those orders.

#### Story 3.1: Backend Order Creation
**As a** developer,
**I want** to create the backend infrastructure to handle order creation from a user's cart,
**so that** a user's intention to buy is recorded in the system.

**Acceptance Criteria:**
1.  The `orders` and `order_items` tables are added to the database.
2.  A `POST /api/orders` endpoint is created that takes the current user's cart, creates a new order, and populates the `order_items` table with the cart's contents.
3.  Upon successful order creation, the user's shopping cart is cleared.
4.  The order is created with a default status of "Pending".
5.  The endpoint returns a confirmation of the newly created order.

#### Story 3.2: Frontend "Buy Now" and Order History
**As a** user,
**I want** to be able to click a "Buy Now" button to place my order and then see that order in my account history,
**so that** I have a record of my purchase.

**Acceptance Criteria:**
1.  A "Buy Now" button is present on the shopping cart page.
2.  Clicking the "Buy Now" button calls the `POST /api/orders` endpoint.
3.  After a successful order, the user is redirected to a simple "Thank You" or order confirmation page.
4.  The user's account section has an "Order History" page that lists all their past orders, fetched from a `GET /api/orders` endpoint.
5.  Each order in the history displays the order date, total amount, and current status.

#### Story 3.3: Backend Order Management for Store Managers
**As a** developer,
**I want** to create the backend API endpoints for store managers to view and manage customer orders,
**so that** they can process incoming purchases.

**Acceptance Criteria:**
1.  A `GET /api/orders` endpoint is created that allows users with a "manager" role to view all orders across the system.
2.  A `PUT /api/orders/:id/status` endpoint is created that allows managers to update the status of an order (e.g., from "Pending" to "Shipped").
3.  These endpoints are protected and can only be accessed by users with the "manager" or "admin" role.

### Epic 4: Store Manager & Admin Capabilities
**Goal:** This epic delivers the essential backend functionality for store administration. It provides the tools for store managers to manage the product catalog and for system administrators to manage user roles, completing the core feature set for the application's management side.

#### Story 4.1: Backend Product Management
**As a** store manager,
**I want** to be able to add, edit, and view products through the API,
**so that** I can manage the store's catalog.

**Acceptance Criteria:**
1.  A `POST /api/products` endpoint is created to add a new product to the database.
2.  A `PUT /api/products/:id` endpoint is created to update an existing product's details.
3.  A `DELETE /api/products/:id` endpoint is created to remove a product.
4.  These endpoints are protected and can only be accessed by users with the "manager" or "admin" role.
5.  The endpoints correctly handle product data, including name, description, price, and stock quantity.

#### Story 4.2: Frontend Product Management Interface
**As a** store manager,
**I want** a simple interface where I can see a list of all products and have options to add a new one or edit an existing one,
**so that** I can easily manage the product catalog without using the API directly.

**Acceptance Criteria:**
1.  A new "Manage Products" page is created in the frontend application, accessible only to logged-in managers/admins.
2.  The page displays a table or list of all products, fetched from the `GET /api/products` endpoint.
3.  The interface includes forms for adding a new product and editing an existing one, which call the appropriate backend endpoints.
4.  User-friendly feedback is provided for successful or failed operations (e.g., "Product successfully created").

#### Story 4.3: Backend User Role Management
**As an** admin,
**I want** to be able to change a user's role through the API,
**so that** I can grant or revoke store manager permissions.

**Acceptance Criteria:**
1.  A `GET /api/users` endpoint is created that returns a list of all users, accessible only to admins.
2.  A `PUT /api/users/:id/role` endpoint is created that allows an admin to change a user's role (e.g., from "buyer" to "manager").
3.  The endpoint is protected and can only be accessed by users with the "admin" role.

#### Story 4.4: Frontend User Management Interface
**As an** admin,
**I want** a simple interface to view all users and change their roles,
**so that** I can manage system permissions.

**Acceptance Criteria:**
1.  A new "Manage Users" page is created, accessible only to admins.
2.  The page displays a list of all users, fetched from the `GET /api/users` endpoint.
3.  The interface provides a simple way (e.g., a dropdown menu next to each user) to change a user's role, which calls the `PUT /api/users/:id/role` endpoint.
4.  Clear feedback is provided upon successful role changes.
