import productsData from "../data/products.json";

/**
 * UniCart Local AI Engine
 * 
 * A fully local, rule-based shopping assistant that requires NO external API.
 * Uses keyword matching, fuzzy search, and intent classification to handle:
 * - Product search & discovery
 * - Add to cart / Buy / Order
 * - Navigation
 * - Coupon application
 * - Cart management
 * - Product recommendations & comparisons
 * - Location detection
 */

// ─── Intent Classification ───────────────────────────────────────────

const INTENTS = {
  ADD_TO_CART: [
    "add to cart", "add to my cart", "add this to cart", "put in cart",
    "add it", "cart me", "add the", "add a", "add some", "add one",
    "i want to add", "can you add", "please add"
  ],
  BUY: [
    "buy", "purchase", "order", "i want to buy", "i want to order",
    "i want to purchase", "get me", "i need", "i'll take", "book",
    "buy this", "order this", "buy now", "purchase this"
  ],
  SEARCH: [
    "show me", "find", "search", "look for", "i'm looking for",
    "suggest", "recommend", "what do you have", "any", "best",
    "top", "popular", "trending", "show", "display", "give me options",
    "help me find", "i need", "looking for"
  ],
  COMPARE: [
    "compare", "difference between", "which is better", "vs",
    "versus", "comparison"
  ],
  NAVIGATE: [
    "go to", "take me to", "open", "navigate to", "show me the",
    "visit", "go home", "homepage", "take me home"
  ],
  VIEW_CART: [
    "view cart", "show cart", "my cart", "what's in my cart",
    "show my cart", "open cart", "go to cart", "cart page"
  ],
  CHECKOUT: [
    "checkout", "check out", "proceed to checkout", "pay now",
    "proceed to payment", "place order", "complete order", "complete purchase"
  ],
  REMOVE_FROM_CART: [
    "remove from cart", "remove", "delete from cart", "take out",
    "remove the", "delete the"
  ],
  CLEAR_CART: [
    "clear cart", "empty cart", "remove all", "clear my cart",
    "empty my cart", "remove everything"
  ],
  APPLY_COUPON: [
    "apply coupon", "apply code", "use coupon", "use code", "promo",
    "discount", "apply promo", "use promo", "coupon", "apply discount",
    "give me a discount", "any offers", "any coupons"
  ],
  LIST_COUPONS: [
    "what coupons", "available coupons", "show coupons", "list coupons",
    "what offers", "what discounts", "available offers", "show offers",
    "available promo", "show promo codes"
  ],
  TRACK_ORDERS: [
    "track order", "my orders", "order status", "track my order",
    "where is my order", "order tracking", "show orders"
  ],
  LOCATION: [
    "use my location", "detect my location", "current location",
    "use my current location", "where am i", "my address",
    "detect my address", "use location", "gps"
  ],
  LOGIN: [
    "login", "log in", "sign in", "signin"
  ],
  SIGNUP: [
    "sign up", "signup", "register", "create account", "new account"
  ],
  GREETING: [
    "hi", "hello", "hey", "good morning", "good afternoon",
    "good evening", "what's up", "sup", "howdy", "hola"
  ],
  HELP: [
    "help", "what can you do", "how do you work", "features",
    "capabilities", "what are you"
  ],
  DEALS: [
    "deals", "sale", "on sale", "discounted", "offers", "best deals",
    "today's deals", "special offers", "clearance"
  ],
  BUDGET: [
    "under", "below", "less than", "cheap", "affordable", "budget",
    "inexpensive", "economical", "value"
  ]
};

// ─── Category Keywords ───────────────────────────────────────────────

const CATEGORY_KEYWORDS = {
  clothing: ["clothing", "clothes", "shirt", "tee", "polo", "jeans", "denim", "jacket",
    "cardigan", "hoodie", "kurta", "kurti", "salwar", "shoes", "sneakers", "socks",
    "boxers", "blazer", "trousers", "pants", "dress", "fashion", "wear", "apparel",
    "garment", "outfit", "running shoes", "sportswear"],
  electronics: ["electronics", "electronic", "phone", "smartphone", "laptop", "earbuds",
    "headphones", "headphone", "earbud", "charger", "cable", "usb", "power bank",
    "tablet", "speaker", "mouse", "keyboard", "monitor", "smartwatch", "watch",
    "camera", "gadget", "tech", "device", "wireless"],
  pharmacy: ["pharmacy", "medicine", "medical", "health", "vitamin", "supplement",
    "tablet", "capsule", "syrup", "cream", "ointment", "bandage", "thermometer",
    "mask", "sanitizer", "paracetamol", "first aid", "wellness", "healthcare"],
  cosmetics: ["cosmetics", "cosmetic", "makeup", "beauty", "skincare", "skin care",
    "lipstick", "foundation", "moisturizer", "moisturiser", "serum", "sunscreen",
    "face wash", "cleanser", "primer", "mascara", "eyeliner", "nail polish",
    "perfume", "fragrance", "lotion", "cream", "body wash"],
  grocery: ["grocery", "groceries", "food", "dal", "rice", "atta", "flour", "oil",
    "tea", "coffee", "ghee", "butter", "biscuit", "cookie", "snack", "spice",
    "turmeric", "salt", "sugar", "honey", "oats", "cereal", "milk", "curd",
    "paneer", "bread", "egg", "eggs", "vegetable", "fruit"]
};

