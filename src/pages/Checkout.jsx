import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { 
  Check, 
  MapPin, 
  CreditCard, 
  Eye, 
  AlertCircle, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle,
  Truck,
  ArrowRight
} from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const {
    cart,
    promoCode,
    getSubtotal,
    getDiscountAmount,
    getTax,
    getShippingCost,
    getTotal,
    placeOrder
  } = useCart();

  // Redirect to Home if cart is empty and no confirmation order exists
  const [orderNum, setOrderNum] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Stepper state: 1 = Shipping, 2 = Payment, 3 = Review
  const [step, setStep] = useState(1);

  // Form Fields & Errors
  const [shippingForm, setShippingForm] = useState(() => {
    // Auto-fill from AI-detected location if available
    const detected = localStorage.getItem("unicart_detected_address");
    const autoFill = detected ? JSON.parse(detected) : {};
    return {
      fullName: "",
      email: "",
      address: autoFill.address || "",
      city: autoFill.city || "",
      state: autoFill.state || "",
      zipCode: autoFill.zipCode || "",
      phone: "",
      shippingMethod: "standard",
    };
  });

  const [paymentForm, setPaymentForm] = useState({
    method: "card", // card, upi, cod
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    upiId: ""
  });

  const [errors, setErrors] = useState({});
  const [summaryCollapsed, setSummaryCollapsed] = useState(true);

  // Calculate pricing values based on shipping method override
  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const tax = getTax();
  
  // Shipping logic override
  const shippingCost = (() => {
    if (promoCode === "FREEFAST") return 0;
    if (shippingForm.shippingMethod === "express") return 180.00;
    return getShippingCost(); // Standard shipping calculation
  })();

  const total = subtotal - discountAmount + tax + shippingCost;

  // Validation shipping
  const validateShipping = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,14}$/;

    if (!shippingForm.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!shippingForm.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(shippingForm.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!shippingForm.address.trim()) newErrors.address = "Address is required.";
    if (!shippingForm.city.trim()) newErrors.city = "City is required.";
    if (!shippingForm.state.trim()) newErrors.state = "State is required.";
    if (!shippingForm.zipCode.trim()) {
      newErrors.zipCode = "Zip/Postal Code is required.";
    } else if (shippingForm.zipCode.length < 5) {
      newErrors.zipCode = "Must be at least 5 characters.";
    }
    if (!shippingForm.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(shippingForm.phone.replace(/[\s-()]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number (minimum 10 digits).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation payment
  const validatePayment = () => {
    const newErrors = {};
    if (paymentForm.method === "card") {
      if (!paymentForm.cardName.trim()) newErrors.cardName = "Cardholder Name is required.";
      if (!paymentForm.cardNumber.trim() || paymentForm.cardNumber.replace(/\s/g, "").length !== 16) {
        newErrors.cardNumber = "Valid 16-digit Card Number is required.";
      }
      
      const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
      if (!paymentForm.cardExpiry.trim() || !expiryRegex.test(paymentForm.cardExpiry)) {
        newErrors.cardExpiry = "Expiry Date (MM/YY) is required.";
      }

      if (!paymentForm.cardCvv.trim() || paymentForm.cardCvv.length < 3) {
        newErrors.cardCvv = "Valid 3 or 4-digit CVV is required.";
      }
    } else if (paymentForm.method === "upi") {
      if (!paymentForm.upiId.trim() || !paymentForm.upiId.includes("@")) {
        newErrors.upiId = "Valid UPI ID is required (e.g. user@okaxis).";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateShipping()) {
        setStep(2);
        setErrors({});
      }
    } else if (step === 2) {
      if (validatePayment()) {
        setStep(3);
        setErrors({});
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handlePlaceOrder = () => {
    const details = {
      fullName: shippingForm.fullName,
      email: shippingForm.email,
      address: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} - ${shippingForm.zipCode}`,
      phone: shippingForm.phone,
      shippingMethod: shippingForm.shippingMethod
    };

    const paymentDetails = {
      method: paymentForm.method
    };

    const num = placeOrder(details, paymentDetails);
    
    // Set checkout local variables to show confirmation card
    setConfirmedOrder({
      orderNumber: num,
      fullName: shippingForm.fullName,
      address: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} - ${shippingForm.zipCode}`,
      email: shippingForm.email,
      method: paymentForm.method,
      totalCost: total,
      itemsCount: cart.reduce((acc, curr) => acc + curr.quantity, 0)
    });
    setOrderNum(num);
  };

  // Input styling error generator helper
  const getFieldClass = (fieldName) => {
    return `w-full bg-surface border rounded-sm py-2 px-3 text-body-md outline-none transition-all ${
      errors[fieldName] 
        ? "border-error focus:ring-4 focus:ring-error/10" 
        : "border-border focus:border-primary focus:ring-4 focus:ring-primary-light"
    }`;
  };

  // If order was successfully completed
  if (confirmedOrder) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-8 animate-fade-in">
        <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-12 h-12" />
        </div>
        
        <div className="space-y-3">
          <span className="text-label text-primary font-bold">Checkout Complete</span>
          <h1 className="text-display-md font-display font-medium text-text">Thank You for Your Order!</h1>
          <p className="text-body-md text-text-secondary">
            We've sent a detailed confirmation receipt to <span className="font-semibold text-text">{confirmedOrder.email}</span>.
          </p>
        </div>

        {/* Info card */}
        <div className="bg-surface border border-border rounded-xl p-6 text-left space-y-4 shadow-sm">
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-body-sm text-text-secondary">Order Number</span>
            <span className="text-body-sm font-bold text-text">{confirmedOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-body-sm text-text-secondary">Delivery Address</span>
            <span className="text-body-sm font-semibold text-text max-w-[200px] text-right truncate">
              {confirmedOrder.address}
            </span>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-body-sm text-text-secondary">Payment Method</span>
            <span className="text-body-sm font-semibold text-text uppercase">
              {confirmedOrder.method}
            </span>
          </div>
          <div className="flex justify-between font-semibold pt-1">
            <span className="text-body-md text-text">Total Charged</span>
            <span className="text-body-md text-primary font-bold">₹{confirmedOrder.totalCost.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/category/all")}
          className="w-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-button py-3.5 rounded-md shadow-md focus-visible:ring-4 focus-visible:ring-primary-light"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Redirect back if cart is completely empty
  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-6">
        <h1 className="text-display-md text-text font-display">No Checkout Items</h1>
        <p className="text-body-md text-text-secondary">Your shopping cart is currently empty.</p>
        <button
          onClick={() => navigate("/category/all")}
          className="bg-primary text-white text-button px-6 py-3 rounded-md focus-visible:ring-4 focus-visible:ring-primary-light"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pb-16 space-y-8">
      
      {/* Stepper Header (calm/light-motion) */}
      <div className="max-w-3xl mx-auto py-6">
        <div className="flex items-center justify-between relative" aria-label="Progress Stepper">
          {/* Stepper lines */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-slow" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />

          {[
            { num: 1, label: "Shipping", icon: MapPin },
            { num: 2, label: "Payment", icon: CreditCard },
            { num: 3, label: "Review", icon: Eye }
          ].map((s) => {
            const isCompleted = step > s.num;
            const isActive = step === s.num;
            const StepIcon = s.icon;
            
            return (
              <div key={s.num} className="z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-body text-body-sm font-bold border transition-all duration-base ${
                    isCompleted 
                      ? "bg-primary border-primary text-white" 
                      : isActive 
                      ? "bg-surface border-primary text-primary ring-4 ring-primary-light"
                      : "bg-surface border-border text-text-secondary"
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <span>{s.num}</span>}
                </div>
                <span className={`text-body-sm font-semibold tracking-wide ${isActive ? "text-primary" : "text-text-secondary"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Steps Form (lg:span-8) */}
        <main className="lg:col-span-8 bg-surface border border-border rounded-xl p-6 md:p-8 shadow-sm space-y-8 min-h-[400px]">
          
          {/* STEP 1: SHIPPING DETAILS */}
          {step === 1 && (
            <section className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-heading-lg text-text font-bold">Shipping Information</h2>
                <p className="text-body-sm text-text-secondary">Provide valid delivery addresses and contact information.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Full name */}
                <div className="md:col-span-2 space-y-1">
                  <label htmlFor="fullName" className="text-heading-sm text-text block">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    value={shippingForm.fullName}
                    onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                    className={getFieldClass("fullName")}
                  />
                  {errors.fullName && (
                    <div className="flex items-center gap-1.5 text-error text-body-sm font-medium pt-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-heading-sm text-text block">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={shippingForm.email}
                    onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                    className={getFieldClass("email")}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-1.5 text-error text-body-sm font-medium pt-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-heading-sm text-text block">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="10+ digits with country code"
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    className={getFieldClass("phone")}
                  />
                  {errors.phone && (
                    <div className="flex items-center gap-1.5 text-error text-body-sm font-medium pt-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-1">
                  <label htmlFor="address" className="text-heading-sm text-text block">Street Address</label>
                  <input
                    id="address"
                    type="text"
                    value={shippingForm.address}
                    onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                    className={getFieldClass("address")}
                  />
                  {errors.address && (
                    <div className="flex items-center gap-1.5 text-error text-body-sm font-medium pt-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.address}</span>
                    </div>
                  )}
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label htmlFor="city" className="text-heading-sm text-text block">City</label>
                  <input
                    id="city"
                    type="text"
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    className={getFieldClass("city")}
                  />
                  {errors.city && (
                    <div className="flex items-center gap-1.5 text-error text-body-sm font-medium pt-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.city}</span>
                    </div>
                  )}
                </div>

                {/* State & Zip */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="state" className="text-heading-sm text-text block">State</label>
                    <input
                      id="state"
                      type="text"
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                      className={getFieldClass("state")}
                    />
                    {errors.state && (
                      <div className="flex items-center gap-1.5 text-error text-body-sm font-medium pt-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.state}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="zipCode" className="text-heading-sm text-text block">Zip Code</label>
                    <input
                      id="zipCode"
                      type="text"
                      value={shippingForm.zipCode}
                      onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                      className={getFieldClass("zipCode")}
                    />
                    {errors.zipCode && (
                      <div className="flex items-center gap-1.5 text-error text-body-sm font-medium pt-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.zipCode}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Delivery Methods selection */}
              <div className="border-t border-border pt-6 space-y-3">
                <h3 className="text-heading-sm text-text block">Delivery Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer bg-surface hover:bg-primary-tint-10/20 select-none">
                    <input
                      type="radio"
                      name="delivery-method"
                      checked={shippingForm.shippingMethod === "standard"}
                      onChange={() => setShippingForm({ ...shippingForm, shippingMethod: "standard" })}
                      className="mt-1 accent-primary"
                    />
                    <div className="space-y-0.5">
                      <span className="font-semibold text-body-md block">Carbon-Neutral Standard</span>
                      <span className="text-body-sm text-text-secondary">Delivery: 3-5 business days</span>
                      <span className="text-body-sm font-bold text-success block">
                        {subtotal >= 1000 ? "FREE" : `₹${getShippingCost().toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer bg-surface hover:bg-primary-tint-10/20 select-none">
                    <input
                      type="radio"
                      name="delivery-method"
                      checked={shippingForm.shippingMethod === "express"}
                      onChange={() => setShippingForm({ ...shippingForm, shippingMethod: "express" })}
                      className="mt-1 accent-primary"
                    />
                    <div className="space-y-0.5">
                      <span className="font-semibold text-body-md block">Premium Bio-Express</span>
                      <span className="text-body-sm text-text-secondary">Delivery: 1-2 business days</span>
                      <span className="text-body-sm font-bold text-text block">₹180.00</span>
                    </div>
                  </label>
                </div>
              </div>

            </section>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <section className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-heading-lg text-text font-bold">Payment Method</h2>
                <p className="text-body-sm text-text-secondary">Select your preferred payment structure and enter credentials.</p>
              </div>

              {/* Payment selection types */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "card", label: "Credit Card", desc: "Visa/MC/Amex" },
                  { id: "upi", label: "UPI Transfer", desc: "Instant checkout" },
                  { id: "cod", label: "Pay on Delivery", desc: "COD verification" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPaymentForm({ ...paymentForm, method: item.id });
                      setErrors({});
                    }}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all text-center focus-visible:ring-4 focus-visible:ring-primary-light ${
                      paymentForm.method === item.id
                        ? "bg-primary-light border-primary text-primary"
                        : "bg-surface border-border hover:bg-primary-tint-10/30"
                    }`}
                  >
                    <span className="font-bold text-body-sm block uppercase tracking-wider">{item.label}</span>
                    <span className="text-[10px] text-text-secondary block mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>

              {/* Card Form */}
              {paymentForm.method === "card" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-6">
                  
                  {/* Card name */}
                  <div className="md:col-span-2 space-y-1">
                    <label htmlFor="cardName" className="text-heading-sm text-text block">Name on Card</label>
                    <input
                      id="cardName"
                      type="text"
                      value={paymentForm.cardName}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
                      className={getFieldClass("cardName")}
                    />
                    {errors.cardName && (
                      <div className="flex items-center gap-1.5 text-error text-body-sm font-medium pt-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.cardName}</span>
                      </div>
                    )}
                  </div>

                  {/* Card number */}
                  <div className="md:col-span-2 space-y-1">
                    <label htmlFor="cardNumber" className="text-heading-sm text-text block">Card Number</label>
                    <input
                      id="cardNumber"
                      type="text"
                      maxLength="19"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={paymentForm.cardNumber}
                      onChange={(e) => {
                        // Formats with spaces
                        const val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                        setPaymentForm({ ...paymentForm, cardNumber: val });
                      }}
                      className={getFieldClass("cardNumber")}
                    />
                    {errors.cardNumber && (
                      <div className="flex items-center gap-1.5 text-error text-body-sm font-medium pt-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.cardNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Expiry & CVV */}
                  <div className="space-y-1">
                    <label htmlFor="cardExpiry" className="text-heading-sm text-text block">Expiry Date</label>
                    <input
                      id="cardExpiry"
                      type="text"
                      maxLength="5"
                      placeholder="MM/YY"
                      value={paymentForm.cardExpiry}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        const formatted = val.length > 2 ? val.substring(0, 2) + "/" + val.substring(2, 4) : val;
                        setPaymentForm({ ...paymentForm, cardExpiry: formatted });
                      }}
                      className={getFieldClass("cardExpiry")}
                    />
                    {errors.cardExpiry && (
                      <div className="flex items-center gap-1.5 text-error text-body-sm font-medium pt-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.cardExpiry}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="cardCvv" className="text-heading-sm text-text block">CVV Code</label>
                    <input
                      id="cardCvv"
                      type="password"
                      maxLength="4"
                      placeholder="123"
                      value={paymentForm.cardCvv}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cardCvv: e.target.value.replace(/\D/g, "") })}
                      className={getFieldClass("cardCvv")}
                    />
                    {errors.cardCvv && (
                      <div className="flex items-center gap-1.5 text-error text-body-sm font-medium pt-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.cardCvv}</span>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* UPI Form */}
              {paymentForm.method === "upi" && (
                <div className="space-y-2 border-t border-border pt-6 max-w-md">
                  <label htmlFor="upiId" className="text-heading-sm text-text block">UPI Virtual ID</label>
                  <input
                    id="upiId"
                    type="text"
                    placeholder="username@bank"
                    value={paymentForm.upiId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, upiId: e.target.value })}
                    className={getFieldClass("upiId")}
                  />
                  {errors.upiId && (
                    <div className="flex items-center gap-1.5 text-error text-body-sm font-medium pt-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.upiId}</span>
                    </div>
                  )}
                  <p className="text-body-sm text-text-secondary leading-relaxed">
                    A collection request will be pushed instantly to your mobile payment app after clicking buy.
                  </p>
                </div>
              )}

              {/* COD description */}
              {paymentForm.method === "cod" && (
                <div className="border-t border-border pt-6 p-4 bg-[#FFF9EE] border border-[#FCE8C4] rounded-lg text-warning flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-body-md text-text-secondary leading-relaxed">
                    <strong className="text-text font-bold block mb-0.5">Cash on Delivery details</strong>
                    Please ensure an adult is present to clear the payment amount of <span className="font-bold text-text">₹{total.toLocaleString("en-IN")}</span>. We support card swipes on delivery, cash, or instant QR codes at your doorstep.
                  </div>
                </div>
              )}

            </section>
          )}

          {/* STEP 3: ORDER REVIEW */}
          {step === 3 && (
            <section className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-heading-lg text-text font-bold">Review Your Order</h2>
                <p className="text-body-sm text-text-secondary">Check details and place your order.</p>
              </div>

              {/* Review Shipping and Payment summaries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Shipping summary card */}
                <div className="p-4 border border-border bg-[#FAF9F6] rounded-lg space-y-2">
                  <h4 className="text-label text-text-secondary font-bold">Delivery Destination</h4>
                  <div className="text-body-md text-text font-semibold">{shippingForm.fullName}</div>
                  <div className="text-body-sm text-text-secondary leading-relaxed">
                    {shippingForm.address}, {shippingForm.city}, {shippingForm.state} - {shippingForm.zipCode} <br />
                    Phone: {shippingForm.phone}
                  </div>
                  <div className="text-body-sm font-medium text-primary flex items-center gap-1.5 pt-1">
                    <Truck className="w-4 h-4" />
                    <span>Method: {shippingForm.shippingMethod === "express" ? "Bio-Express" : "Standard Eco"}</span>
                  </div>
                </div>

                {/* Payment summary card */}
                <div className="p-4 border border-border bg-[#FAF9F6] rounded-lg space-y-2">
                  <h4 className="text-label text-text-secondary font-bold">Payment Method</h4>
                  <div className="text-body-md text-text font-semibold uppercase">{paymentForm.method}</div>
                  <div className="text-body-sm text-text-secondary">
                    {paymentForm.method === "card" && `Card ending in: **** **** **** ${paymentForm.cardNumber.slice(-4)}`}
                    {paymentForm.method === "upi" && `UPI ID: ${paymentForm.upiId}`}
                    {paymentForm.method === "cod" && "Cash/QR Code paid at delivery destination"}
                  </div>
                </div>

              </div>

              {/* Read only grouped line items review list */}
              <div className="space-y-3">
                <h3 className="text-heading-sm text-text">Ordered Items</h3>
                <div className="border border-border rounded-lg divide-y divide-border overflow-hidden bg-surface shadow-sm">
                  {cart.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt=""
                          className="w-12 h-12 object-cover rounded-md border border-border"
                        />
                        <div>
                          <div className="text-body-md font-semibold text-text line-clamp-1">{item.product.title}</div>
                          <div className="text-body-sm text-text-secondary flex gap-2">
                            <span className="uppercase text-[9px] font-bold text-primary">{item.product.category}</span>
                            {item.selectedVariant && <span>Option: {item.selectedVariant}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-body-md font-bold text-text">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</div>
                        <div className="text-body-sm text-text-secondary">{item.quantity} units</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </section>
          )}

          {/* Stepper buttons (prev & next) */}
          <div className="border-t border-border pt-6 flex justify-between gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-transparent border border-primary hover:bg-primary-tint-10 text-primary text-button px-6 py-3 rounded-md transition-all focus-visible:ring-4 focus-visible:ring-primary-light"
              >
                Back
              </button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-button px-8 py-3 rounded-md shadow-sm transition-all duration-fast flex items-center gap-1.5 focus-visible:ring-4 focus-visible:ring-primary-light"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-button px-10 py-3.5 rounded-md shadow-md transition-all duration-fast flex items-center gap-1.5 focus-visible:ring-4 focus-visible:ring-primary-light animate-pulse"
                >
                  <span>Place Order</span>
                  <Check className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

        </main>

        {/* Sidebar Order Summary (lg:span-4, persistent) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          
          {/* Mobile Collapsible Header */}
          <button
            onClick={() => setSummaryCollapsed(!summaryCollapsed)}
            className="w-full bg-surface border border-border rounded-xl p-4 shadow-sm flex items-center justify-between lg:hidden text-heading-sm text-text font-bold focus-visible:ring-4 focus-visible:ring-primary-light"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span>Checkout Summary ({cart.length} items)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">₹{total.toLocaleString("en-IN")}</span>
              {summaryCollapsed ? <ChevronDown className="w-4 h-4 text-text-secondary" /> : <ChevronUp className="w-4 h-4 text-text-secondary" />}
            </div>
          </button>

          {/* Actual summary container */}
          <div 
            className={`bg-surface border border-border rounded-xl p-6 shadow-sm space-y-6 lg:block ${
              summaryCollapsed ? "hidden" : "block"
            } animate-fade-in`}
          >
            <h3 className="text-heading-sm text-text font-bold uppercase tracking-wider border-b border-border pb-3 hidden lg:block">
              Order Details
            </h3>

            {/* Render mini line items review in sidebar */}
            <div className="max-h-[160px] overflow-y-auto divide-y divide-border pr-2 no-scrollbar">
              {cart.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between gap-3 text-body-sm">
                  <div className="truncate">
                    <span className="font-semibold text-text">{item.quantity}x</span> {item.product.title}
                    {item.selectedVariant && <span className="text-primary text-[10px] block">Option: {item.selectedVariant}</span>}
                  </div>
                  <span className="font-bold text-text shrink-0">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3 text-body-md text-text-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-text">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-primary font-semibold">
                  <span>Discount ({promoCode})</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping ({shippingForm.shippingMethod === "express" ? "Express" : "Standard"})</span>
                <span className="font-semibold text-text">
                  {shippingCost === 0 ? <span className="text-success text-xs font-bold uppercase">Free</span> : `₹${shippingCost.toLocaleString("en-IN")}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="font-semibold text-text">₹{tax.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-baseline font-bold">
              <span className="text-heading-sm text-text">Grand Total</span>
              <span className="text-price-lg text-primary font-bold">₹{total.toLocaleString("en-IN")}</span>
            </div>

          </div>
        </aside>

      </div>

    </div>
  );
}
