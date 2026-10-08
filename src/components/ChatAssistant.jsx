import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useChat } from "../context/ChatContext";
import { sendChatMessage, formatCartSummary, getProductById } from "../services/aiService";
import {
  MessageSquare,
  X,
  Send,
  ShoppingCart,
  ExternalLink,
  Star,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  ChevronDown,
  Mic,
  MicOff,
} from "lucide-react";

const QUICK_ACTIONS = [
  { emoji: "🛍", label: "Recommend Products", prompt: "Recommend some popular products for me" },
  { emoji: "🔥", label: "Today's Deals", prompt: "What are the best deals and discounts available right now?" },
  { emoji: "⭐", label: "Top Rated", prompt: "Show me the top rated products across all categories" },
  { emoji: "📱", label: "Best Earbuds", prompt: "Show me the best earbuds available" },
  { emoji: "👟", label: "Running Shoes", prompt: "Show me running shoes" },
  { emoji: "👕", label: "Clothing Deals", prompt: "Show me clothing items on sale" },
  { emoji: "💊", label: "Pharmacy Express", prompt: "What pharmacy essentials can I get delivered in 10 minutes?" },
  { emoji: "🥗", label: "Grocery Quick", prompt: "Show me grocery items available for quick delivery" },
  { emoji: "💄", label: "Best Cosmetics", prompt: "Recommend the best cosmetics and skincare products" },
  { emoji: "🎁", label: "Offers & Coupons", prompt: "What coupons and offers are available?" },
  { emoji: "📍", label: "Use My Location", prompt: "Use my current location as address" },
  { emoji: "🛒", label: "View Cart", prompt: "Show me what's in my cart" },
  { emoji: "📦", label: "Track Orders", prompt: "Track my orders" },
  { emoji: "🔍", label: "Search Products", prompt: "Help me search for a product" },
];