// ─── Coupon Data ─────────────────────────────────────────────────────

const COUPONS = {
  UNICART10: { code: "UNICART10", desc: "Flat ₹500 off on orders above ₹2,000", min: 2000 },
  WELCOME10: { code: "WELCOME10", desc: "10% off for new users, no minimum", min: 0 },
  SUPER20: { code: "SUPER20", desc: "20% off on orders above ₹1,500", min: 1500 },
  FREEFAST: { code: "FREEFAST", desc: "Free shipping on any order", min: 0 },
  INSTA300: { code: "INSTA300", desc: "Flat ₹300 off on Grocery/Pharmacy orders above ₹1,000", min: 1000 },
};

// ─── Helper Functions ────────────────────────────────────────────────

function normalizeText(text) {
  return text.toLowerCase().trim().replace(/[^\w\s]/g, "");
}

function matchScore(query, text) {
  const q = normalizeText(query);
  const t = normalizeText(text);
  if (t === q) return 100;
  if (t.includes(q)) return 80;
  
  const queryWords = q.split(/\s+/);
  const textWords = t.split(/\s+/);
  let matched = 0;
  for (const qw of queryWords) {
    if (textWords.some(tw => tw.includes(qw) || qw.includes(tw))) {
      matched++;
    }
  }
  return queryWords.length > 0 ? (matched / queryWords.length) * 70 : 0;
}

function detectIntent(input) {
  const lower = input.toLowerCase().trim();
  
  // Check each intent's keywords
  let bestIntent = null;
  let bestScore = 0;
  
  for (const [intent, keywords] of Object.entries(INTENTS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        const score = kw.length; // Longer matches are more specific
        if (score > bestScore) {
          bestScore = score;
          bestIntent = intent;
        }
      }
    }
  }
  
  return bestIntent || "SEARCH"; // Default to search
}

function detectCategory(input) {
  const lower = input.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return cat;
    }
  }
  return null;
}

function extractPriceLimit(input) {
  const match = input.match(/(?:under|below|less than|upto|up to|within|max|maximum)\s*₹?\s*(\d[\d,]*)/i);
  if (match) return parseInt(match[1].replace(/,/g, ""));
  
  const match2 = input.match(/₹?\s*(\d[\d,]*)\s*(?:or less|or below|max|maximum|budget)/i);
  if (match2) return parseInt(match2[1].replace(/,/g, ""));
  
  return null;
}

function extractCouponCode(input) {
  const upper = input.toUpperCase();
  for (const code of Object.keys(COUPONS)) {
    if (upper.includes(code)) return code;
  }
  return null;
}

function extractQuantity(input) {
  const match = input.match(/(\d+)\s*(?:pieces?|items?|packets?|packs?|qty|quantity|units?|nos?|x)/i);
  if (match) return parseInt(match[1]);
  
  const match2 = input.match(/(?:add|buy|order|get)\s+(\d+)\s/i);
  if (match2) return parseInt(match2[1]);
  
  return 1;
}

