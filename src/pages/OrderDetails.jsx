import React from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  ArrowLeft,
  Zap,
  CircleDot,
  Circle,
} from "lucide-react";

export default function OrderDetails() {
  const { orderNumber } = useParams();
  const { getOrderById } = useCart();
  const order = getOrderById(orderNumber);

  if (!order) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <Package className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-display-md text-text font-display font-medium">Order Not Found</h1>
        <p className="text-body-md text-text-secondary">
          We couldn't find order <strong>{orderNumber}</strong>. It may have been removed.
        </p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-button px-6 py-3 rounded-md shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
      </div>
    );
  }

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>All Orders</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-display-md text-text font-display font-medium">{order.orderNumber}</h1>
            {order.isExpress && (
              <span className="bg-[#FACC15] text-[#1E293B] text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                ⚡ Express Delivery
              </span>
            )}
          </div>
          <p className="text-body-md text-text-secondary mt-1">
            Placed on {order.date} • {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-body-sm text-text-secondary">Order Total</p>
          <p className="text-heading-lg text-text font-bold">
            ₹{(order.total || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tracking Timeline + Items */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tracking Timeline */}
          <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-md text-text font-bold flex items-center gap-2">
                {order.isExpress ? (
                  <Zap className="w-5 h-5 text-[#D97706]" />
                ) : (
                  <Truck className="w-5 h-5 text-primary" />
                )}
                <span>{order.isExpress ? "Express Tracking" : "Order Tracking"}</span>
              </h2>
              <span className="text-body-sm text-text-secondary">
                Est. delivery: <strong className="text-text">{order.estimatedDelivery}</strong>
              </span>
            </div>

            {/* Visual Timeline */}
            <div className="relative pl-8">
              {order.tracking.map((stage, idx) => {
                const isLast = idx === order.tracking.length - 1;
                const isCompleted = stage.status === "completed";
                const isCurrent = stage.status === "current";

                return (
                  <div key={idx} className="relative pb-8 last:pb-0">
                    {/* Vertical line */}
                    {!isLast && (
                      <div
                        className={`absolute left-[-20px] top-6 w-0.5 h-full ${
                          isCompleted ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}

                    {/* Node */}
                    <div className="absolute left-[-28px] top-0.5">
                      {isCompleted ? (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center animate-pulse">
                          <CircleDot className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-border bg-surface flex items-center justify-center">
                          <Circle className="w-3 h-3 text-text-muted" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`ml-2 ${isCurrent ? "" : ""}`}>
                      <p
                        className={`text-body-md font-semibold ${
                          isCompleted || isCurrent ? "text-text" : "text-text-muted"
                        }`}
                      >
                        {stage.label}
                        {isCurrent && (
                          <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-light text-primary text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Current
                          </span>
                        )}
                      </p>
                      {stage.time && (
                        <p className="text-body-sm text-text-secondary mt-0.5">
                          {stage.date} at {stage.time}
                        </p>
                      )}
                      {!stage.time && stage.status === "pending" && (
                        <p className="text-body-sm text-text-muted mt-0.5 italic">Pending</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-heading-md text-text font-bold">
              Items ({itemCount})
            </h2>
            <div className="divide-y divide-border">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <Link
                    to={`/product/${item.product.id}`}
                    className="w-16 h-16 rounded-lg bg-[#FAF9F6] overflow-hidden shrink-0 border border-border hover:border-primary transition-colors"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="text-body-md text-text font-semibold hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-body-sm text-text-secondary">
                      {item.product.brand} • Qty: {item.quantity}
                      {item.selectedVariant ? ` • ${item.selectedVariant}` : ""}
                    </p>
                  </div>
                  <p className="text-body-md text-text font-bold shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Shipping + Payment + Price Summary */}
        <div className="space-y-6">
          {/* Shipping Address */}
          {order.shipping && (
            <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
              <h3 className="text-heading-sm text-text font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Shipping Address
              </h3>
              <div className="text-body-sm text-text-secondary space-y-0.5">
                <p className="font-semibold text-text">{order.shipping.fullName}</p>
                <p>{order.shipping.address}</p>
                <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
                <p>{order.shipping.phone}</p>
                <p>{order.shipping.email}</p>
              </div>
            </div>
          )}

          {/* Payment Method */}
          {order.payment && (
            <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
              <h3 className="text-heading-sm text-text font-bold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Payment
              </h3>
              <p className="text-body-sm text-text-secondary">
                {order.payment.method === "card" && "Credit/Debit Card"}
                {order.payment.method === "upi" && `UPI (${order.payment.upiId || "—"})`}
                {order.payment.method === "cod" && "Cash on Delivery"}
              </p>
            </div>
          )}

          {/* Price Summary */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
            <h3 className="text-heading-sm text-text font-bold">Price Summary</h3>
            <div className="space-y-2 text-body-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>₹{(order.subtotal || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {order.promoCode ? `(${order.promoCode})` : ""}</span>
                  <span>-₹{order.discountAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                </div>
              )}
              <div className="flex justify-between text-text-secondary">
                <span>Tax</span>
                <span>₹{(order.tax || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? "Free" : `₹${order.shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-text font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span>₹{(order.total || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