/* ─── Mini Product Card (rendered inside chat) ─── */
function ChatProductCard({ product, onAddToCart, onViewProduct }) {
  if (!product) return null;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const isQuickDelivery = product.categorySlug === "grocery" || product.categorySlug === "pharmacy";

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
      {/* Image */}
      <div className="relative h-28 bg-[#FAF9F6] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isQuickDelivery && (
          <div className="absolute top-1.5 right-1.5 bg-[#FACC15] text-[#1E293B] text-[8px] font-black uppercase py-0.5 px-1.5 rounded flex items-center gap-0.5">
            ⚡ 10 min
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[8px] font-bold py-0.5 px-1.5 rounded">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[9px] text-primary font-bold uppercase tracking-wider">{product.brand}</p>
          <h4 className="text-xs font-semibold text-text line-clamp-2 leading-tight mt-0.5">{product.title}</h4>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-text">₹{product.price.toLocaleString("en-IN")}</span>
            <span className="text-[10px] text-warning flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-current" /> {product.rating}
            </span>
          </div>
          {/* Actions */}
          <div className="flex gap-1.5 mt-2">
            <button
              onClick={() => onAddToCart(product)}
              disabled={product.stockStatus === "out-of-stock"}
              className="flex-1 bg-primary hover:bg-primary-hover text-white text-[10px] font-bold py-1.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <ShoppingCart className="w-3 h-3" />
              Add
            </button>
            <button
              onClick={() => onViewProduct(product.id)}
              className="flex-1 bg-surface hover:bg-primary-tint-10 text-primary border border-primary text-[10px] font-bold py-1.5 rounded transition-colors flex items-center justify-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Typing Indicator ─── */
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 mb-4">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shrink-0 shadow-sm">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Chat Assistant Component ─── */
export default function ChatAssistant() {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, clearCart, triggerToast, applyPromo } = useCart();
  const {
    isOpen,
    messages,
    isLoading,
    conversationHistory,
    setIsLoading,
    toggleChat,
    closeChat,
    addMessage,
    addToHistory,
    resetChat,
  } = useChat();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Scroll detection for the "scroll to bottom" button
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollDown(!isNearBottom);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* ─── Action Executors ─── */
  const handleAddToCart = useCallback((product) => {
    addToCart(product, 1);
  }, [addToCart]);

  const handleViewProduct = useCallback((productId) => {
    navigate(`/product/${productId}`);
    // Chat stays open so the user can continue interacting
  }, [navigate]);

  const executeActions = useCallback((actions) => {
    if (!actions || !Array.isArray(actions)) return;

    actions.forEach((action) => {
      switch (action.type) {
        case "ADD_TO_CART": {
          const product = getProductById(action.productId);
          if (product) {
            addToCart(product, action.quantity || 1);
          }
          break;
        }
        case "REMOVE_FROM_CART": {
          removeFromCart(action.productId);
          break;
        }
        case "NAVIGATE": {
          if (action.route) {
            navigate(action.route);
            // Chat stays open so the user can continue interacting
          }
          break;
        }
        case "CLEAR_CART": {
          clearCart();
          break;
        }
        case "APPLY_PROMO": {
          if (action.code) {
            applyPromo(action.code);
          }
          break;
        }
        case "GET_LOCATION": {
          // Use browser Geolocation API + Nominatim reverse geocoding
          if (!navigator.geolocation) {
            addMessage({
              role: "assistant",
              content: "📍 Geolocation is not supported by your browser. Please enter your address manually at checkout.",
              actions: [],
            });
            break;
          }

          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const res = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                  { headers: { "Accept-Language": "en" } }
                );
                const data = await res.json();
                const addr = data.address || {};
                const formattedAddress = [
                  addr.road || addr.neighbourhood || "",
                  addr.suburb || addr.village || "",
                  addr.city || addr.town || addr.state_district || "",
                  addr.state || "",
                  addr.postcode || "",
                  addr.country || "",
                ].filter(Boolean).join(", ");

                addMessage({
                  role: "assistant",
                  content: `📍 **Your detected location:**\n\n${formattedAddress}\n\n✅ This address has been saved and will be auto-filled when you proceed to checkout. You can edit it there if needed.`,
                  actions: [],
                  detectedAddress: {
                    fullAddress: formattedAddress,
                    road: addr.road || addr.neighbourhood || "",
                    city: addr.city || addr.town || addr.state_district || "",
                    state: addr.state || "",
                    postcode: addr.postcode || "",
                    country: addr.country || "",
                    lat: latitude,
                    lng: longitude,
                  },
                });

                // Store in localStorage for checkout auto-fill
                localStorage.setItem("unicart_detected_address", JSON.stringify({
                  address: addr.road || addr.neighbourhood || "",
                  city: addr.city || addr.town || addr.state_district || "",
                  state: addr.state || "",
                  zipCode: addr.postcode || "",
                }));
              } catch {
                addMessage({
                  role: "assistant",
                  content: `📍 Located you at coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)}), but I couldn't convert this to a street address. Please enter your address manually at checkout.`,
                  actions: [],
                });
              }
            },
            (error) => {
              let errorMsg = "Unable to detect your location.";
              if (error.code === 1) errorMsg = "📍 Location access denied. Please allow location access in your browser settings and try again.";
              else if (error.code === 2) errorMsg = "📍 Location unavailable. Please try again or enter your address manually.";
              else if (error.code === 3) errorMsg = "📍 Location request timed out. Please try again.";

              addMessage({
                role: "assistant",
                content: errorMsg,
                actions: [],
              });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
          );
          break;
        }
        // SHOW_PRODUCTS is handled in message rendering, not as a side-effect
        default:
          break;
      }
    });
  }, [addToCart, removeFromCart, clearCart, navigate, addMessage, applyPromo]);

  /* ─── Send Message ─── */
  const handleSend = useCallback(async (text) => {
    const userText = (text || inputValue).trim();
    if (!userText || isLoading) return;

    setInputValue("");

    // Add user message to UI
    addMessage({ role: "user", content: userText });
    addToHistory("user", userText);

    // Start loading
    setIsLoading(true);

    try {
      const cartSummary = formatCartSummary(cart);
      const response = await sendChatMessage(conversationHistory, userText, cartSummary, cart);

      // Add AI response to UI
      addMessage({
        role: "assistant",
        content: response.message,
        actions: response.actions,
        productIds: response.actions
          ?.filter((a) => a.type === "SHOW_PRODUCTS")
          .flatMap((a) => a.productIds || []),
      });
      addToHistory("assistant", response.message);

      // Execute side-effect actions (add to cart, navigate, etc.)
      const sideEffectActions = response.actions?.filter((a) => a.type !== "SHOW_PRODUCTS") || [];
      if (sideEffectActions.length > 0) {
        executeActions(sideEffectActions);
      }
    } catch (error) {
      console.error("Chat error:", error);
      addMessage({
        role: "assistant",
        content: "I'm sorry, something went wrong. Please try again.",
        actions: [],
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, cart, conversationHistory, addMessage, addToHistory, setIsLoading, executeActions]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt) => {
    handleSend(prompt);
  };

  /* ─── Voice Recognition (Web Speech API) ─── */
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      triggerToast("Voice input is not supported in this browser. Try Chrome or Edge.", "error");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setInputValue(transcript);

      // If the result is final, auto-send the message
      if (event.results[event.results.length - 1].isFinal) {
        setIsListening(false);
        // Small delay so the user can see what was transcribed
        setTimeout(() => {
          handleSend(transcript);
        }, 400);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        triggerToast("Microphone access denied. Please allow microphone access.", "error");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  }, [triggerToast, handleSend]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  /* ─── Render ─── */
  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 group ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-0"
            : "bg-gradient-to-br from-primary to-primary-hover hover:from-primary-hover hover:to-primary-active"
        }`}
        aria-label={isOpen ? "Close chat" : "Open UniCart AI Assistant"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping pointer-events-none" />
          </>
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[92vw] sm:w-[420px] max-h-[75vh] flex flex-col rounded-2xl shadow-2xl border border-border/60 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto"
            : "scale-90 opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", background: "rgba(248, 245, 239, 0.97)" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-hover px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide">UniCart AI</h3>
              <p className="text-white/70 text-[10px] font-medium">Your shopping assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetChat}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              onClick={closeChat}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-0"
          style={{ maxHeight: "calc(75vh - 140px)" }}
        >
          {/* Welcome message if no messages */}
          {messages.length === 0 && (
            <div className="space-y-4">
              {/* Welcome */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[85%]">
                  <p className="text-body-sm text-text leading-relaxed">
                    👋 Hi there! I'm <strong>UniCart AI</strong>, your personal shopping assistant. I can help you find products, compare items, manage your cart, and navigate the store. What can I help you with?
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pl-9">
                <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-2">Quick Actions</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.prompt)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface border border-border hover:border-primary hover:bg-primary-tint-10 rounded-full text-[11px] font-medium text-text-secondary hover:text-primary transition-all whitespace-nowrap"
                    >
                      <span>{action.emoji}</span>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Message List */}
          {messages.map((msg) => (
            <div key={msg.id} className={`mb-4 ${msg.role === "user" ? "flex justify-end" : "flex items-start gap-2.5"}`}>
              {/* AI Avatar */}
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              <div className={`max-w-[85%] ${msg.role === "user" ? "" : ""}`}>
                {/* Message Bubble */}
                <div
                  className={`px-4 py-2.5 shadow-sm ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-2xl rounded-tr-sm"
                      : "bg-surface border border-border text-text rounded-2xl rounded-tl-sm"
                  }`}
                >
                  <p className="text-body-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Product Cards Grid */}
                {msg.productIds && msg.productIds.length > 0 && (
                  <div className={`mt-3 grid gap-2.5 ${msg.productIds.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                    {msg.productIds.map((pid) => {
                      const product = getProductById(pid);
                      return product ? (
                        <ChatProductCard
                          key={pid}
                          product={product}
                          onAddToCart={handleAddToCart}
                          onViewProduct={handleViewProduct}
                        />
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-text flex items-center justify-center shrink-0 shadow-sm mt-0.5 ml-2">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll Down Button */}
        {showScrollDown && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-[76px] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface border border-border shadow-md flex items-center justify-center hover:bg-primary-tint-10 transition-colors z-10"
          >
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          </button>
        )}

        {/* Input Area */}
        <div className="border-t border-border bg-surface px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* Voice Input Button */}
            <button
              onClick={toggleVoice}
              disabled={isLoading}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 shadow-sm ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-surface border border-border hover:border-primary hover:bg-primary-tint-10 text-text-secondary hover:text-primary"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
              title={isListening ? "Listening... click to stop" : "Speak your request"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "🎙️ Listening..." : "Ask me anything about UniCart..."}
              disabled={isLoading}
              className={`flex-1 bg-background border rounded-full px-4 py-2.5 text-body-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all disabled:opacity-50 ${
                isListening ? "border-red-400 ring-2 ring-red-200" : "border-border"
              }`}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          {isListening && (
            <p className="text-[10px] text-red-500 font-semibold text-center mt-1.5 flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Listening... speak your request
            </p>
          )}
          <p className="text-[9px] text-text-muted text-center mt-1.5">Powered by UniCart AI • Voice & Text • Only knows UniCart products</p>
        </div>
      </div>
    </>
  );
}