function searchProducts(query, category = null, priceLimit = null, maxResults = 6) {
  let candidates = [...productsData];
  
  // Filter by category if specified
  if (category) {
    candidates = candidates.filter(p => p.categorySlug === category);
  }
  
  // Filter by price if specified
  if (priceLimit) {
    candidates = candidates.filter(p => p.price <= priceLimit);
  }
  
  // Score each product against the query
  const scored = candidates.map(p => {
    const titleScore = matchScore(query, p.title);
    const brandScore = matchScore(query, p.brand);
    const catScore = matchScore(query, p.category);
    const descScore = p.description ? matchScore(query, p.description) : 0;
    
    // Bonus for in-stock items
    const stockBonus = p.stockStatus === "out-of-stock" ? -20 : 0;
    // Bonus for rating
    const ratingBonus = (p.rating || 0) * 3;
    // Bonus for discount
    const discountBonus = (p.originalPrice && p.originalPrice > p.price) ? 10 : 0;
    
    const score = Math.max(titleScore, brandScore, catScore, descScore) + stockBonus + ratingBonus + discountBonus;
    
    return { product: p, score };
  });
  
  // Sort by score, then rating
  scored.sort((a, b) => b.score - a.score || (b.product.rating || 0) - (a.product.rating || 0));
  
  return scored.slice(0, maxResults).filter(s => s.score > 10).map(s => s.product);
}

function findBestMatch(query, category = null) {
  const results = searchProducts(query, category, null, 1);
  return results[0] || null;
}

function getTopRated(category = null, limit = 6) {
  let candidates = [...productsData];
  if (category) {
    candidates = candidates.filter(p => p.categorySlug === category);
  }
  candidates = candidates.filter(p => p.stockStatus !== "out-of-stock");
  candidates.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return candidates.slice(0, limit);
}

function getDeals(category = null, limit = 6) {
  let candidates = [...productsData];
  if (category) {
    candidates = candidates.filter(p => p.categorySlug === category);
  }
  candidates = candidates.filter(p => p.originalPrice && p.originalPrice > p.price && p.stockStatus !== "out-of-stock");
  candidates.sort((a, b) => {
    const discA = (a.originalPrice - a.price) / a.originalPrice;
    const discB = (b.originalPrice - b.price) / b.originalPrice;
    return discB - discA;
  });
  return candidates.slice(0, limit);
}

function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function getProductSummary(p) {
  const discount = p.originalPrice && p.originalPrice > p.price
    ? ` (${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% off!)`
    : "";
  const express = (p.categorySlug === "grocery" || p.categorySlug === "pharmacy")
    ? " ⚡ 10-min delivery"
    : "";
  return `${p.title} by ${p.brand} — ${formatPrice(p.price)}${discount} | ⭐ ${p.rating}/5${express}`;
}

// ─── Main Response Generator ─────────────────────────────────────────

