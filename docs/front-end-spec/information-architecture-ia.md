# Information Architecture (IA)

### 2.1 Site Map / Screen Inventory

```mermaid
graph TD
    A[Homepage] --> B[Shop/Product Listing Page]
    B --> C[Product Detail Page]
    A --> C
    C --> D[Shopping Cart Page]
    D --> E[Order Confirmation Page]
    A --> F[User Account Page]
    F --> F1[Login/Registration]
    F --> F2[Order History]
    A --> G[Store Manager Dashboard]
    G --> G1[Product Management]
    G --> G2[Order Management]
    G --> G3[User Role Management (Admin Only)]
```

**Rationale:**
*   This site map prioritizes the core functional flows identified in the PRD.
*   It shows the main entry points (Homepage) and how users can navigate to product listings, individual product details, and then to the cart and order confirmation.
*   Separate branches are included for user account management and the distinct store manager functionalities, reflecting the different user roles.
*   The diagram is kept high-level, focusing on the main pages rather than every possible sub-view, aligning with the functional and concise approach.