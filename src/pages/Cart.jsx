import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import productsData from "../data/products.json";
import QuantityStepper from "../components/QuantityStepper";
import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import { Trash2, Tag, Percent, ArrowRight, X, Sparkles } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    promoCode,
    promoError,
    updateQuantity,
    removeFromCart,
    applyPromo,
    removePromo,
    getSubtotal,
    getDiscountAmount,
    getTax,
    getShippingCost,
    getTotal
  } = useCart();

  const [promoInput, setPromoInput] = useState("");

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      const success = applyPromo(promoInput.trim());
      if (success) {
        setPromoInput("");
      }
    }
  };

  // Recommendations: up to 3 products that are NOT currently in the cart
  const cartItemIds = useMemo(() => {
    return new Set(cart.map((item) => item.product.id));
  }, [cart]);

  const recommendedAddons = useMemo(() => {
    return productsData
      .filter((p) => !cartItemIds.has(p.id))
      .slice(0, 3);
  }, [cartItemIds]);

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const tax = getTax();
  const shipping = getShippingCost();
  const total = getTotal();

  if (cart.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pb-16">
        <EmptyState
          type="cart"
          actionText="Browse Categories"
          onActionClick={() => navigate("/category/all")}
        />
        {recommendedAddons.length > 0 && (
          <section className="mt-12 space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-heading-lg text-text font-bold">Trending Add-Ons For You</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedAddons.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pb-16 space-y-12">
      
      {/* Header */}
      <div>
        <h1 className="text-display-md text-text font-display font-medium">Your Shopping Cart</h1>
        <p className="text-body-md text-text-secondary">
          Review your unified items across clothing, pharmacy, groceries, electronics, and cosmetics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Line Items List (lg:span-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
            {cart.map((item, index) => {
              const lineSubtotal = item.product.price * item.quantity;
              
              return (
                <div 
                  key={`${item.product.id}-${item.selectedVariant}-${index}`} 
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface hover:bg-primary-tint-10/10 transition-colors animate-fade-in"
                >
                  {/* Thumbnail & Description block */}
                  <div className="flex gap-4 items-center flex-1">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md bg-background border border-border flex-shrink-0"
                    />
                    <div className="space-y-1">
                      {/* Mixed Category Tags - Core value prop */}
                      <span className="inline-block bg-primary-light text-primary text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        {item.product.category}
                      </span>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="block text-heading-sm sm:text-heading-md text-text font-semibold hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.product.title}
                      </Link>
                      <div className="text-body-sm text-text-secondary flex flex-wrap gap-x-3">
                        <span>Brand: {item.product.brand}</span>
                        {item.selectedVariant && (
                          <span className="font-semibold text-primary">Option: {item.selectedVariant}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Price Calculations block */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-body-sm text-text-secondary sm:hidden">Quantity</span>
                      <QuantityStepper
                        quantity={item.quantity}
                        onChange={(q) => updateQuantity(item.product.id, item.selectedVariant, q)}
                        maxStock={item.product.stockCount || 99}
                        size="sm"
                      />
                    </div>
                    
                    <div className="flex flex-col items-end text-right min-w-[80px]">
                      <span className="text-heading-sm text-text font-semibold">
                        ₹{lineSubtotal.toLocaleString("en-IN")}
                      </span>
                      <span className="text-body-sm text-text-secondary">
                        ₹{item.product.price.toLocaleString("en-IN")} each
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                      className="text-text-muted hover:text-error hover:bg-error/5 p-2 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-error/20"
                      aria-label={`Remove ${item.product.title} from cart`}
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Promo Code input block */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-heading-sm text-text font-bold uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <span>Promo Code</span>
            </h3>
            
            {promoCode ? (
              <div className="flex items-center justify-between bg-primary-tint-10 border border-primary-light text-primary px-4 py-3 rounded-md animate-slide-in">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  <span className="text-body-md font-semibold">Code {promoCode} is active</span>
                </div>
                <button
                  onClick={removePromo}
                  className="text-primary hover:text-primary-hover p-1 rounded-full hover:bg-black/5"
                  aria-label="Remove promo code"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter UNICART10 or WELCOME10"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-background border border-border rounded-sm py-2 px-3 text-body-md outline-none focus:border-primary focus:ring-4 focus:ring-primary-light transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-white text-button px-5 py-2 rounded-md shadow-sm transition-colors focus-visible:ring-4 focus-visible:ring-primary-light"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-error text-body-sm font-semibold animate-slide-in">
                    {promoError}
                  </p>
                )}
              </form>
            )}
            <p className="text-body-sm text-text-secondary leading-relaxed">
              * Promo codes are case-insensitive. Only one active code may be applied per checkout sequence.
            </p>
          </div>

        </div>

        {/* Order Summary Card (lg:span-4, sticky on desktop) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-heading-sm text-text font-bold uppercase tracking-wider border-b border-border pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-body-md text-text-secondary">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-text">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-primary font-semibold">
                  <span className="flex items-center gap-1">Discount ({promoCode})</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-text">
                  {shipping === 0 ? (
                    <span className="text-success uppercase text-xs font-bold">Free Shipping</span>
                  ) : (
                    `₹${shipping.toLocaleString("en-IN")}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="font-semibold text-text">₹{tax.toLocaleString("en-IN")}</span>
              </div>

              {shipping > 0 && (
                <p className="text-[11px] text-text-muted leading-tight border-t border-dashed border-border pt-2.5">
                  💡 Tip: Add <span className="font-semibold">₹{(1000 - subtotal).toLocaleString("en-IN")}</span> more to your cart to qualify for free shipping!
                </p>
              )}
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-baseline">
              <span className="text-heading-sm text-text font-bold">Order Total</span>
              <span className="text-price-lg text-primary font-bold">₹{total.toLocaleString("en-IN")}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-button py-3.5 rounded-md shadow-md flex items-center justify-center gap-2 transition-all duration-fast focus-visible:ring-4 focus-visible:ring-primary-light"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center">
              <Link to="/category/all" className="text-body-sm text-primary hover:text-primary-hover hover:underline font-semibold">
                Continue Shopping
              </Link>
            </div>

          </div>
        </aside>

      </div>

      {/* Recommended add-ons */}
      {recommendedAddons.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-border">
          <h2 className="text-display-md text-text font-display font-medium">Recommended Add-Ons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedAddons.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
