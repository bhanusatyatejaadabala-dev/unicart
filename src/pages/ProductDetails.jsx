import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import productsData from "../data/products.json";
import { useCart } from "../context/CartContext";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductCard from "../components/ProductCard";
import QuantityStepper from "../components/QuantityStepper";
import VariantSelector from "../components/VariantSelector";
import Badge from "../components/Badge";
import { ShoppingBag, CreditCard, ChevronRight, Heart, Share2, Shield, Truck, RotateCcw } from "lucide-react";

function getProductImages(product) {
  if (!product) return [];
  const main = product.image;
  
  // Use unique gallery images defined in products.json if available
  if (product.gallery && Array.isArray(product.gallery) && product.gallery.length > 0) {
    return [main, ...product.gallery];
  }
  
  const title = product.title.toLowerCase();
  
  if (title.includes("jeans") || title.includes("denim") || title.includes("jacket")) {
    return [
      main,
      "https://images.unsplash.com/photo-1582552938357-32b906df43cd?w=600&auto=format&fit=crop&q=80", // folded denim jeans
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&auto=format&fit=crop&q=80"  // denim sewing details
    ];
  }
  
  if (title.includes("shoe") || title.includes("sneaker")) {
    return [
      main,
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&auto=format&fit=crop&q=80", // sneaker sole view
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80"  // sneaker side close up
    ];
  }
  
  if (title.includes("socks")) {
    return [
      main,
      "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80", // cotton athletic socks
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80"  // crew sport socks
    ];
  }
  
  if (title.includes("boxer") || title.includes("shorts")) {
    return [
      main,
      "https://images.unsplash.com/photo-1618677831708-0e7fda3148b4?w=600&auto=format&fit=crop&q=80", // boxer details
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop&q=80"  // lounge shorts fabric
    ];
  }

  if (title.includes("kurta") || title.includes("kurti") || title.includes("suit")) {
    return [
      main,
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80", // printed fabric close up
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80"  // handloom thread close up
    ];
  }

  if (product.categorySlug === "clothing") {
    // Other shirts, cardigans, blazers, hoodies
    return [
      main,
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80", // boutique shirts on racks
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&auto=format&fit=crop&q=80"  // fabric folds detail
    ];
  }

  if (product.categorySlug === "pharmacy") {
    return [
      main,
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80", // organic tablets
      "https://images.unsplash.com/photo-1607619056574-7b8f304b3b89?w=600&auto=format&fit=crop&q=80"  // clinical capsules
    ];
  }

  if (product.categorySlug === "cosmetics") {
    return [
      main,
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80", // organic cream
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80"  // glass dropper bottle details
    ];
  }

  if (product.categorySlug === "grocery") {
    return [
      main,
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80", // botanical spices display
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80"  // organic beans and grains
    ];
  }

  if (product.categorySlug === "electronics") {
    return [
      main,
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80", // metallic grid texture
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"  // audio components/headphones close-up
    ];
  }

  return [
    main,
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&auto=format&fit=crop&q=80"
  ];
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, triggerToast } = useCart();
  const mainBtnRef = useRef(null);

  // Retrieve current product
  const product = useMemo(() => {
    return productsData.find((p) => p.id === id);
  }, [id]);

  // Handle product not found
  useEffect(() => {
    if (!product) {
      triggerToast("Product not found.", "error");
      navigate("/category/all");
    }
  }, [product, navigate, triggerToast]);

  if (!product) return null;

  // Variant selector states
  const [selectedVariant, setSelectedVariant] = useState("");
  useEffect(() => {
    if (product?.attributes?.values) {
      setSelectedVariant(product.attributes.values[0]);
    } else {
      setSelectedVariant("");
    }
  }, [product]);

  // Stepper State
  const [quantity, setQuantity] = useState(1);

  // Image gallery states
  const [activeImage, setActiveImage] = useState(product?.image || "");
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setQuantity(1);
    }
  }, [product]);

  // Extra mock images for thumbnail gallery strip
  const images = useMemo(() => {
    return getProductImages(product);
  }, [product]);

  // Tab selections
  const [activeTab, setActiveTab] = useState("description"); // description, specs, reviews, shipping

  // Sticky add-to-cart scroll listener for mobile
  const [showStickyBar, setShowStickyBar] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (!mainBtnRef.current) return;
      const rect = mainBtnRef.current.getBoundingClientRect();
      // Show sticky bar once the main add button scrolls out of the viewport (top of button <= 0)
      if (rect.bottom < 0) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Related products (same category, excluding current product)
  const relatedProducts = useMemo(() => {
    return productsData
      .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    navigate("/checkout");
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const breadcrumbItems = [
    { label: product.category, url: `/category/${product.categorySlug}` },
    { label: product.title, url: `/product/${product.id}` }
  ];

  // Ratings calculation details
  const reviewCount = product.reviews ? product.reviews.length : 0;
  const ratingAverage = product.rating;

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pb-16 relative">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-4">
        
        {/* Left Side: Image Gallery (lg:span-6) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Image Viewer with hover zoom */}
          <div className="aspect-square bg-white border border-border rounded-xl overflow-hidden shadow-sm relative group">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-slow ease-default group-hover:scale-105"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-primary text-white text-label px-3 py-1 rounded-sm shadow-md font-bold">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`aspect-square w-20 bg-white border rounded-lg overflow-hidden shrink-0 transition-all duration-fast ${
                  activeImage === img
                    ? "ring-2 ring-primary border-primary shadow-sm"
                    : "border-border hover:border-border-strong"
                }`}
                aria-label={`View thumbnail ${idx + 1}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>

        {/* Right Side: Product Info Panel (lg:span-6) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            
            {/* Category tag & Brand */}
            <div className="flex items-center justify-between text-body-sm text-text-secondary font-medium">
              <span>{product.brand}</span>
              <span className="text-label text-primary font-bold">{product.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-heading-lg md:text-3xl text-text font-semibold font-body tracking-tight">
              {product.title}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-warning text-sm">
                {"★".repeat(Math.round(ratingAverage))}
                {"☆".repeat(5 - Math.round(ratingAverage))}
              </div>
              <span className="text-body-sm font-semibold text-text">
                {ratingAverage.toFixed(1)} / 5.0
              </span>
              <span className="text-text-muted text-body-sm">|</span>
              <a href="#reviews-tabs" onClick={() => setActiveTab("reviews")} className="text-body-sm text-text-secondary hover:text-primary hover:underline">
                {reviewCount} {reviewCount === 1 ? "Review" : "Reviews"}
              </a>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 pt-1">
              <Badge status={product.stockStatus} count={product.stockCount} />
              {hasDiscount && <Badge status="sale" text={`Save ₹${(product.originalPrice - product.price).toLocaleString("en-IN")}`} />}
            </div>

          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-primary-tint-10/50 border border-primary-light/40 rounded-xl flex items-baseline gap-3">
            <span className="text-price-lg text-text font-bold">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-body-lg text-text-secondary line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-body-md text-text-secondary leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selector */}
          {product.attributes && product.attributes.values && (
            <div className="border-t border-border pt-4">
              <VariantSelector
                label={product.attributes.type}
                options={product.attributes.values}
                selectedOption={selectedVariant}
                onSelect={(val) => setSelectedVariant(val)}
              />
            </div>
          )}

          {/* Quantity Stepper & Buttons */}
          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              
              {/* Stepper */}
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <span className="text-label text-text-secondary font-semibold">Quantity</span>
                <QuantityStepper
                  quantity={quantity}
                  onChange={(q) => setQuantity(q)}
                  maxStock={product.stockCount || 99}
                  size="md"
                />
              </div>

              {/* Actions */}
              <div className="flex-1 flex gap-3">
                <button
                  ref={mainBtnRef}
                  onClick={handleAddToCart}
                  disabled={product.stockStatus === "out-of-stock"}
                  className="flex-1 bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-button py-3 px-6 rounded-md shadow-sm transition-all duration-fast flex items-center justify-center gap-2 focus-visible:ring-4 focus-visible:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={product.stockStatus === "out-of-stock"}
                  className="flex-1 bg-surface hover:bg-primary-tint-10 text-primary border border-primary text-button py-3 px-6 rounded-md transition-all duration-fast flex items-center justify-center gap-2 focus-visible:ring-4 focus-visible:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>

            </div>
          </div>

          {/* Express Delivery Banner for Quick-Commerce */}
          {(product.categorySlug === "grocery" || product.categorySlug === "pharmacy") && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 flex items-center gap-3.5 mt-4">
              <div className="bg-[#FACC15] text-[#1E293B] rounded-full w-10 h-10 flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
                ⚡
              </div>
              <div>
                <h4 className="text-body-md font-bold text-[#92400E]">Instant Express Delivery</h4>
                <p className="text-body-sm text-[#B45309]">This fresh essential is dispatched instantly and will arrive in <span className="font-bold">10-15 minutes</span>!</p>
              </div>
            </div>
          )}

          {/* Value Prop Icons Strip */}
          <div className="grid grid-cols-3 gap-4 border-t border-border pt-6 text-center text-body-sm text-text-secondary">
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-surface border border-border">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold">Lab Verified</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-surface border border-border">
              <Truck className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                {product.categorySlug === "grocery" || product.categorySlug === "pharmacy" ? "10-Min Delivery" : "Eco Delivery"}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-surface border border-border">
              <RotateCcw className="w-5 h-5 text-primary" />
              <span className="font-semibold">30d Return</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Layout Section */}
      <section id="reviews-tabs" className="mt-16 border-t border-border pt-8">
        
        {/* Headers */}
        <div className="flex border-b border-border gap-6 overflow-x-auto no-scrollbar" role="tablist">
          {[
            { id: "description", label: "Description" },
            { id: "specs", label: "Specifications" },
            { id: "reviews", label: `Reviews (${reviewCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-body-md font-semibold tracking-wide border-b-2 transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary-light p-1 rounded-sm ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="py-6">
          
          {activeTab === "description" && (
            <div className="space-y-4 max-w-3xl animate-fade-in">
              <h3 className="text-heading-md text-text">Organic Details & Sourcing</h3>
              <p className="text-body-md text-text-secondary leading-relaxed">
                Our {product.title} is designed keeping environmental footprint and therapeutic effectiveness at the core. Every batch is tracked from seed extraction or composite assembly down to delivery.
              </p>
              <p className="text-body-md text-text-secondary leading-relaxed">
                By purchasing from {product.brand}, you contribute to global agricultural cooperatives and localized supply chains that ensure fair worker wages and eco-restorative commitments.
              </p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-xl animate-fade-in">
              <h3 className="text-heading-md text-text mb-4">Product Specifications</h3>
              <div className="border border-border rounded-lg overflow-hidden bg-surface divide-y divide-border shadow-sm">
                
                {/* Standard specs */}
                <div className="grid grid-cols-2 p-3 text-body-md">
                  <span className="text-text-secondary font-medium">Brand</span>
                  <span className="text-text font-semibold">{product.brand}</span>
                </div>
                <div className="grid grid-cols-2 p-3 text-body-md">
                  <span className="text-text-secondary font-medium">Category</span>
                  <span className="text-text font-semibold">{product.category}</span>
                </div>
                
                {/* Custom spec attributes mapping */}
                {product.attributes && product.attributes.details && (
                  Object.entries(product.attributes.details).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-2 p-3 text-body-md">
                      <span className="text-text-secondary font-medium">{key}</span>
                      <span className="text-text font-semibold">{val}</span>
                    </div>
                  ))
                )}

              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8 max-w-3xl animate-fade-in">
              
              {/* Ratings Summary grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-primary-tint-10/40 p-6 rounded-xl border border-primary-light/40">
                <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-border">
                  <span className="text-5xl font-bold text-text font-body">{ratingAverage.toFixed(1)}</span>
                  <div className="flex items-center text-warning text-lg my-1.5">
                    {"★".repeat(Math.round(ratingAverage))}
                    {"☆".repeat(5 - Math.round(ratingAverage))}
                  </div>
                  <span className="text-body-sm text-text-secondary font-semibold">Average rating ({reviewCount} reviews)</span>
                </div>
                
                {/* Rating bars */}
                <div className="col-span-2 space-y-2 flex flex-col justify-center">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = product.reviews ? product.reviews.filter((r) => r.rating === stars).length : 0;
                    const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-3 text-body-sm">
                        <span className="w-12 text-text-secondary font-medium">{stars} Stars</span>
                        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-text-secondary text-right font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Cards list */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev, idx) => (
                    <div key={idx} className="bg-surface border border-border p-5 rounded-lg shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-body-md text-text">{rev.name}</span>
                        <span className="text-body-sm text-text-muted">{rev.date}</span>
                      </div>
                      <div className="flex items-center text-warning text-xs">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </div>
                      <p className="text-body-md text-text-secondary">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-body-md text-text-secondary">No reviews yet for this product. Be the first to share your thoughts!</p>
                )}
              </div>

            </div>
          )}

        </div>

      </section>

      {/* Related Products Rail */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-border pt-12 space-y-6">
          <h2 className="text-display-md text-text font-display font-medium">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add-To-Cart bar (Scroll visible on Mobile) */}
      {showStickyBar && (
        <div className="sm:hidden fixed inset-x-0 bottom-0 bg-surface/95 backdrop-blur-md border-t border-border shadow-xl p-3 z-30 flex items-center justify-between gap-3 animate-slide-up">
          <div className="flex flex-col">
            <span className="text-body-sm font-semibold truncate max-w-[150px]">{product.title}</span>
            <span className="text-price-md text-text">₹{product.price.toLocaleString("en-IN")}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stockStatus === "out-of-stock"}
            className="bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-button py-2.5 px-5 rounded-md shadow-md flex items-center gap-1.5 focus-visible:ring-4 focus-visible:ring-primary-light disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      )}

    </div>
  );
}
