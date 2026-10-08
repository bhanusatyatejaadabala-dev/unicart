import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from './Logo';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="animate-fade-down relative z-25 w-full flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 sm:py-5 bg-transparent">
      {/* Logo */}
      <div className="flex-shrink-0">
        <a href="#home">
          <Logo />
        </a>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <a 
          href="#categories" 
          className="text-[13px] text-ink/80 hover:text-ink font-medium transition-colors flex items-center gap-1"
        >
          Shop
          <ChevronDown className="w-3.5 h-3.5 text-ink/60" />
        </a>
        <a 
          href="#features" 
          className="text-[13px] text-ink/80 hover:text-ink font-medium transition-colors"
        >
          Features
        </a>
        <a 
          href="#testimonials" 
          className="text-[13px] text-ink/80 hover:text-ink font-medium transition-colors"
        >
          Reviews
        </a>
      </div>

      {/* CTA + Hamburger */}
      <div className="flex items-center gap-3">
        <a 
          href="http://localhost:5173/" 
          className="bg-olive text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-olive-hover active:bg-olive-active transition-colors shadow-sm"
        >
          Shop Now
        </a>
        
        {/* Hamburger Menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-ink hover:bg-ink/10 transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute left-4 right-4 top-full mt-2 rounded-2xl bg-white/90 backdrop-blur-xl ring-1 ring-ink/10 px-5 py-3 animate-fade-up z-30 shadow-lg flex flex-col gap-2">
          <a 
            href="#categories"
            onClick={() => setIsOpen(false)}
            className="text-[15px] font-medium text-ink/80 hover:text-ink py-2.5 border-b border-ink/10 transition-colors flex items-center justify-between"
          >
            Shop
            <ChevronDown className="w-4 h-4 text-ink/50" />
          </a>
          <a 
            href="#features"
            onClick={() => setIsOpen(false)}
            className="text-[15px] font-medium text-ink/80 hover:text-ink py-2.5 border-b border-ink/10 transition-colors"
          >
            Features
          </a>
          <a 
            href="#testimonials"
            onClick={() => setIsOpen(false)}
            className="text-[15px] font-medium text-ink/80 hover:text-ink py-2.5 last:border-b-0 transition-colors"
          >
            Reviews
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
