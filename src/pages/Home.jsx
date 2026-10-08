import React from "react";
import { Link, useNavigate } from "react-router-dom";
import productsData from "../data/products.json";
import ProductCard from "../components/ProductCard";
import { 
  Shirt, 
  Pill, 
  Laptop, 
  Sparkles, 
  Apple, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Heart,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  // Get 4 featured products (highest rating)
  const featuredProducts = [...productsData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  // Get 4 quick commerce essentials (Pharmacy + Grocery)
  const quickEssentials = productsData
    .filter((p) => p.categorySlug === "pharmacy" || p.categorySlug === "grocery")
    .slice(0, 4);

  // Get 4 clothing products specifically
  const clothingProducts = productsData
    .filter((p) => p.categorySlug === "clothing")
    .slice(0, 4);

  // Get 4 electronics products specifically
  const electronicsProducts = productsData
    .filter((p) => p.categorySlug === "electronics")
    .slice(0, 4);

  // Get 4 cosmetics products specifically
  const cosmeticsProducts = productsData
    .filter((p) => p.categorySlug === "cosmetics")
    .slice(0, 4);

  const categories = [
    { name: "Clothing", slug: "clothing", desc: "Organic linen & cotton", icon: Shirt, color: "bg-[#F3EFE3] text-[#8C7A56]" },
    { name: "Pharmacy", slug: "pharmacy", desc: "Clinically backed herbs", icon: Pill, color: "bg-[#E6ECE6] text-[#4C8A5E]" },
    { name: "Electronics", slug: "electronics", desc: "Eco-friendly accessories", icon: Laptop, color: "bg-[#EAECEE] text-[#566573]" },
    { name: "Cosmetics", slug: "cosmetics", desc: "Pure botanical skincare", icon: Sparkles, color: "bg-[#F7EAE8] text-[#B36F62]" },
    { name: "Grocery", slug: "grocery", desc: "Raw honeys & cold oils", icon: Apple, color: "bg-[#EEF2E3] text-[#6B8E23]" },
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. DISCOUNTS & OFFERS GRID (FIRST) */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Flat ₹500 off */}
          <div className="bg-gradient-to-br from-primary-light to-primary-tint-10 border border-primary-light p-6 rounded-xl relative overflow-hidden flex flex-col justify-between h-44 shadow-sm group hover:shadow-md transition-shadow">
            <div className="space-y-1">
              <span className="bg-primary text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide">
                Special Deal
              </span>
              <h3 className="text-heading-md text-text font-bold mt-2">Flat ₹500 Discount</h3>
              <p className="text-body-sm text-text-secondary leading-tight">On purchases over ₹2,000 across the store.</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <code className="bg-surface text-primary border border-primary-light font-mono font-bold text-xs px-2.5 py-1 rounded">
                UNICART10
              </code>
              <span className="text-xs text-text-muted font-medium">Use code at checkout</span>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-110 transition-transform" />
          </div>

          {/* Card 2: 10% Off Welcome offer */}
          <div className="bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border border-[#FDE68A] p-6 rounded-xl relative overflow-hidden flex flex-col justify-between h-44 shadow-sm group hover:shadow-md transition-shadow">
            <div className="space-y-1">
              <span className="bg-[#D97706] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide">
                Welcome Offer
              </span>
              <h3 className="text-heading-md text-text font-bold mt-2">Extra 10% Off</h3>
              <p className="text-body-sm text-text-secondary leading-tight">Save on your first order. No minimum spend required.</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <code className="bg-surface text-[#B45309] border border-[#FDE68A] font-mono font-bold text-xs px-2.5 py-1 rounded">
                WELCOME10
              </code>
              <span className="text-xs text-text-muted font-medium">New users only</span>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#D97706]/5 rounded-full group-hover:scale-110 transition-transform" />
          </div>

          {/* Card 3: Free Shipping */}
          <div className="bg-gradient-to-br from-[#EEF2F6] to-[#E2E8F0] border border-[#CBD5E1] p-6 rounded-xl relative overflow-hidden flex flex-col justify-between h-44 shadow-sm group hover:shadow-md transition-shadow">
            <div className="space-y-1">
              <span className="bg-text text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide">
                Free Delivery
              </span>
              <h3 className="text-heading-md text-text font-bold mt-2">Orders Above ₹1,000</h3>
              <p className="text-body-sm text-text-secondary leading-tight">Eligible for free standard shipping automatically.</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-body-sm font-bold text-text flex items-center gap-1">
                ⚡ 10-Min items included
              </span>
              <span className="text-xs text-text-muted font-medium">Standard shipping: ₹70</span>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-text/5 rounded-full group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES CHIPS RIBBON (SECOND) */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-4">
        <h2 className="text-heading-sm text-text font-bold uppercase tracking-wider">Quick Shop Categories</h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-3 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isQuick = cat.slug === "grocery" || cat.slug === "pharmacy";
            return (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-surface border border-border hover:border-primary rounded-full shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 group focus-visible:ring-4 focus-visible:ring-primary-light"
              >
                <div className={`w-8 h-8 rounded-full ${cat.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-body-sm font-bold text-text group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                  {isQuick && (
                    <span className="text-[9px] text-[#D97706] font-black uppercase tracking-wide flex items-center gap-0.5">
                      ⚡ 10 mins
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. SUGGESTED ITEMS & QUICK-COMMERCE RAILS (THIRD) */}
      
      {/* 3a. Quick Essentials: Zepto/Blinkit Style 10-Min Delivery */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-6">
        <div className="bg-gradient-to-r from-[#FEF3C7] to-[#FFFBEB] border border-[#FDE68A] p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <span className="bg-[#D97706] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1 w-max animate-pulse">
              ⚡ Instant Dispatch
            </span>
            <h2 className="text-display-md text-text font-display font-medium">Quick Essentials (10 Mins)</h2>
            <p className="text-body-md text-text-secondary">Organic produce and daily medical essentials delivered to your doorstep in minutes.</p>
          </div>
          <button
            onClick={() => navigate("/category/pharmacy")}
            className="bg-[#D97706] hover:bg-[#B45309] text-white text-button py-2.5 px-5 rounded-md shadow-sm transition-colors flex items-center gap-2 self-start md:self-auto"
          >
            <span>Browse Quick Items</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {quickEssentials.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3b. High-Rating Favorites */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-label text-primary font-semibold">Featured Collection</span>
            <h2 className="text-display-md text-text font-display font-medium mt-1">High-Rating Favorites</h2>
          </div>
          <Link
            to="/category/all"
            className="hidden sm:inline-flex items-center gap-1.5 text-body-md font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3c. Clothing Products */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-label text-primary font-semibold">Eco Apparel</span>
            <h2 className="text-display-md text-text font-display font-medium mt-1">New Clothing Arrivals</h2>
          </div>
          <Link
            to="/category/clothing"
            className="inline-flex items-center gap-1.5 text-body-md font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <span>Browse Clothing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clothingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3d. Cosmetics Products */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-label text-primary font-semibold">Clean Living</span>
            <h2 className="text-display-md text-text font-display font-medium mt-1">Nourishing Botanical Cosmetics</h2>
          </div>
          <Link
            to="/category/cosmetics"
            className="inline-flex items-center gap-1.5 text-body-md font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <span>Browse Cosmetics</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cosmeticsProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust Strip */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-surface border border-border p-6 lg:p-8 rounded-xl shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-light text-primary rounded-full">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-heading-sm text-text font-semibold mb-1">Carbon Neutral Delivery</h4>
              <p className="text-body-sm text-text-secondary">Free shipping on orders over ₹1,000</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-light text-primary rounded-full">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-heading-sm text-text font-semibold mb-1">Verified Clinical Sellers</h4>
              <p className="text-body-sm text-text-secondary">100% lab-certified pharmacy standard</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-light text-primary rounded-full">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-heading-sm text-text font-semibold mb-1">Simple Returns</h4>
              <p className="text-body-sm text-text-secondary">30-day stress-free returns policy</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-light text-primary rounded-full">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-heading-sm text-text font-semibold mb-1">Sustainably Harvested</h4>
              <p className="text-body-sm text-text-secondary">B-Corp certified organic partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Banner (3-Card) */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-8">
        <div className="text-center max-w-lg mx-auto">
          <span className="text-label text-primary font-semibold">Customer Stories</span>
          <h2 className="text-display-md text-text font-display font-medium mt-1">Why customers trust Unicart</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
            <div className="text-warning text-lg">★★★★★</div>
            <p className="text-body-md text-text italic">
              "Buying linen shirts together with my herbal supplements and early harvest Cretan olive oil saves me so much packaging and delivery hassle. Unicart's unified cart is a game changer."
            </p>
            <div className="font-semibold text-body-sm text-text-secondary">— Dr. Katherine M., Botanist</div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
            <div className="text-warning text-lg">★★★★★</div>
            <p className="text-body-md text-text italic">
              "I love the clean aesthetic and the focus on organic items. There are no flash discount banners popping up. The focus rings and design make checkout calm and keyboard-friendly."
            </p>
            <div className="font-semibold text-body-sm text-text-secondary">— Sam L., Design Consultant</div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
            <div className="text-warning text-lg">★★★★★</div>
            <p className="text-body-md text-text italic">
              "Their KSM-66 Ashwagandha is lab-verified, and the eco-friendly wooden wireless charger actually supports 15W Qi2 alignment. Outstanding quality and eco commitment."
            </p>
            <div className="font-semibold text-body-sm text-text-secondary">— Julia R., Fitness Coach</div>
          </div>
        </div>
      </section>

    </div>
  );
}
