import React, { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import productsData from "../data/products.json";
import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/Breadcrumbs";
import EmptyState from "../components/EmptyState";
import { Filter, X, ChevronDown, Check, SlidersHorizontal } from "lucide-react";

export default function Category() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Route search state
  const searchQuery = searchParams.get("search") || "";

  // Category details
  const categoryMeta = useMemo(() => {
    const slugLower = (slug || "all").toLowerCase();
    switch (slugLower) {
      case "clothing":
        return { name: "Clothing", desc: "Crafted from organic fibers like Belgian flax linen, hemp, and eucalyptus cotton.", slug: "clothing" };
      case "pharmacy":
        return { name: "Pharmacy", desc: "Clinically backed herbs, adaptogens, and wellness supplements certified for purity.", slug: "pharmacy" };
      case "electronics":
        return { name: "Electronics", desc: "Tech accessories wrapped in wood, bamboo, and recycled organic composites.", slug: "electronics" };
      case "cosmetics":
        return { name: "Cosmetics", desc: "Dermatologist-approved botanicals, minerals, and avocado seed oils.", slug: "cosmetics" };
      case "grocery":
        return { name: "Grocery", desc: "Raw wildflower honey, cold-pressed olives, and stone-milled herbal grains.", slug: "grocery" };
      case "all":
      default:
        return { name: "All Products", desc: "Explore our entire catalog of organic, sustainable, and high-integrity essentials.", slug: "all" };
    }
  }, [slug]);

  // Filter States
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState(""); // size, dosage, shade, weight
  const [sortBy, setSortBy] = useState("featured"); // featured, price-low, price-high, rating

  // Mobile Filters drawer open state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset page when category, search, or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [slug, searchQuery, maxPrice, selectedBrand, minRating, hideOutOfStock, selectedSpec, sortBy]);

  // Gather matching products
  const categoryProducts = useMemo(() => {
    return productsData.filter((p) => {
      if (categoryMeta.slug === "all") return true;
      return p.categorySlug === categoryMeta.slug;
    });
  }, [categoryMeta.slug]);

  // Dynamically extract filter lists from current category products
  const brands = useMemo(() => {
    const unique = new Set(categoryProducts.map((p) => p.brand));
    return Array.from(unique);
  }, [categoryProducts]);

  const specOptions = useMemo(() => {
    const uniqueSpecs = new Set();
    categoryProducts.forEach((p) => {
      if (p.attributes && p.attributes.values) {
        p.attributes.values.forEach((v) => uniqueSpecs.add(v));
      }
    });
    return Array.from(uniqueSpecs);
  }, [categoryProducts]);

  const specLabel = useMemo(() => {
    const sample = categoryProducts.find((p) => p.attributes && p.attributes.type);
    return sample ? sample.attributes.type : "Variant";
  }, [categoryProducts]);

  // Filter and Sort Processing
  const processedProducts = useMemo(() => {
    let result = [...categoryProducts];

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    // Price filter
    result = result.filter((p) => p.price <= maxPrice);

    // Brand filter
    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Stock filter
    if (hideOutOfStock) {
      result = result.filter((p) => p.stockStatus !== "out-of-stock");
    }

    // Custom Spec attribute filter
    if (selectedSpec) {
      result = result.filter(
        (p) => p.attributes && p.attributes.values && p.attributes.values.includes(selectedSpec)
      );
    }

    // Sort processing
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "featured") {
      // Keep original rating/priority sorting
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [categoryProducts, searchQuery, maxPrice, selectedBrand, minRating, hideOutOfStock, selectedSpec, sortBy]);

  // Active chips count helper
  const activeChips = useMemo(() => {
    const chips = [];
    if (maxPrice < 50000) chips.push({ label: `Under ₹${maxPrice.toLocaleString("en-IN")}`, type: "price" });
    if (selectedBrand) chips.push({ label: selectedBrand, type: "brand" });
    if (minRating > 0) chips.push({ label: `${minRating}+ Stars`, type: "rating" });
    if (hideOutOfStock) chips.push({ label: "In Stock Only", type: "stock" });
    if (selectedSpec) chips.push({ label: selectedSpec, type: "spec" });
    if (searchQuery) chips.push({ label: `Search: "${searchQuery}"`, type: "search" });
    return chips;
  }, [maxPrice, selectedBrand, minRating, hideOutOfStock, selectedSpec, searchQuery]);

  const handleRemoveChip = (chip) => {
    if (chip.type === "price") setMaxPrice(50000);
    else if (chip.type === "brand") setSelectedBrand("");
    else if (chip.type === "rating") setMinRating(0);
    else if (chip.type === "stock") setHideOutOfStock(false);
    else if (chip.type === "spec") setSelectedSpec("");
    else if (chip.type === "search") {
      searchParams.delete("search");
      setSearchParams(searchParams);
    }
  };

  const handleResetAll = () => {
    setMaxPrice(50000);
    setSelectedBrand("");
    setMinRating(0);
    setHideOutOfStock(false);
    setSelectedSpec("");
    if (searchQuery) {
      searchParams.delete("search");
      setSearchParams(searchParams);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return processedProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [processedProducts, currentPage]);

  const breadcrumbItems = [
    { label: categoryMeta.name, url: `/category/${categoryMeta.slug}` }
  ];

  // Filters sidebars UI definitions
  const renderFiltersContent = () => (
    <div className="space-y-6">
      
      {/* Reset button inside drawer */}
      <div className="flex items-center justify-between">
        <h4 className="text-heading-sm text-text font-bold uppercase tracking-wider">Filters</h4>
        {activeChips.length > 0 && (
          <button
            onClick={handleResetAll}
            className="text-body-sm font-semibold text-primary hover:text-primary-hover hover:underline"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Price filter slider */}
      <div className="border-t border-border pt-4 space-y-2">
        <label className="text-heading-sm text-text block mb-1">Max Price: ₹{maxPrice.toLocaleString("en-IN")}</label>
        <input
          type="range"
          min="100"
          max="50000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-4 focus:ring-primary-light"
        />
        <div className="flex justify-between text-body-sm text-text-muted">
          <span>₹100</span>
          <span>₹50,000</span>
        </div>
      </div>

      {/* Brand Select */}
      {brands.length > 1 && (
        <div className="border-t border-border pt-4 space-y-2">
          <label htmlFor="brand-select" className="text-heading-sm text-text block">Brand</label>
          <select
            id="brand-select"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full bg-surface border border-border rounded-sm py-2 px-3 text-body-md outline-none focus:border-primary focus:ring-4 focus:ring-primary-light"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Custom Category Spec attribute filter (e.g. Size, Pack Size, Shade) */}
      {specOptions.length > 0 && (
        <div className="border-t border-border pt-4 space-y-2">
          <label htmlFor="spec-select" className="text-heading-sm text-text block capitalize">{specLabel}</label>
          <select
            id="spec-select"
            value={selectedSpec}
            onChange={(e) => setSelectedSpec(e.target.value)}
            className="w-full bg-surface border border-border rounded-sm py-2 px-3 text-body-md outline-none focus:border-primary focus:ring-4 focus:ring-primary-light"
          >
            <option value="">All {specLabel}s</option>
            {specOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Minimum Rating */}
      <div className="border-t border-border pt-4 space-y-2">
        <span className="text-heading-sm text-text block">Minimum Rating</span>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2].map((stars) => (
            <label key={stars} className="flex items-center gap-2.5 text-body-md text-text-secondary cursor-pointer select-none">
              <input
                type="radio"
                name="rating-group"
                checked={minRating === stars}
                onChange={() => setMinRating(stars)}
                className="w-4 h-4 accent-primary"
              />
              <span>{stars}+ Stars</span>
            </label>
          ))}
          <label className="flex items-center gap-2.5 text-body-md text-text-secondary cursor-pointer select-none">
            <input
              type="radio"
              name="rating-group"
              checked={minRating === 0}
              onChange={() => setMinRating(0)}
              className="w-4 h-4 accent-primary"
            />
            <span>All Ratings</span>
          </label>
        </div>
      </div>

      {/* Availability stock filter */}
      <div className="border-t border-border pt-4 space-y-2">
        <label className="flex items-center gap-2.5 text-body-md text-text-secondary cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hideOutOfStock}
            onChange={(e) => setHideOutOfStock(e.target.checked)}
            className="w-4 h-4 accent-primary rounded-sm"
          />
          <span>Exclude Out of Stock</span>
        </label>
      </div>

    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pb-16">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Category Header */}
      <div className="border-b border-border pb-8 mb-8 space-y-3">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
          <h1 className="text-display-md text-text font-display font-medium">
            {categoryMeta.name}
          </h1>
          <span className="text-body-md text-text-secondary font-medium">
            {processedProducts.length} {processedProducts.length === 1 ? "Product" : "Products"} available
          </span>
        </div>
        <p className="text-body-lg text-text-secondary max-w-2xl">
          {categoryMeta.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar (Left side, only ≥1025px) */}
        <aside className="hidden lg:block lg:col-span-1 bg-surface border border-border rounded-xl p-6 h-fit shadow-sm">
          {renderFiltersContent()}
        </aside>

        {/* Products Display (Right side / full-width on mobile) */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar: Mobile Filters button, Sort dropdown, Active Chips */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              
              {/* Mobile Filter Trigger Button (hidden on desktop) */}
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden bg-surface hover:bg-primary-tint-10 text-text border border-border text-button px-4 py-2.5 rounded-md flex items-center gap-2 shadow-sm transition-all focus-visible:ring-4 focus-visible:ring-primary-light"
              >
                <SlidersHorizontal className="w-4 h-4 text-text-secondary" />
                <span>Filters {activeChips.length > 0 && `(${activeChips.length})`}</span>
              </button>

              <div className="hidden lg:block" />

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 ml-auto">
                <label htmlFor="sort-select" className="text-body-sm text-text-secondary font-medium whitespace-nowrap">
                  Sort by
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface border border-border rounded-sm py-2 px-3 text-body-md outline-none focus:border-primary focus:ring-4 focus:ring-primary-light"
                >
                  <option value="featured">Featured / Rating</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

            </div>

            {/* Active Filters Chips Bar */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-body-sm text-text-secondary font-semibold">Active filters:</span>
                {activeChips.map((chip, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-primary-light text-primary text-body-sm font-semibold pl-2.5 pr-1.5 py-1 border border-primary/20 rounded-full"
                  >
                    <span>{chip.label}</span>
                    <button
                      onClick={() => handleRemoveChip(chip)}
                      className="text-primary hover:text-primary-hover p-0.5 rounded-full hover:bg-black/5"
                      aria-label={`Remove filter ${chip.label}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={handleResetAll}
                  className="text-body-sm text-primary hover:text-primary-hover hover:underline font-semibold ml-2"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Product Grid */}
          {paginatedProducts.length === 0 ? (
            <EmptyState
              type="filter"
              actionText="Reset Filters"
              onActionClick={handleResetAll}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 pt-8" aria-label="Pagination Navigation">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = currentPage === pageNum;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-full font-body text-body-md font-semibold border flex items-center justify-center transition-all focus-visible:ring-4 focus-visible:ring-primary-light ${
                      isActive
                        ? "bg-primary border-primary text-white shadow-sm"
                        : "bg-surface border-border text-text hover:bg-primary-tint-10"
                    }`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </nav>
          )}

        </main>
      </div>

      {/* Mobile Drawer Slide-up (Scrim overlay & sliding pane, matching modal tokens) */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center">
          
          {/* Overlay scrim */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="absolute inset-0 bg-overlay transition-opacity duration-slow"
          />

          {/* Sliding pane */}
          <div className="relative w-full max-h-[85vh] bg-surface rounded-t-xl overflow-y-auto p-6 space-y-6 shadow-xl z-10 transition-transform duration-slow transform translate-y-0 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-heading-md text-text font-bold">Filter Products</h3>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="text-text-muted hover:text-text p-1.5 rounded-full hover:bg-black/5"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="py-2">
              {renderFiltersContent()}
            </div>

            <div className="pt-4 border-t border-border">
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-button py-3.5 rounded-md shadow-md focus-visible:ring-4 focus-visible:ring-primary-light"
              >
                Apply Filters ({processedProducts.length} items)
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
