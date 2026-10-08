import React, { createContext, useContext, useState, useEffect } from "react";
import productsData from "../data/products.json";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Load initial cart from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("unicart_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Promo and discounts
  const [promoCode, setPromoCode] = useState(() => {
    return localStorage.getItem("unicart_promo") || "";
  });
  const [discount, setDiscount] = useState(() => {
    const savedDiscount = localStorage.getItem("unicart_discount");
    return savedDiscount ? parseFloat(savedDiscount) : 0;
  });
  const [promoError, setPromoError] = useState("");

  // Toast notifications list
  const [toasts, setToasts] = useState([]);

  // Final checkout success details
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  // Orders history persisted in localStorage
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("unicart_orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Sync orders with localStorage
  useEffect(() => {
    localStorage.setItem("unicart_orders", JSON.stringify(orders));
  }, [orders]);

  // Sync cart with productsData on mount to resolve any stale local storage prices/images
  useEffect(() => {
    setCart((prevCart) => {
      let changed = false;
      const updated = prevCart.map((item) => {
        const freshProduct = productsData.find((p) => p.id === item.product.id);
        if (freshProduct && JSON.stringify(freshProduct) !== JSON.stringify(item.product)) {
          changed = true;
          return { ...item, product: freshProduct };
        }
        return item;
      });
      return changed ? updated : prevCart;
    });
  }, []);

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem("unicart_cart", JSON.stringify(cart));
  }, [cart]);

  // Sync promo with localStorage
  useEffect(() => {
    localStorage.setItem("unicart_promo", promoCode);
    localStorage.setItem("unicart_discount", discount.toString());
  }, [promoCode, discount]);

  // Toast triggers
  const triggerToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add item
  const addToCart = (product, quantity = 1, selectedVariant = "") => {
    // Check stock status
    if (product.stockStatus === "out-of-stock") {
      triggerToast(`Sorry, ${product.title} is currently out of stock.`, "error");
      return;
    }

    setCart((prevCart) => {
      // Find item with same ID and variant
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
      );

      if (existingItemIndex > -1) {
        // Check stock availability
        const newQty = prevCart[existingItemIndex].quantity + quantity;
        if (product.stockCount && newQty > product.stockCount) {
          triggerToast(`Only ${product.stockCount} items left in stock.`, "warning");
          // Cap at stock count
          const updated = [...prevCart];
          updated[existingItemIndex].quantity = product.stockCount;
          return updated;
        }

        const updated = [...prevCart];
        updated[existingItemIndex].quantity = newQty;
        triggerToast(`Updated ${product.title} quantity in cart.`, "success");
        return updated;
      } else {
        if (product.stockCount && quantity > product.stockCount) {
          triggerToast(`Only ${product.stockCount} items left in stock.`, "warning");
          quantity = product.stockCount;
        }
        triggerToast(`Added ${product.title} to cart.`, "success");
        return [...prevCart, { product, quantity, selectedVariant }];
      }
    });
  };

  // Remove item
  const removeFromCart = (productId, selectedVariant = "") => {
    const item = cart.find(i => i.product.id === productId && i.selectedVariant === selectedVariant);
    if (item) {
      setCart((prevCart) =>
        prevCart.filter(
          (i) => !(i.product.id === productId && i.selectedVariant === selectedVariant)
        )
      );
      triggerToast(`Removed ${item.product.title} from cart.`, "info");
    }
  };

  // Update quantity
  const updateQuantity = (productId, selectedVariant = "", quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === productId && item.selectedVariant === selectedVariant
      );

      if (existingItemIndex > -1) {
        const item = prevCart[existingItemIndex];
        // Check stock
        if (item.product.stockCount && quantity > item.product.stockCount) {
          triggerToast(`Only ${item.product.stockCount} items left in stock.`, "warning");
          quantity = item.product.stockCount;
        }

        const updated = [...prevCart];
        updated[existingItemIndex].quantity = quantity;
        return updated;
      }
      return prevCart;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setPromoCode("");
    setDiscount(0);
    localStorage.removeItem("unicart_cart");
    localStorage.removeItem("unicart_promo");
    localStorage.removeItem("unicart_discount");
  };

  // Apply promo
  const applyPromo = (code) => {
    const formattedCode = code.trim().toUpperCase();
    const subtotal = getSubtotal();

    if (formattedCode === "UNICART10") {
      if (subtotal < 2000) {
        const err = "UNICART10 requires a minimum purchase of ₹2,000.";
        setPromoError(err);
        triggerToast(err, "error");
        return false;
      }
      setPromoCode("UNICART10");
      setDiscount(500.00); // flat ₹500 off
      setPromoError("");
      triggerToast("Promo code UNICART10 applied: ₹500.00 discount!", "success");
      return true;
    } else if (formattedCode === "WELCOME10") {
      setPromoCode("WELCOME10");
      setDiscount(0.10); // 10% off
      setPromoError("");
      triggerToast("Promo code WELCOME10 applied: 10% off your order!", "success");
      return true;
    } else if (formattedCode === "SUPER20") {
      if (subtotal < 1500) {
        const err = "SUPER20 requires a minimum purchase of ₹1,500.";
        setPromoError(err);
        triggerToast(err, "error");
        return false;
      }
      setPromoCode("SUPER20");
      setDiscount(0.20); // 20% off
      setPromoError("");
      triggerToast("Promo code SUPER20 applied: 20% off your order!", "success");
      return true;
    } else if (formattedCode === "FREEFAST") {
      setPromoCode("FREEFAST");
      setDiscount(0); // Free shipping handled in getShippingCost
      setPromoError("");
      triggerToast("Promo code FREEFAST applied: Free shipping on this order!", "success");
      return true;
    } else if (formattedCode === "INSTA300") {
      const hasQuickItems = cart.some(
        (item) => item.product.categorySlug === "grocery" || item.product.categorySlug === "pharmacy"
      );
      if (!hasQuickItems) {
        const err = "INSTA300 can only be applied to orders with Grocery or Pharmacy items.";
        setPromoError(err);
        triggerToast(err, "error");
        return false;
      }
      if (subtotal < 1000) {
        const err = "INSTA300 requires a minimum purchase of ₹1,000.";
        setPromoError(err);
        triggerToast(err, "error");
        return false;
      }
      setPromoCode("INSTA300");
      setDiscount(300.00); // Flat ₹300 off
      setPromoError("");
      triggerToast("Promo code INSTA300 applied: ₹300.00 discount on quick items!", "success");
      return true;
    } else {
      setPromoError("Invalid promo code. Try 'UNICART10', 'WELCOME10', 'SUPER20', 'FREEFAST', or 'INSTA300'.");
      triggerToast("Invalid promo code.", "error");
      return false;
    }
  };

  // Remove promo
  const removePromo = () => {
    setPromoCode("");
    setDiscount(0);
    setPromoError("");
    triggerToast("Promo code removed.", "info");
  };

  // Place order
  const placeOrder = (shippingInfo, paymentInfo) => {
    const orderNumber = "UC-" + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const hasQuickItems = cart.some(
      (item) => item.product.categorySlug === "grocery" || item.product.categorySlug === "pharmacy"
    );

    // Build tracking stages
    const trackingStages = hasQuickItems
      ? [
          { label: "Order Placed", status: "completed", time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), date: now.toLocaleDateString("en-IN") },
          { label: "Preparing", status: "completed", time: new Date(now.getTime() + 2 * 60000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), date: now.toLocaleDateString("en-IN") },
          { label: "Rider Assigned", status: "current", time: new Date(now.getTime() + 4 * 60000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), date: now.toLocaleDateString("en-IN") },
          { label: "On the Way", status: "pending", time: null, date: null },
          { label: "Delivered", status: "pending", time: null, date: null },
        ]
      : [
          { label: "Order Placed", status: "completed", time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), date: now.toLocaleDateString("en-IN") },
          { label: "Processing", status: "current", time: null, date: null },
          { label: "Shipped", status: "pending", time: null, date: null },
          { label: "Out for Delivery", status: "pending", time: null, date: null },
          { label: "Delivered", status: "pending", time: null, date: null },
        ];

    const estimatedDelivery = hasQuickItems
      ? "10-15 minutes"
      : "3-5 business days";

    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    const tax = getTax();
    const shippingCost = (() => {
      if (promoCode === "FREEFAST") return 0;
      if (shippingInfo && shippingInfo.shippingMethod === "express") return 180.00;
      if (subtotal === 0 || subtotal >= 1000) return 0;
      return 70.00;
    })();
    const total = subtotal - discountAmount + tax + shippingCost;

    const orderDetails = {
      orderNumber,
      items: [...cart],
      shipping: shippingInfo,
      payment: paymentInfo,
      date: now.toLocaleDateString("en-IN"),
      dateISO: now.toISOString(),
      promoCode,
      discount,
      subtotal,
      discountAmount,
      tax,
      shippingCost,
      total,
      tracking: trackingStages,
      estimatedDelivery,
      isExpress: hasQuickItems,
      status: hasQuickItems ? "Rider Assigned" : "Processing",
    };

    setOrders((prev) => [orderDetails, ...prev]);
    setOrderConfirmation(orderDetails);
    clearCart();
    triggerToast("Thank you! Your order was placed successfully.", "success");
    return orderNumber;
  };

  const getOrders = () => orders;

  const getOrderById = (orderNumber) =>
    orders.find((o) => o.orderNumber === orderNumber) || null;

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    const subtotal = getSubtotal();
    if (promoCode === "UNICART10") {
      return Math.min(discount, subtotal);
    } else if (promoCode === "WELCOME10") {
      return subtotal * discount;
    } else if (promoCode === "SUPER20") {
      return subtotal * discount;
    } else if (promoCode === "INSTA300") {
      return Math.min(300.00, subtotal);
    }
    return 0;
  };

  const getTax = () => {
    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    return (subtotal - discountAmount) * 0.08; // 8% sales tax
  };

  const getShippingCost = () => {
    if (promoCode === "FREEFAST") return 0;
    const subtotal = getSubtotal();
    if (subtotal === 0 || subtotal >= 1000) return 0; // free shipping over ₹1000
    return 70.00;
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    const tax = getTax();
    const shipping = getShippingCost();
    return subtotal - discountAmount + tax + shipping;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        promoCode,
        discount,
        promoError,
        toasts,
        orderConfirmation,
        setOrderConfirmation,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromo,
        removePromo,
        triggerToast,
        removeToast,
        placeOrder,
        getOrders,
        getOrderById,
        getSubtotal,
        getDiscountAmount,
        getTax,
        getShippingCost,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
