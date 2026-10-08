import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Badge from "./Badge";
import { Plus, ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Pick first variant if exists, else empty string
    const defaultVariant = product.attributes && product.attributes.values 
      ? product.attributes.values[0] 
      : "";
    
    addToCart(product, 1, defaultVariant);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col bg-surface rounded-lg shadow-md hover:shadow-lg transition-all duration-base ease-default hover:-translate-y-[2px] overflow-hidden"
    >
      {/* Badge Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {hasDiscount && <Badge status="sale" text="Sale" />}
        {product.stockStatus === "low-stock" && <Badge status="low-stock" count={product.stockCount} />}
        {product.stockStatus === "out-of-stock" && <Badge status="out-of-stock" />}
      </div>

      {/* Quick Commerce Badge */}
      {(product.categorySlug === "grocery" || product.categorySlug === "pharmacy") && (
        <div className="absolute top-3 right-3 z-10 bg-[#FACC15] text-[#1E293B] text-[9px] font-black uppercase tracking-wider py-1 px-2 rounded shadow-md flex items-center gap-1 animate-pulse pointer-events-none">
          <span>⚡</span>
          <span>10 Mins</span>
        </div>
      )}

      {/* Image Wrapper */}
      <div className="relative aspect-square w-full bg-[#FAF9F6] p-3 overflow-hidden">
        <img
          src={product.image}
          alt={`${product.title} - ${product.category}`}
          loading="lazy"
          className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-slow ease-default"
        />

        {/* Quick Add Button Overlay (visible on hover/focus) */}
        {product.stockStatus !== "out-of-stock" && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center px-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 transition-all duration-base ease-default">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-button py-2 px-3 rounded-md flex items-center justify-center gap-1.5 shadow-md transition-all focus-visible:ring-4 focus-visible:ring-primary-light"
              aria-label={`Quick add ${product.title} to cart`}
            >
              <Plus className="w-4 h-4" />
              <span>Quick Add</span>
            </button>
          </div>
        )}
      </div>

      {/* Body Info */}
      <div className="flex-1 p-4 flex flex-col justify-between bg-surface">
        <div>
          {/* Brand & Category Tag */}
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="text-label text-primary text-[10px] font-bold uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-text-muted text-[10px]">•</span>
            <span className="text-label text-text-secondary text-[10px] font-medium">
              {product.category}
            </span>
          </div>
          {/* Title */}
          <h3 className="text-heading-md text-text font-semibold line-clamp-1 group-hover:text-primary transition-colors mb-1">
            {product.title}
          </h3>
          {(product.categorySlug === "grocery" || product.categorySlug === "pharmacy") && (
            <p className="text-[10px] text-[#D97706] font-bold flex items-center gap-0.5 mb-2">
              <span>⚡</span>
              <span>10 Mins Delivery</span>
            </p>
          )}
        </div>

        {/* Price & Rating Row */}
        <div className="flex items-end justify-between mt-auto">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-price-md text-text">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-body-sm text-text-muted line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-[13px] text-text-secondary font-medium">
            <span className="text-warning font-body">★</span>
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
