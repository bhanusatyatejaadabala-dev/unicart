import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  Zap,
  ShoppingBag,
} from "lucide-react";

const statusConfig = {
  "Order Placed": { color: "bg-blue-100 text-blue-700", icon: Clock },
  "Processing": { color: "bg-yellow-100 text-yellow-700", icon: Clock },
  "Preparing": { color: "bg-yellow-100 text-yellow-700", icon: Clock },
  "Rider Assigned": { color: "bg-orange-100 text-orange-700", icon: Zap },
  "Shipped": { color: "bg-indigo-100 text-indigo-700", icon: Truck },
  "Out for Delivery": { color: "bg-purple-100 text-purple-700", icon: Truck },
  "On the Way": { color: "bg-purple-100 text-purple-700", icon: Truck },
  "Delivered": { color: "bg-green-100 text-green-700", icon: CheckCircle },
};

export default function Orders() {
  const { orders } = useCart();

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-light flex items-center justify-center">
            <Package className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-display-md text-text font-display font-medium">No Orders Yet</h1>
          <p className="text-body-md text-text-secondary max-w-md mx-auto">
            You haven't placed any orders yet. Start shopping and your order history will appear here.
          </p>
          <Link
            to="/category/all"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-button px-6 py-3 rounded-md shadow-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-display-md text-text font-display font-medium">Your Orders</h1>
        <p className="text-body-md text-text-secondary mt-1">
          Track and manage your {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const config = statusConfig[order.status] || statusConfig["Processing"];
          const StatusIcon = config.icon;
          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
          const firstItems = order.items.slice(0, 3);

          return (
            <Link
              key={order.orderNumber}
              to={`/orders/${order.orderNumber}`}
              className="block bg-surface border border-border rounded-xl p-5 lg:p-6 hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Order info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Stacked product images */}
                  <div className="flex -space-x-3 shrink-0">
                    {firstItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="w-12 h-12 rounded-lg border-2 border-surface bg-[#FAF9F6] overflow-hidden shadow-sm"
                        style={{ zIndex: firstItems.length - idx }}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 rounded-lg border-2 border-surface bg-background flex items-center justify-center text-xs font-bold text-text-secondary shadow-sm">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-heading-sm text-text font-bold">{order.orderNumber}</h3>
                      {order.isExpress && (
                        <span className="bg-[#FACC15] text-[#1E293B] text-[9px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          ⚡ Express
                        </span>
                      )}
                    </div>
                    <p className="text-body-sm text-text-secondary mt-0.5">
                      {order.date} • {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                    <p className="text-body-sm text-text-muted mt-0.5 truncate">
                      {order.items.map((i) => i.product.title).join(", ")}
                    </p>
                  </div>
                </div>

                {/* Right: Status + Total */}
                <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                  <div className="text-right">
                    <p className="text-heading-sm text-text font-bold">
                      ₹{(order.total || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </p>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${config.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{order.status}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                </div>
              </div>

              {/* Delivery estimate */}
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-body-sm text-text-secondary">
                {order.isExpress ? (
                  <Zap className="w-3.5 h-3.5 text-[#D97706]" />
                ) : (
                  <Truck className="w-3.5 h-3.5 text-primary" />
                )}
                <span>
                  Estimated delivery: <strong className="text-text">{order.estimatedDelivery}</strong>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
