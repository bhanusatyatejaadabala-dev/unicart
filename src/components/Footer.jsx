import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Mail, Check, AlertCircle } from "lucide-react";

export default function Footer() {
  const { triggerToast } = useCart();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, success, error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setStatus("error");
      setErrorMsg("Email address is required.");
      triggerToast("Please enter an email address.", "error");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      triggerToast("Invalid email address.", "error");
      return;
    }

    setStatus("success");
    setEmail("");
    triggerToast("Thank you for subscribing to our newsletter!", "success");
  };

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      {/* Newsletter Signup Row */}
      <div className="border-b border-border bg-primary-tint-10/50 py-10 lg:py-12">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-md text-center lg:text-left">
            <h3 className="font-display text-2xl lg:text-3xl text-text mb-2">Join the Unicart Journal</h3>
            <p className="text-body-md text-text-secondary">
              Recipients receive seasonal product updates, healthy recipes, organic guides, and exclusive offers.
            </p>
          </div>
          <div className="w-full max-w-md">
            {status === "success" ? (
              <div className="flex items-center gap-3 bg-[#EEF7F2] border border-[#CDE7D8] text-success p-4 rounded-md animate-slide-in">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span className="text-body-md font-medium">Thank you! You have successfully subscribed to the journal.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-surface border rounded-sm py-3 pl-4 pr-10 text-body-md outline-none transition-all ${
                        status === "error" ? "border-error focus:ring-4 focus:ring-error/10" : "border-border focus:border-primary focus:ring-4 focus:ring-primary-light"
                      }`}
                      aria-label="Email for newsletter"
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-button px-6 py-3 rounded-md transition-all duration-fast shrink-0 shadow-sm focus-visible:ring-4 focus-visible:ring-primary-light"
                  >
                    Subscribe
                  </button>
                </div>
                {status === "error" && (
                  <div className="flex items-center gap-2 text-error text-body-sm font-medium animate-slide-in">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Links Area */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link to="/" className="font-display font-medium text-2xl text-text hover:text-primary transition-colors">
              Unicart
            </Link>
            <p className="text-body-md text-text-secondary max-w-sm">
              The organic, sustainable, and trust-first marketplace. Get Clothing, Pharmacy, Electronics, Cosmetics, and Groceries all in one single, calm checkout experience.
            </p>
            <div className="text-body-sm text-text-muted">
              © {new Date().getFullYear()} Unicart Inc. All rights reserved.
            </div>
          </div>

          {/* Column 1: Shop */}
          <div>
            <h4 className="text-label text-text-muted mb-4 font-semibold">Shop categories</h4>
            <ul className="space-y-2 text-body-md text-text-secondary">
              <li><Link to="/category/clothing" className="hover:text-primary transition-colors">Apparel & Linens</Link></li>
              <li><Link to="/category/pharmacy" className="hover:text-primary transition-colors">Herbs & Pharmacy</Link></li>
              <li><Link to="/category/electronics" className="hover:text-primary transition-colors">Eco Electronics</Link></li>
              <li><Link to="/category/cosmetics" className="hover:text-primary transition-colors">Botanical Cosmetics</Link></li>
              <li><Link to="/category/grocery" className="hover:text-primary transition-colors">Organic Groceries</Link></li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-label text-text-muted mb-4 font-semibold">Unicart</h4>
            <ul className="space-y-2 text-body-md text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Our Mission</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sellers Program</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Journal Press</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div>
            <h4 className="text-label text-text-muted mb-4 font-semibold">Help & Trust</h4>
            <ul className="space-y-2 text-body-md text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Customer Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pharmacy Verification</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Use</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
