# Requirements

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