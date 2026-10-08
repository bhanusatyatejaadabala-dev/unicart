import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, Search, User, Menu, X, Package, LogOut } from "lucide-react";

export default function Header() {
  const { cart, triggerToast } = useCart();
  const { currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get total quantity
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const categories = [
    { name: "Clothing", slug: "clothing" },
    { name: "Pharmacy", slug: "pharmacy" },
    { name: "Electronics", slug: "electronics" },
    { name: "Cosmetics", slug: "cosmetics" },
    { name: "Grocery", slug: "grocery" },
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[1400px] z-50">
      <header className="bg-surface/85 backdrop-blur-md border border-border/80 shadow-lg rounded-full px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16 gap-4">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="font-display font-medium text-xl lg:text-2xl text-text hover:text-primary transition-colors flex-shrink-0"
          >
            Unicart
          </Link>

          {/* Desktop Category Navigation */}
          <nav className="hidden lg:flex items-center gap-3">
            {categories.map((cat) => (
              <NavLink
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={({ isActive }) =>
                  `text-body-sm font-semibold tracking-wide py-1.5 px-3 rounded-full transition-all duration-fast ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-text hover:bg-background"
                  }`
                }
              >
                {cat.name}
              </NavLink>
            ))}
          </nav>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-xs xl:max-w-sm relative"
          >
            <input
              type="search"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-full py-1.5 pl-4 pr-10 text-body-sm focus:border-primary focus:ring-4 focus:ring-primary-light transition-all outline-none"
              aria-label="Search items"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors p-1"
              aria-label="Submit search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-text-secondary hover:text-text rounded-md focus-visible:ring-4 focus-visible:ring-primary-light"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Search Trigger Icon */}
            <button
              onClick={() => {
                const search = prompt("Search Unicart:");
                if (search && search.trim()) {
                  navigate(`/category/all?search=${encodeURIComponent(search.trim())}`);
                }
              }}
              className="p-2 md:hidden text-text-secondary hover:text-text rounded-full hover:bg-background transition-colors focus-visible:ring-4 focus-visible:ring-primary-light"
              aria-label="Search products"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Account Icon */}
            <div className="relative">
              <button
                onClick={() => {
                  if (currentUser) {
                    setProfileDropdownOpen(!profileDropdownOpen);
                  } else {
                    navigate("/login");
                  }
                }}
                className={`p-2 rounded-full transition-colors focus-visible:ring-4 focus-visible:ring-primary-light ${
                  currentUser ? "text-primary bg-primary-light/10" : "text-text-secondary hover:text-text hover:bg-background"
                }`}
                aria-label="Account details"
              >
                <User className="w-4 h-4 lg:w-5 h-5" />
              </button>
              
              {/* Profile Dropdown */}
              {profileDropdownOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-lg border border-border py-2 animate-fade-in z-50">
                  <div className="px-4 py-2 border-b border-border/50">
                    <p className="text-body-sm font-medium text-text truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await logout();
                        setProfileDropdownOpen(false);
                        triggerToast('Logged out successfully', 'success');
                        navigate('/');
                      } catch (e) {
                        triggerToast('Failed to log out', 'error');
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-body-sm text-text-secondary hover:text-text hover:bg-background transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Orders Icon */}
            <Link
              to="/orders"
              className="p-2 text-text-secondary hover:text-text rounded-full hover:bg-background transition-colors focus-visible:ring-4 focus-visible:ring-primary-light"
              aria-label="My orders"
            >
              <Package className="w-4 h-4 lg:w-5 h-5" />
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="p-2 text-text-secondary hover:text-text rounded-full hover:bg-background transition-colors relative flex items-center justify-center focus-visible:ring-4 focus-visible:ring-primary-light"
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingCart className="w-4 h-4 lg:w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white font-body text-[9px] leading-none font-semibold w-4 h-4 rounded-full flex items-center justify-center border-2 border-surface shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute left-0 right-0 top-[68px] bg-surface/95 backdrop-blur-md border border-border shadow-lg p-6 rounded-2xl space-y-6 transition-all duration-slow z-50 animate-slide-in">
          <nav className="flex flex-col gap-4">
            <span className="text-label text-text-muted">Categories</span>
            {categories.map((cat) => (
              <NavLink
                key={cat.slug}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-heading-md font-medium tracking-wide py-2 transition-all ${
                    isActive ? "text-primary pl-2 border-l-2 border-primary" : "text-text-secondary pl-2 border-l-2 border-transparent hover:text-text"
                  }`
                }
              >
                {cat.name}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-border pt-6 space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex relative">
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border rounded-full py-2 pl-4 pr-10 text-body-md outline-none focus:border-primary"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