function generateResponse(userMessage, cart = []) {
  const input = userMessage.trim();
  const lower = input.toLowerCase();
  const intent = detectIntent(input);
  const category = detectCategory(input);
  const priceLimit = extractPriceLimit(input);
  const quantity = extractQuantity(input);

  // Strip intent keywords to get the product search terms
  let searchTerms = lower;
  for (const keywords of Object.values(INTENTS)) {
    for (const kw of keywords) {
      searchTerms = searchTerms.replace(kw, "").trim();
    }
  }
  // Also strip common filler words
  searchTerms = searchTerms.replace(/\b(the|a|an|some|to|my|me|please|can|you|i|want|from|in|for|this|that|it|of)\b/g, "").trim();

  switch (intent) {
    // ─── Greeting ──────────────────────────────────────────────
    case "GREETING": {
      return {
        message: "👋 Hey there! I'm UniCart AI, your personal shopping assistant. I can help you find products, add items to your cart, apply coupons, navigate the store, and much more. What are you looking for today?",
        actions: []
      };
    }

    // ─── Help ──────────────────────────────────────────────────
    case "HELP": {
      return {
        message: "🤖 Here's what I can do for you:\n\n🔍 **Search** — \"Show me earbuds\", \"Find running shoes\"\n🛒 **Add to Cart** — \"Add Ultraboost shoes to cart\"\n💳 **Buy/Order** — \"Buy a kurta\", \"Order toor dal\"\n📦 **Track Orders** — \"Show my orders\"\n🎁 **Coupons** — \"Apply coupon WELCOME10\", \"Show me offers\"\n📍 **Location** — \"Use my current location\"\n🧭 **Navigate** — \"Go to cart\", \"Take me to checkout\"\n\nJust type or speak your request!",
        actions: []
      };
    }

    // ─── Location Detection ────────────────────────────────────
    case "LOCATION": {
      return {
        message: "📍 Detecting your location...",
        actions: [{ type: "GET_LOCATION" }]
      };
    }

    // ─── Login / Signup ────────────────────────────────────────
    case "LOGIN": {
      return {
        message: "🔐 Taking you to the login page!",
        actions: [{ type: "NAVIGATE", route: "/login" }]
      };
    }
    case "SIGNUP": {
      return {
        message: "📝 Taking you to create a new account!",
        actions: [{ type: "NAVIGATE", route: "/signup" }]
      };
    }

    // ─── View Cart ─────────────────────────────────────────────
    case "VIEW_CART": {
      if (!cart || cart.length === 0) {
        return {
          message: "🛒 Your cart is currently empty. Let me help you find some great products!",
          actions: [{ type: "NAVIGATE", route: "/cart" }]
        };
      }
      const cartItems = cart.map(item => 
        `• ${item.product.title} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`
      ).join("\n");
      const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return {
        message: `🛒 Here's what's in your cart:\n\n${cartItems}\n\n💰 Subtotal: ${formatPrice(total)}`,
        actions: [{ type: "NAVIGATE", route: "/cart" }]
      };
    }

    // ─── Checkout ──────────────────────────────────────────────
    case "CHECKOUT": {
      if (!cart || cart.length === 0) {
        return {
          message: "Your cart is empty! Add some products first before checking out.",
          actions: []
        };
      }
      return {
        message: "💳 Taking you to checkout! Review your order and complete the purchase.",
        actions: [{ type: "NAVIGATE", route: "/checkout" }]
      };
    }

    // ─── Track Orders ──────────────────────────────────────────
    case "TRACK_ORDERS": {
      return {
        message: "📦 Taking you to your orders page!",
        actions: [{ type: "NAVIGATE", route: "/orders" }]
      };
    }

    // ─── Clear Cart ────────────────────────────────────────────
    case "CLEAR_CART": {
      return {
        message: "🗑️ Your cart has been cleared.",
        actions: [{ type: "CLEAR_CART" }]
      };
    }

    // ─── Remove from Cart ──────────────────────────────────────
    case "REMOVE_FROM_CART": {
      const product = findBestMatch(searchTerms, category);
      if (product) {
        return {
          message: `✅ Removed ${product.title} from your cart.`,
          actions: [{ type: "REMOVE_FROM_CART", productId: product.id }]
        };
      }
      return {
        message: "I couldn't find that product in your cart. Please try again with a more specific name.",
        actions: [{ type: "NAVIGATE", route: "/cart" }]
      };
    }

    // ─── List Coupons ──────────────────────────────────────────
    case "LIST_COUPONS": {
      const couponList = Object.values(COUPONS).map(c => `🏷️ **${c.code}**: ${c.desc}`).join("\n");
      return {
        message: `🎁 Here are all available coupon codes:\n\n${couponList}\n\nSay "apply coupon [CODE]" to use one!`,
        actions: []
      };
    }

    // ─── Apply Coupon ──────────────────────────────────────────
    case "APPLY_COUPON": {
      const code = extractCouponCode(input);
      if (code) {
        return {
          message: `🏷️ Applying coupon code ${code}! ${COUPONS[code].desc}`,
          actions: [
            { type: "APPLY_PROMO", code },
            { type: "NAVIGATE", route: "/cart" }
          ]
        };
      }
      // Auto-recommend best coupon
      const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const hasGroceryPharmacy = cart.some(item => 
        item.product.categorySlug === "grocery" || item.product.categorySlug === "pharmacy"
      );
      
      let recommended;
      if (subtotal >= 2000) recommended = "UNICART10";
      else if (subtotal >= 1500) recommended = "SUPER20";
      else if (hasGroceryPharmacy && subtotal >= 1000) recommended = "INSTA300";
      else if (subtotal > 0) recommended = "WELCOME10";
      else recommended = "WELCOME10";
      
      return {
        message: `🎁 Based on your cart, I recommend: **${recommended}** — ${COUPONS[recommended].desc}. Applying it now!`,
        actions: [
          { type: "APPLY_PROMO", code: recommended },
          { type: "NAVIGATE", route: "/cart" }
        ]
      };
    }

    // ─── Navigate ──────────────────────────────────────────────
    case "NAVIGATE": {
      if (lower.includes("home") || lower.includes("homepage")) {
        return { message: "🏠 Taking you to the homepage!", actions: [{ type: "NAVIGATE", route: "/" }] };
      }
      if (lower.includes("cart")) {
        return { message: "🛒 Opening your cart!", actions: [{ type: "NAVIGATE", route: "/cart" }] };
      }
      if (lower.includes("checkout") || lower.includes("payment")) {
        return { message: "💳 Taking you to checkout!", actions: [{ type: "NAVIGATE", route: "/checkout" }] };
      }
      if (lower.includes("order")) {
        return { message: "📦 Taking you to your orders!", actions: [{ type: "NAVIGATE", route: "/orders" }] };
      }
      // Check for category navigation
      if (category) {
        const catName = category.charAt(0).toUpperCase() + category.slice(1);
        return {
          message: `📂 Taking you to the ${catName} category!`,
          actions: [{ type: "NAVIGATE", route: `/category/${category}` }]
        };
      }
      if (lower.includes("all product") || lower.includes("all items")) {
        return { message: "🛍️ Showing all products!", actions: [{ type: "NAVIGATE", route: "/category/all" }] };
      }
      return { message: "🧭 I'm not sure which page you want. Try: home, cart, checkout, orders, or a category name.", actions: [] };
    }

    // ─── Buy / Order ───────────────────────────────────────────
    case "BUY": {
      const product = findBestMatch(searchTerms, category);
      if (product) {
        if (product.stockStatus === "out-of-stock") {
          const alternatives = searchProducts(searchTerms, category, null, 4)
            .filter(p => p.stockStatus !== "out-of-stock" && p.id !== product.id);
          return {
            message: `❌ Sorry, ${product.title} is currently out of stock.${alternatives.length > 0 ? " Here are some similar alternatives:" : ""}`,
            actions: alternatives.length > 0
              ? [{ type: "SHOW_PRODUCTS", productIds: alternatives.map(p => p.id) }]
              : []
          };
        }
        return {
          message: `✅ Great choice! I've added **${product.title}** (${formatPrice(product.price)}) to your cart and taken you to checkout!`,
          actions: [
            { type: "ADD_TO_CART", productId: product.id, quantity },
            { type: "NAVIGATE", route: "/checkout" }
          ]
        };
      }
      // If no exact match, show search results
      const results = searchProducts(searchTerms, category, priceLimit);
      if (results.length > 0) {
        return {
          message: `I found ${results.length} product${results.length > 1 ? "s" : ""} matching your request. Which one would you like to buy?`,
          actions: [{ type: "SHOW_PRODUCTS", productIds: results.map(p => p.id) }]
        };
      }
      return { message: "I couldn't find that product in UniCart. Try searching with different keywords.", actions: [] };
    }

    // ─── Add to Cart ───────────────────────────────────────────
    case "ADD_TO_CART": {
      const product = findBestMatch(searchTerms, category);
      if (product) {
        if (product.stockStatus === "out-of-stock") {
          const alternatives = searchProducts(searchTerms, category, null, 4)
            .filter(p => p.stockStatus !== "out-of-stock" && p.id !== product.id);
          return {
            message: `❌ Sorry, ${product.title} is currently out of stock.${alternatives.length > 0 ? " Here are similar items:" : ""}`,
            actions: alternatives.length > 0
              ? [{ type: "SHOW_PRODUCTS", productIds: alternatives.map(p => p.id) }]
              : []
          };
        }
        return {
          message: `🛒 Added **${product.title}** (${formatPrice(product.price)}) x${quantity} to your cart!`,
          actions: [
            { type: "ADD_TO_CART", productId: product.id, quantity },
            { type: "NAVIGATE", route: "/cart" }
          ]
        };
      }
      // If no exact match, show options
      const results = searchProducts(searchTerms, category, priceLimit);
      if (results.length > 0) {
        return {
          message: `I found ${results.length} matching product${results.length > 1 ? "s" : ""}. Which one would you like to add to your cart?`,
          actions: [{ type: "SHOW_PRODUCTS", productIds: results.map(p => p.id) }]
        };
      }
      return { message: "I couldn't find that product in UniCart. Try different keywords.", actions: [] };
    }

    // ─── Deals ─────────────────────────────────────────────────
    case "DEALS": {
      const deals = getDeals(category);
      if (deals.length > 0) {
        const summaries = deals.slice(0, 3).map(p => getProductSummary(p)).join("\n");
        return {
          message: `🔥 Here are the best deals${category ? ` in ${category}` : ""}:\n\n${summaries}`,
          actions: [{ type: "SHOW_PRODUCTS", productIds: deals.map(p => p.id) }]
        };
      }
      return { message: "No deals found right now. Check back later!", actions: [] };
    }

    // ─── Compare ───────────────────────────────────────────────
    case "COMPARE": {
      const results = searchProducts(searchTerms, category, null, 2);
      if (results.length >= 2) {
        const p1 = results[0], p2 = results[1];
        const comparison = `📊 **Comparison:**\n\n` +
          `**${p1.title}** (${p1.brand})\n• Price: ${formatPrice(p1.price)} | Rating: ⭐ ${p1.rating}/5\n\n` +
          `**${p2.title}** (${p2.brand})\n• Price: ${formatPrice(p2.price)} | Rating: ⭐ ${p2.rating}/5\n\n` +
          `${p1.price < p2.price ? p1.title + " is more affordable" : p2.title + " is more affordable"}. ` +
          `${p1.rating > p2.rating ? p1.title + " has a higher rating." : p2.rating > p1.rating ? p2.title + " has a higher rating." : "Both have equal ratings."}`;
        return {
          message: comparison,
          actions: [{ type: "SHOW_PRODUCTS", productIds: [p1.id, p2.id] }]
        };
      }
      return { message: "I need at least 2 products to compare. Try \"compare earbuds\" or \"compare running shoes\".", actions: [] };
    }

    // ─── Budget / Search with price filter ─────────────────────
    case "BUDGET": {
      const limit = priceLimit || 1000;
      const results = searchProducts(searchTerms, category, limit);
      if (results.length > 0) {
        return {
          message: `💰 Here are products under ${formatPrice(limit)}${category ? ` in ${category}` : ""}:`,
          actions: [{ type: "SHOW_PRODUCTS", productIds: results.map(p => p.id) }]
        };
      }
      return { message: `No products found under ${formatPrice(limit)}. Try a higher budget?`, actions: [] };
    }

    // ─── Default: Search / Recommend ───────────────────────────
    case "SEARCH":
    default: {
      // If category is detected but no specific product query, show top products
      if (category && searchTerms.length < 3) {
        const topProducts = getTopRated(category);
        if (topProducts.length > 0) {
          const catName = category.charAt(0).toUpperCase() + category.slice(1);
          const summaries = topProducts.slice(0, 3).map(p => getProductSummary(p)).join("\n");
          return {
            message: `🛍️ Here are the top ${catName} products:\n\n${summaries}`,
            actions: [{ type: "SHOW_PRODUCTS", productIds: topProducts.map(p => p.id) }]
          };
        }
      }

      // General product search
      const results = searchProducts(searchTerms || input, category, priceLimit);
      if (results.length > 0) {
        const summaries = results.slice(0, 3).map(p => getProductSummary(p)).join("\n");
        return {
          message: `🔍 Here's what I found:\n\n${summaries}`,
          actions: [{ type: "SHOW_PRODUCTS", productIds: results.map(p => p.id) }]
        };
      }

      // If nothing found, try broader search
      const broadResults = searchProducts(input, null, null, 4);
      if (broadResults.length > 0) {
        return {
          message: `I couldn't find an exact match, but here are some related products:`,
          actions: [{ type: "SHOW_PRODUCTS", productIds: broadResults.map(p => p.id) }]
        };
      }

      // Truly nothing found
      return {
        message: "I couldn't find that in the current UniCart application. Try searching for products by name, brand, or category (clothing, electronics, pharmacy, cosmetics, grocery).",
        actions: []
      };
    }
  }
}

