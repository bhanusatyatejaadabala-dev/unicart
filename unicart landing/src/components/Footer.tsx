import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink text-cream pt-20 pb-10 px-5 sm:px-8 lg:px-10 font-sans border-t border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-16 border-b border-white/10">
          
          {/* Logo & Pitch */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <a href="#home">
              <span className="font-display font-semibold text-cream text-2xl tracking-tight">Unicart</span>
            </a>
            <p className="text-xs sm:text-sm text-cream/70 max-w-sm leading-relaxed">
              The next-generation marketplace combining autonomous agent-driven shopping lists with immediate local and standard national delivery fulfillment.
            </p>
            <span className="text-[11px] text-[#FBEFC6] bg-white/10 font-semibold px-3 py-1 rounded-full uppercase tracking-wider mt-2">
              🤖 Agentic Shopper Engine v1.4
            </span>
          </div>

          {/* Site Links */}
          <div className="md:col-span-3 flex flex-col gap-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cream/40">
              Navigation
            </h4>
            <a href="#home" className="text-xs text-cream/80 hover:text-cream transition-colors w-max">
              Back to Top
            </a>
            <a href="#categories" className="text-xs text-cream/80 hover:text-cream transition-colors w-max">
              Shop Categories
            </a>
            <a href="#features" className="text-xs text-cream/80 hover:text-cream transition-colors w-max">
              AI Agent Features
            </a>
            <a href="#testimonials" className="text-xs text-cream/80 hover:text-cream transition-colors w-max">
              Reviews & Stories
            </a>
          </div>

          {/* Categories Shortcuts */}
          <div className="md:col-span-4 flex flex-col gap-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cream/40">
              Our Catalog
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              <a href="#categories" className="text-xs text-cream/80 hover:text-cream transition-colors">Clothing</a>
              <a href="#categories" className="text-xs text-cream/80 hover:text-cream transition-colors">Pharmacy (10m)</a>
              <a href="#categories" className="text-xs text-cream/80 hover:text-cream transition-colors">Electronics</a>
              <a href="#categories" className="text-xs text-cream/80 hover:text-cream transition-colors">Cosmetics</a>
              <a href="#categories" className="text-xs text-cream/80 hover:text-cream transition-colors">Grocery (10m)</a>
            </div>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-[11px] sm:text-xs text-cream/50 gap-4">
          <span>
            © {new Date().getFullYear()} Unicart Technologies Private Limited. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-cream transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-cream transition-colors">Terms of Service</a>
            <a href="#contact" className="hover:text-cream transition-colors">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
