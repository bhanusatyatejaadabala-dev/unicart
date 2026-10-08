import React, { useRef, useState, useEffect } from 'react';
import { 
  PanelLeft, 
  ChevronLeft, 
  ChevronRight, 
  Monitor, 
  RotateCw, 
  Share, 
  Plus, 
  Copy,
  Search,
  User,
  Package,
  ShoppingCart,
  Shirt,
  Pill,
  Laptop,
  Sparkles,
  Apple,
  Zap,
  ArrowRight,
  Tag
} from 'lucide-react';

// ResizeObserver-based wrapper that renders content at 1000px and scales down dynamically
export const ScaledMockup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | string>('auto');

  useEffect(() => {
    if (!containerRef.current || !innerRef.current) return;

    const handleResize = () => {
      if (!containerRef.current || !innerRef.current) return;
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const targetWidth = 1000;
      const newScale = containerWidth / targetWidth;
      setScale(newScale);

      const innerHeight = innerRef.current.offsetHeight;
      setHeight(innerHeight * newScale);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);
    
    // Also observe the inner elements to adjust if layout sizes shift
    observer.observe(innerRef.current);

    // Initial trigger
    handleResize();

    // Delay a bit to handle image load height calculations
    const timeout = setTimeout(handleResize, 150);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full relative overflow-hidden transition-all duration-300" 
      style={{ height }}
    >
      <div 
        ref={innerRef} 
        className="absolute top-0 left-0 w-[1000px] origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
};

export const ProductMockup: React.FC = () => {
  return (
    <ScaledMockup>
      {/* Mockup Chrome (Browser Frame) */}
      <div className="rounded-t-2xl overflow-hidden bg-[#1a1a1c] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10 text-left w-full">
        {/* Title Bar */}
        <div className="bg-[#242427] border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
          {/* Traffic Lights & Nav Buttons */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex items-center gap-2.5 ml-2">
              <PanelLeft className="w-3.5 h-3.5 text-white/40 cursor-pointer hover:text-white/75 transition-colors" />
              <ChevronLeft className="w-3.5 h-3.5 text-white/40 cursor-pointer hover:text-white/75 transition-colors" />
              <ChevronRight className="w-3.5 h-3.5 text-white/40 cursor-pointer hover:text-white/75 transition-colors" />
            </div>
          </div>

          {/* URL Pill */}
          <div className="bg-[#1a1a1c] rounded-md px-6 py-1 text-[10px] text-white/60 flex items-center gap-1.5 mx-auto w-72 justify-center font-sans tracking-wide">
            <Monitor className="w-3 h-3 text-white/40" />
            <span>unicart.in</span>
          </div>

          {/* Right Side Browser Utilities */}
          <div className="flex items-center gap-3">
            <RotateCw className="w-3.5 h-3.5 text-white/40 cursor-pointer hover:text-white/75 transition-colors" />
            <Share className="w-3.5 h-3.5 text-white/40 cursor-pointer hover:text-white/75 transition-colors" />
            <Plus className="w-3.5 h-3.5 text-white/40 cursor-pointer hover:text-white/75 transition-colors" />
            <Copy className="w-3.5 h-3.5 text-white/40 cursor-pointer hover:text-white/75 transition-colors" />
          </div>
        </div>

        {/* Page Content inside the Frame */}
        <div className="bg-cream p-8 font-sans select-none">
          
          {/* Internal Navbar */}
          <div className="bg-white rounded-full shadow-sm px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <span className="font-display font-semibold text-ink text-lg tracking-tight">Unicart</span>
            
            {/* Center nav */}
            <div className="flex items-center gap-4 text-xs font-semibold text-ink/70">
              <span className="hover:text-ink cursor-pointer">Clothing</span>
              <span className="text-ink/30">•</span>
              <span className="hover:text-ink cursor-pointer">Pharmacy</span>
              <span className="text-ink/30">•</span>
              <span className="hover:text-ink cursor-pointer">Electronics</span>
              <span className="text-ink/30">•</span>
              <span className="hover:text-ink cursor-pointer">Cosmetics</span>
              <span className="text-ink/30">•</span>
              <span className="hover:text-ink cursor-pointer">Grocery</span>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-xs mx-6">
              <input 
                type="text" 
                placeholder="Search items..." 
                disabled
                className="w-full rounded-full bg-cream px-4 py-2 pr-10 text-xs text-ink placeholder-ink/40 pointer-events-none border border-transparent" 
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ink text-white flex items-center justify-center">
                <Search className="w-3 h-3" />
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-ink/70 cursor-pointer hover:text-ink transition-colors" />
              <Package className="w-5 h-5 text-ink/70 cursor-pointer hover:text-ink transition-colors" />
              <div className="relative cursor-pointer hover:opacity-85 transition-opacity">
                <ShoppingCart className="w-5 h-5 text-ink/70" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-olive text-white text-[9px] flex items-center justify-center font-bold">4</span>
              </div>
            </div>
          </div>

          {/* Deal Cards Row */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            
            {/* Card 1: Sage */}
            <div className="rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-[210px] bg-[#DCE8D0] shadow-sm">
              {/* Background circles overlay */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/20 pointer-events-none" />
              <div className="absolute -bottom-12 -right-2 w-20 h-20 rounded-full bg-white/30 pointer-events-none" />
              
              <div>
                <span className="bg-[#1F3D26] text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase w-max block">
                  SPECIAL DEAL
                </span>
                <h3 className="font-display text-xl font-semibold text-ink mt-3">
                  Flat ₹500 Discount
                </h3>
                <p className="text-xs text-ink/70 mt-1 leading-relaxed">
                  On purchases over ₹2,000 across the store.
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 z-10">
                <span className="bg-white ring-1 ring-ink/15 text-xs font-semibold px-2 py-1 rounded-md text-ink">
                  UNICART10
                </span>
                <span className="text-[10px] text-ink/50 font-medium">
                  Use code at checkout
                </span>
              </div>
            </div>

            {/* Card 2: Pale Yellow */}
            <div className="rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-[210px] bg-[#FBEFC6] shadow-sm">
              {/* Background circles overlay */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/20 pointer-events-none" />
              <div className="absolute -bottom-12 -right-2 w-20 h-20 rounded-full bg-white/30 pointer-events-none" />

              <div>
                <span className="bg-[#D9782A] text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase w-max block">
                  WELCOME OFFER
                </span>
                <h3 className="font-display text-xl font-semibold text-ink mt-3">
                  Extra 10% Off
                </h3>
                <p className="text-xs text-ink/70 mt-1 leading-relaxed">
                  Save on your first order. No minimum spend required.
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 z-10">
                <span className="bg-white ring-1 ring-ink/15 text-xs font-semibold px-2 py-1 rounded-md text-[#D9782A]">
                  WELCOME10
                </span>
                <span className="text-[10px] text-ink/50 font-medium">
                  New users only
                </span>
              </div>
            </div>

            {/* Card 3: Pale Blue */}
            <div className="rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-[210px] bg-[#DCE3ED] shadow-sm">
              <div>
                <span className="bg-ink text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase w-max block">
                  FREE DELIVERY
                </span>
                <h3 className="font-display text-xl font-semibold text-ink mt-3">
                  Orders Above ₹1,000
                </h3>
                <p className="text-xs text-ink/70 mt-1 leading-relaxed">
                  Eligible for free standard shipping automatically.
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 z-10">
                <span className="text-xs text-ink/80 flex items-center gap-1 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-[#D9782A] fill-[#D9782A]" />
                  10-Min items included
                </span>
                <span className="text-[10px] text-ink/50 font-medium">
                  Standard shipping: ₹70
                </span>
              </div>
            </div>
          </div>

          {/* Quick Shop Categories */}
          <div className="mt-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink/85 mb-3">
              QUICK SHOP CATEGORIES
            </h4>
            <div className="grid grid-cols-5 gap-3">
              
              {/* Clothing */}
              <div className="rounded-full bg-white ring-1 ring-ink/10 shadow-sm px-4 py-2 flex items-center gap-2.5 hover:ring-ink/20 transition-all cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-ink/5 flex items-center justify-center text-ink">
                  <Shirt className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-ink">Clothing</span>
              </div>

              {/* Pharmacy */}
              <div className="rounded-full bg-white ring-1 ring-ink/10 shadow-sm px-4 py-1.5 flex items-center gap-2.5 hover:ring-ink/20 transition-all cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-olive-light flex items-center justify-center text-olive">
                  <Pill className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-ink leading-tight">Pharmacy</span>
                  <span className="text-[8px] text-[#D9782A] font-bold flex items-center gap-0.5 mt-0.5 leading-none">
                    ⚡ 10 MINS
                  </span>
                </div>
              </div>

              {/* Electronics */}
              <div className="rounded-full bg-white ring-1 ring-ink/10 shadow-sm px-4 py-2 flex items-center gap-2.5 hover:ring-ink/20 transition-all cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-ink/5 flex items-center justify-center text-ink">
                  <Laptop className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-ink">Electronics</span>
              </div>

              {/* Cosmetics */}
              <div className="rounded-full bg-white ring-1 ring-ink/10 shadow-sm px-4 py-2 flex items-center gap-2.5 hover:ring-ink/20 transition-all cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-pink-100/70 flex items-center justify-center text-pink-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-ink">Cosmetics</span>
              </div>

              {/* Grocery */}
              <div className="rounded-full bg-white ring-1 ring-ink/10 shadow-sm px-4 py-1.5 flex items-center gap-2.5 hover:ring-ink/20 transition-all cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-olive-light flex items-center justify-center text-olive">
                  <Apple className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-ink leading-tight">Grocery</span>
                  <span className="text-[8px] text-[#D9782A] font-bold flex items-center gap-0.5 mt-0.5 leading-none">
                    ⚡ 10 MINS
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Essentials Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#FCEFC0] to-[#FBE0A0] p-8 mt-6 flex items-center justify-between shadow-sm">
            <div className="flex flex-col items-start gap-2">
              <span className="bg-[#D9782A] text-white text-[9px] font-bold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 tracking-wider">
                <Zap className="w-3 h-3 fill-white" />
                INSTANT DISPATCH
              </span>
              <h3 className="font-display text-2xl font-semibold text-ink mt-1">
                Quick Essentials (10 Mins)
              </h3>
              <p className="text-xs text-ink/75 max-w-md mt-0.5 leading-relaxed">
                Organic produce and daily medical essentials delivered to your doorstep in minutes.
              </p>
            </div>
            
            <button className="bg-[#D9782A] hover:bg-[#C4691F] active:bg-[#B05B17] text-white text-xs font-semibold px-5 py-3 rounded-full flex items-center gap-2 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
              Browse Quick Items
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Product Grid Teaser */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            
            {/* Card 1: Apparel (Linen Shirt) */}
            <div className="rounded-xl overflow-hidden relative aspect-square bg-[#eceae6] group cursor-pointer shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80" 
                alt="Premium Linen Shirt" 
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-ink/5 pointer-events-none" />
              <span className="absolute top-2.5 right-2.5 bg-white/90 text-ink text-[9px] font-bold px-2 py-1 rounded-full shadow-sm z-10">
                10 MINS
              </span>
            </div>

            {/* Card 2: Skincare Bottle (With SALE tag) */}
            <div className="rounded-xl overflow-hidden relative aspect-square bg-[#eae8e4] group cursor-pointer shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1608248597481-496100c80836?w=400&q=80" 
                alt="Luxury Skincare Oil" 
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-ink/5 pointer-events-none" />
              <span className="absolute top-2.5 left-2.5 bg-[#1F3D26] text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
                <Tag className="w-2.5 h-2.5" />
                SALE
              </span>
              <span className="absolute top-2.5 right-2.5 bg-white/90 text-ink text-[9px] font-bold px-2 py-1 rounded-full shadow-sm z-10">
                10 MINS
              </span>
            </div>

            {/* Card 3: Beverage Bottle */}
            <div className="rounded-xl overflow-hidden relative aspect-square bg-[#edebe7] group cursor-pointer shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" 
                alt="Refreshing Beverage" 
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-ink/5 pointer-events-none" />
              <span className="absolute top-2.5 right-2.5 bg-white/90 text-ink text-[9px] font-bold px-2 py-1 rounded-full shadow-sm z-10">
                10 MINS
              </span>
            </div>

            {/* Card 4: Bamboo Toothbrushes */}
            <div className="rounded-xl overflow-hidden relative aspect-square bg-[#ebeae6] group cursor-pointer shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&q=80" 
                alt="Organic Toothbrushes" 
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-ink/5 pointer-events-none" />
              <span className="absolute top-2.5 right-2.5 bg-white/90 text-ink text-[9px] font-bold px-2 py-1 rounded-full shadow-sm z-10">
                10 MINS
              </span>
            </div>

          </div>

        </div>
      </div>
    </ScaledMockup>
  );
};

export default ProductMockup;
