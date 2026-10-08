import React from "react";
import { Plus, Minus } from "lucide-react";

export default function QuantityStepper({ quantity, onChange, maxStock = 999, size = "md" }) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxStock) {
      onChange(quantity + 1);
    }
  };

  const isMinusDisabled = quantity <= 1;
  const isPlusDisabled = quantity >= maxStock;

  const btnClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  }[size];

  const textClasses = {
    sm: "w-6 text-body-sm font-medium",
    md: "w-8 text-body-md font-semibold",
    lg: "w-10 text-body-lg font-bold",
  }[size];

  return (
    <div className="inline-flex items-center bg-white border border-border rounded-full p-1 shadow-sm hover:border-border-strong transition-all focus-within:ring-4 focus-within:ring-primary-light">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={isMinusDisabled}
        className={`flex items-center justify-center rounded-full text-text hover:bg-primary-tint-10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors ${btnClasses}`}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className={`text-center select-none font-body text-text ${textClasses}`} aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrease}
        disabled={isPlusDisabled}
        className={`flex items-center justify-center rounded-full text-text hover:bg-primary-tint-10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors ${btnClasses}`}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
