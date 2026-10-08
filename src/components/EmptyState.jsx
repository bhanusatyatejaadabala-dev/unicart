import React from "react";
import { HelpCircle, ShoppingBag, Filter, ArrowRight } from "lucide-react";

export default function EmptyState({ 
  type = "default", 
  title, 
  description, 
  actionText, 
  onActionClick 
}) {
  let Icon = HelpCircle;
  let defaultTitle = title || "No Results Found";
  let defaultDesc = description || "We couldn't find what you were looking for. Please try another search or check back later.";

  if (type === "cart") {
    Icon = ShoppingBag;
    defaultTitle = title || "Your Cart is Empty";
    defaultDesc = description || "Explore our categories and add botanical skincare, organic honey, eco-tech or linen apparel to get started.";
  } else if (type === "filter") {
    Icon = Filter;
    defaultTitle = title || "No Products Match Your Filters";
    defaultDesc = description || "Try adjusting your price range, ratings filter, or selected attributes to discover organic options.";
  }

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-surface border border-border rounded-xl shadow-sm max-w-lg mx-auto animate-fade-in my-8">
      <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary mb-6">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-display text-2xl text-text mb-3">{defaultTitle}</h3>
      <p className="text-body-md text-text-secondary max-w-sm mb-8 leading-relaxed">
        {defaultDesc}
      </p>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-button px-6 py-3 rounded-md shadow-sm transition-all duration-fast focus-visible:ring-4 focus-visible:ring-primary-light"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
