### ✅ VISUAL DESIGN ELEMENTS

####  Color Palette:
Use a soft, modern, elegant aesthetic:
- **Background (page):** `#FDF9F2` (a soft off-white/cream)
- **Cards (product, detail):** `#FFFFFF` with subtle shadows
- **Primary Text:** `#222222`
- **Secondary Text:** `#666666`
- **Muted UI Text/Labels:** `#999999`
- **Primary Button:** Black `#222222` background with white text
- **Hover States:** Slight darkening or underline, no loud color changes
- **Borders/Lines:** Very light beige `#EDE8E0`

#### ️ Typography:
Use clean, soft fonts similar to Verve's aesthetic:
- **Font Family:** `Inter`, `Work Sans`, or `Helvetica Neue`
- **Header Font Size:** 20–24px bold, uppercase, slightly spaced (tracking)
- **Body Font Size:** 14–16px, line-height 1.6
- **Product names:** All caps or capitalized, bold
- **Prices:** Bold, aligned right

---

### ✅ INTERACTION PATTERNS

- **Product Card Hover:**
  - Subtle shadow increase
  - Optional: Show a black "QUICK ADD" button on hover
- **Buttons:**
  - Smooth transitions on hover (e.g., background darkens 5%)
  - Use `transition: all 0.2s ease-in-out;`
- **Navigation Bar:**
  - Hover underline or bolding on menu links
  - Cart icon remains at far right
- **Responsiveness:**
  - Nav collapses into hamburger or adjusts spacing for mobile
- **Animations:**
  - Optional: fade-in for product grid when loading

---

### ✅ UI COMPONENTS

####  Navigation Bar
- Keep all routes/buttons exactly the same
- Layout:
  - Left: "E-Commerce App" (styled like a logo, uppercase, tracking)
  - Center: navigation links (PRODUCTS, LOGIN, etc.) in a horizontal row
  - Right: cart icon (thin, elegant outline-style icon)

- Styling:
  - Background color: `#FDF9F2`
  - Font: `Work Sans`, semi-bold
  - On hover: underline or bold transition
  - Padding: 16px vertical, spaced horizontally with `gap: 24px`

---

####  Product Grid (Homepage)
Each product card should have the following structure:
- White card with light shadow and rounded corners
- Product Image at the top (fixed height ~200px), center-aligned
- Product Name (bold, uppercase or capitalized)
- Small Description (light gray)
- Price on a separate line, aligned right
- On hover: elevate the card slightly and show optional "QUICK ADD" button

Card Example Structure:
+-----------------------------+
| [Product Image]             |
|                             |
| NOVEL                       |
| Bestselling novel...        |
| $15.00                      |
+-----------------------------+

---

####  Product Detail Page
Layout:
- **Left:** Large product image (max height 400px)
- **Right:** Info panel with:
  - Product name (large, bold)
  - Description
  - Category
  - Stock info
  - Price (large, bold)
  - Add to Cart button (black, white text)

Style:
- Use a flex layout: `display: flex; gap: 48px; align-items: start`
- Info section:
  - Spaced with dividers
  - Button styling:
    - `background-color: #222222; color: white; padding: 12px 24px; font-weight: bold;`

---

### ✅ ACCESSIBILITY

Please ensure the following:
- All buttons, icons, and links have accessible labels (`aria-label`)
- Use sufficient contrast for text and backgrounds (WCAG AA)
- Add focus outlines for keyboard users
- All product images have descriptive `alt` attributes
- Use semantic HTML (`<nav>`, `<main>`, `<section>`, `<button>`, etc.)
- Respect `prefers-reduced-motion` and allow tab navigation

---

### ✅ IMPLEMENTATION INSTRUCTIONS

Please now help me:
- Refactor the existing React JSX structure to apply this updated layout and styling
- You can use **Tailwind CSS** or **Material UI** — I’m open to either
- Provide component code for:
  - Navigation bar
  - Product card component
  - Updated product detail page layout
- Style suggestions should work without breaking current backend functionality