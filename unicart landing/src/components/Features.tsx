import React, { useEffect, useRef } from 'react';
import { Sparkles, ShoppingBag, Cpu, CheckCircle2, DollarSign, Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Features: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Animate text column
      gsap.fromTo('.gsap-feat-text',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Animate individual feature blocks in a staggered sequence
      gsap.fromTo('.gsap-feat-block',
        { x: -35, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gsap-feat-list',
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Animate the right column browser simulated console card
      gsap.fromTo('.gsap-feat-console',
        { y: 60, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gsap-feat-console',
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Stagger items inside the console card
      gsap.fromTo('.gsap-console-item',
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gsap-feat-console',
            start: 'top 65%',
            toggleActions: 'play none none none'
          }
        }
      );
      // Parallax scroll for background glow blob
      gsap.to('.gsap-feat-bg', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-24 px-5 sm:px-8 lg:px-10 bg-white relative overflow-hidden">
      {/* Background Soft Glow Blob for SaaS styling */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] rounded-full bg-olive-light/20 blur-[150px] pointer-events-none z-0 gsap-feat-bg" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Text & Features list */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="gsap-feat-text opacity-0">
              <span className="text-olive text-sm font-semibold tracking-wider uppercase flex items-center gap-1.5 mb-2">
                <Cpu className="w-4.5 h-4.5" />
                Autonomous Shopping
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-normal text-ink leading-[1.1] mb-6">
                Agentic AI Meets Hybrid Commerce
              </h2>
              <p className="text-ink-muted text-sm sm:text-base leading-relaxed mb-8 font-sans">
                Unicart breaks down the barriers of traditional online shopping. By combining a natural-language AI agent with a blended delivery network, you get instant essentials and specialized items in one checkout.
              </p>
            </div>

            {/* Feature Blocks */}
            <div className="gsap-feat-list flex flex-col gap-8">
              
              {/* Feature 1 */}
              <div className="gsap-feat-block opacity-0 flex gap-4 items-start hover:-translate-x-0.5 transition-transform duration-300">
                <div className="w-10 h-10 rounded-xl bg-olive-light flex items-center justify-center text-olive shrink-0 shadow-sm mt-1 animate-pulse">
                  <Sparkles className="w-5 h-5 fill-olive" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">
                    Agentic AI Shopper
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                    Skip searching through tabs. Type what you need—from dinner lists to medical prescriptions—and the AI autonomously handles product comparison, reviews, and ingredient vetting.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="gsap-feat-block opacity-0 flex gap-4 items-start hover:-translate-x-0.5 transition-transform duration-300">
                <div className="w-10 h-10 rounded-xl bg-olive-light flex items-center justify-center text-olive shrink-0 shadow-sm mt-1">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">
                    Unified Hybrid Cart
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                    Order milk, organic cosmetics, noise-canceling headphones, and allergy pills at once. Unicart intelligently routes immediate items in 10 minutes, and bundles the rest for next-day dispatch.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="gsap-feat-block opacity-0 flex gap-4 items-start hover:-translate-x-0.5 transition-transform duration-300">
                <div className="w-10 h-10 rounded-xl bg-olive-light flex items-center justify-center text-olive shrink-0 shadow-sm mt-1">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">
                    Auto-Optimizing Pricing Engine
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                    Our backend agent runs real-time coupon matching, selects the closest warehouse coordinates, and compares local prices to secure the absolute lowest cost for your basket.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Visual AI Execution Flow (Sticky) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 w-full">
            <div className="gsap-feat-console opacity-0 rounded-3xl bg-cream ring-1 ring-ink/5 shadow-xl p-6 sm:p-8 relative overflow-hidden text-left border border-ink/5 hover:shadow-2xl transition-shadow duration-500">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-ink/10 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-olive animate-pulse" />
                  <span className="text-xs font-bold text-ink tracking-wide uppercase">
                    Unicart AI Session
                  </span>
                </div>
                <span className="text-[10px] text-ink-muted bg-white px-2.5 py-0.5 rounded-full font-medium">
                  Optimized
                </span>
              </div>

              {/* Chat Input Prompt Simulation */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5 mb-5 relative">
                <span className="absolute -top-2 left-4 bg-olive text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  User Prompt
                </span>
                <p className="text-sm font-medium text-ink leading-relaxed font-sans italic mt-1">
                  "I need fresh organic spinach, 2 lemons, a basic USB-C charger, and a daily multivitamin. Use any coupons."
                </p>
              </div>

              {/* AI Agent Processing Output */}
              <div className="flex flex-col gap-4">
                
                {/* Step 1: Grocery */}
                <div className="gsap-console-item opacity-0 flex items-center justify-between bg-white/50 rounded-xl p-3 border border-ink/5 hover:bg-white hover:ring-1 hover:ring-olive-hover/10 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-olive-light flex items-center justify-center text-olive text-[10px] font-bold">
                      🥬
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-ink leading-tight">Organic Spinach & Lemons</span>
                      <span className="text-[9px] text-[#D9782A] font-bold flex items-center gap-0.5 mt-0.5">
                        <Clock className="w-2.5 h-2.5" /> 10 MINS DISPATCH
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-ink block">₹145</span>
                    <span className="text-[9px] text-ink-muted font-sans">Organic Farms Ltd.</span>
                  </div>
                </div>

                {/* Step 2: Pharmacy */}
                <div className="gsap-console-item opacity-0 flex items-center justify-between bg-white/50 rounded-xl p-3 border border-ink/5 hover:bg-white hover:ring-1 hover:ring-olive-hover/10 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-olive-light flex items-center justify-center text-olive text-[10px] font-bold">
                      💊
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-ink leading-tight">Daily Multivitamin (60 Capsules)</span>
                      <span className="text-[9px] text-[#D9782A] font-bold flex items-center gap-0.5 mt-0.5">
                        <Clock className="w-2.5 h-2.5" /> 10 MINS DISPATCH
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-ink block">₹380</span>
                    <span className="text-[9px] text-ink-muted font-sans">Care Pharmacies</span>
                  </div>
                </div>

                {/* Step 3: Electronics */}
                <div className="gsap-console-item opacity-0 flex items-center justify-between bg-white/50 rounded-xl p-3 border border-ink/5 hover:bg-white hover:ring-1 hover:ring-olive-hover/10 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-ink/5 flex items-center justify-center text-ink text-[10px] font-bold">
                      🔌
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-ink leading-tight">USB-C Charger (18W Fast Charge)</span>
                      <span className="text-[9px] text-ink-muted font-bold flex items-center gap-0.5 mt-0.5">
                        📦 STANDARD DELIVERY (TOMORROW)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-ink block">₹699</span>
                    <span className="text-[9px] text-ink-muted font-sans">TechHub Warehouse</span>
                  </div>
                </div>

              </div>

              {/* Summary checkout footer inside agent panel */}
              <div className="mt-5 pt-4 border-t border-ink/10 flex items-center justify-between bg-white -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6">
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase font-bold tracking-wider">
                    unified subtotal
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-lg font-bold text-ink">₹1,224</span>
                    <span className="text-xs line-through text-ink/40 font-medium">₹1,349</span>
                    <span className="text-[10px] bg-olive/10 text-olive px-1.5 py-0.5 rounded font-bold">
                      Saved ₹125
                    </span>
                  </div>
                </div>
                
                <button className="bg-ink hover:bg-ink-muted text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer">
                  <CheckCircle2 className="w-3.5 h-3.5 text-olive fill-white" />
                  Approve Order
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
