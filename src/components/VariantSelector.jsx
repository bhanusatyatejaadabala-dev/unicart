import React from "react";

export default function VariantSelector({ 
  label, 
  options, 
  selectedOption, 
  onSelect 
}) {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-2">
      <span className="block text-label text-text-secondary font-semibold">
        Select {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedOption === opt;
          
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className={`px-4 py-2 text-body-sm font-medium border rounded-sm transition-all duration-fast focus-visible:ring-4 focus-visible:ring-primary-light ${
                isSelected
                  ? "bg-primary-light border-primary text-primary shadow-sm"
                  : "bg-surface border-border text-text hover:border-border-strong hover:bg-primary-tint-10/30"
              }`}
              aria-pressed={isSelected}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
