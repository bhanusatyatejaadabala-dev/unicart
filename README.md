# 🛒 UniCart — Next-Generation E-Commerce Experience

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**UniCart** is a modern, high-performance, full-featured e-commerce web application crafted with **React 18**, **Tailwind CSS**, and **Firebase Authentication**. Designed with clean UI/UX paradigms, instant responsiveness, and an intelligent local AI Shopping Assistant, UniCart delivers an effortless digital shopping experience across multiple diverse verticals.

---

## 🌟 Key Highlights

- 🛍️ **Multi-Category Catalog** — Spans 5 distinct product verticals: Clothing, Electronics, Pharmacy, Cosmetics, and Groceries.
- 🤖 **Built-In AI Shopping Assistant** — Local conversational chatbot capable of real-time catalog search, smart cart manipulations, product recommendations, and instant routing.
- 🔐 **Firebase Authentication** — Secure user sign-up and sign-in workflows backed by password strength enforcement and persistent auth sessions.
- 🛒 **Advanced Cart & Checkout** — Real-time quantity adjustments, size/color variant pickers, promo voucher discounts, and multi-step checkout validation.
- ⚡ **Express 10-Minute Delivery** — Specialized quick-commerce delivery option for essential items (Grocery & Pharmacy).
- 📦 **Order Management** — Protected dashboard for tracking recent orders, viewing line items, delivery status, and order receipts.
- 📱 **Mobile-First Responsive Layout** — Fluid responsiveness across mobile, tablet, and desktop viewports with Tailwind CSS.

---

## 🛠️ Technology Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 18](https://react.dev/) | Component-based UI library |
| **Routing** | [React Router v6](https://reactrouter.com/) | Declarative client-side routing |
| **Build & Tooling** | [Vite 8](https://vitejs.dev/) | Fast build tool and development server |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first responsive CSS framework |
| **Authentication** | [Firebase Auth](https://firebase.google.com/) | Secure identity management & session state |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent icons |
| **AI Assistant** | Rule & Intent Engine | Privacy-friendly, client-side NLP & cart-action engine |
| **Landing Subsystem** | GSAP + Vite | Interactive animated landing showcase located in `/unicart landing` |

---

## 📁 Project Architecture

```plaintext
unicart/
├── public/                 # Static public assets & favicons
├── src/
│   ├── assets/             # Brand logos and multimedia assets
│   ├── components/         # Modular, reusable UI components
│   │   ├── Badge.jsx           # Status & notification tags
│   │   ├── Breadcrumbs.jsx     # Navigation breadcrumbs
│   │   ├── ChatAssistant.jsx   # Interactive AI assistant floating widget
│   │   ├── EmptyState.jsx      # Fallback UI for empty states
│   │   ├── Footer.jsx          # App footer with navigation links
│   │   ├── Header.jsx          # Global navbar, search, and cart counter
│   │   ├── ProductCard.jsx     # Reusable product grid cards
│   │   ├── ProtectedRoute.jsx  # Route guard requiring authentication
│   │   ├── QuantityStepper.jsx # Increment/decrement item quantity
│   │   ├── Toast.jsx           # Animated alert notifications
│   │   └── VariantSelector.jsx # Size/color variant selector
│   ├── context/            # React Context providers (Auth, Cart, Chat)
│   ├── data/               # Static catalog dataset & categories
│   ├── pages/              # Primary route views
│   │   ├── Home.jsx            # Landing marketplace with category filters & deals
│   │   ├── Category.jsx        # Category listing with filters & sort options
│   │   ├── ProductDetails.jsx  # Deep dive view with specifications & variants
│   │   ├── Cart.jsx            # Interactive cart summary & voucher input
│   │   ├── Checkout.jsx        # 3-step checkout: Shipping → Payment → Review
│   │   ├── Orders.jsx          # Protected user order history
│   │   ├── OrderDetails.jsx    # Individual order tracking & invoice view
│   │   ├── Login.jsx           # User login screen
│   │   └── Signup.jsx          # New user registration screen
│   ├── services/           # Rule-based conversational shopping agent
│   ├── firebase.js         # Firebase client initialization
│   ├── App.jsx             # Main router configuration & layout wrappers
│   ├── index.css           # Global Tailwind CSS directives & custom styles
│   └── main.jsx            # React root mount point
├── unicart landing/        # Dedicated animated landing showcase (GSAP + TypeScript)
├── .env.example            # Template for environment variables
├── .gitignore              # Files excluded from git tracking
├── package.json            # Project dependencies and lifecycle scripts
├── tailwind.config.js      # Custom theme colors and Tailwind plugins
└── vite.config.js          # Vite configuration with watch rules
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or `pnpm` / `yarn`)
- A **Firebase Project** configured with **Email/Password Authentication** enabled.

---

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/bhanusatyatejaadabala-dev/unicart.git
   cd unicart
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Duplicate `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and supply your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173` to view the application.

5. **Build for Production**
   ```bash
   npm run build
   ```
   The compiled production assets will be output to the `dist/` folder.

---

## 🔒 Security Best Practices

- 🛡️ **Zero Secret Leaks**: Secrets and Firebase keys are accessed via `import.meta.env` and kept strictly in `.env` (safeguarded via `.gitignore`).
- 🔑 **Strict Password Validation**: Registration requires robust credentials (8+ characters, mixed case, numbers).
- 🚪 **Protected Routes**: Checkout and order tracking routes enforce authentication before granting access.
- 🧹 **Error Sanitization**: Firebase authentication errors are sanitized before presentation to prevent stack trace leaks.

---

## 👨‍💻 Author & Contributions

Created and maintained by **[Bhanu Satya Teja Adabala](https://github.com/bhanusatyatejaadabala-dev)**.

- GitHub: [@bhanusatyatejaadabala-dev](https://github.com/bhanusatyatejaadabala-dev)

Contributions, feature suggestions, and feedback are always welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
