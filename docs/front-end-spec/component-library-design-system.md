# Component Library / Design System

This section will discuss whether to use an existing design system or create a new one. If creating new, we will identify foundational components and their key states. Note that detailed technical specifications for implementation belong in the front-end architecture document.

### 5.1 Design System Approach

**Question:** What is the intended design system approach for Barem? Will we be:

1.  **Utilizing an existing UI component library/framework** (e.g., Material-UI, Ant Design, Bootstrap, Chakra UI) and adapting it to Barem's branding?
2.  **Building a custom component library** from scratch, tailored specifically for Barem?
3.  **A hybrid approach**, using an existing library as a base but extending it with custom components where needed?

Please select one of the options above, or provide your own approach.

### 5.2 Core Components

This subsection will identify foundational UI components for Barem and describe their key functional states.

### 5.2.1 Core Component Example: Product Card

The Product Card is a fundamental component used across various listing pages (Homepage, Product Listing Page, Search Results).

*   **Purpose:** To display essential information about a single product and provide quick access to its details or purchase options.

*   **Functional States:**
    *   **Default:** Displays product image, name, and price. It is clickable to navigate to the Product Detail Page.
    *   **Hover:** Visual feedback when the user's cursor is over the card (e.g., slight elevation, border change) to indicate interactivity.
    *   **Loading:** A placeholder state (e.g., skeleton loader, spinner) shown while product data is being fetched.
    *   **Out of Stock:** Visually indicates that the product is not currently available (e.g., "Out of Stock" overlay, disabled "Add to Cart" button).
    *   **Discounted:** Displays both original and discounted prices, potentially with a visual badge indicating the discount.