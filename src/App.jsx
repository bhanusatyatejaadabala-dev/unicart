import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ChatProvider } from "./context/ChatContext";
import { AuthProvider } from "./context/AuthContext";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import ChatAssistant from "./components/ChatAssistant";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ChatProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
            
            {/* Global Sticky Header */}
            <Header />
            
            {/* Main Application Routes */}
            <main className="flex-1 w-full bg-background pt-24 md:pt-28">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:slug" element={<Category />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected Routes */}
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/orders/:orderNumber" element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all fallback */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <Footer />
            
            {/* Stacked Toast Overlay system */}
            <Toast />

            {/* AI Shopping Assistant */}
            <ChatAssistant />
            
          </div>
        </Router>
      </ChatProvider>
    </CartProvider>
    </AuthProvider>
  );
}