// ─── Public API (same interface as before) ───────────────────────────

/**
 * Format cart items into a summary string.
 */
export function formatCartSummary(cart) {
  if (!cart || cart.length === 0) return "Empty";
  return cart.map((item) =>
    `- ${item.product.title} (${item.product.id}) x${item.quantity} = ₹${(item.product.price * item.quantity).toLocaleString("en-IN")}${item.selectedVariant ? ` [${item.selectedVariant}]` : ""}`
  ).join("\n");
}

/**
 * Process a chat message and return a structured response.
 * This replaces the external API call with a fully local AI engine.
 * 
 * @param {Array} conversationHistory - Array of {role, content} messages
 * @param {string} userMessage - The new user message
 * @param {string} cartSummary - Current cart state summary
 * @param {Array} cartItems - The actual cart array (for smart coupon logic)
 * @returns {Promise<{message: string, actions: Array}>}
 */
export async function sendChatMessage(conversationHistory, userMessage, cartSummary, cartItems = []) {
  // Small delay to feel natural (instant responses feel robotic)
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
  
  try {
    return generateResponse(userMessage, cartItems);
  } catch (error) {
    console.error("Local AI Engine error:", error);
    return {
      message: "Something went wrong. Please try again.",
      actions: [],
    };
  }
}

/**
 * Find a product by ID from the local database.
 */
export function getProductById(productId) {
  return productsData.find((p) => p.id === productId) || null;
}

/**
 * Get all products.
 */
export function getAllProducts() {
  return productsData;
}
