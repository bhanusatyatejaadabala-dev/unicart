import React, { useEffect, useRef } from 'react';
import { ArrowUp, Sparkles, Cpu, Zap, CheckCircle2, ShoppingBag } from 'lucide-react';
import gsap from 'gsap';
import Navbar from './Navbar';
import ProductMockup from './ProductMockup';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a unified entrance timeline with power3 eases
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.gsap-line-1', 
        { y: 35, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, delay: 0.1 }
      )
      .fromTo('.gsap-line-2', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 }, 
        '-=0.6'
      )
      .fromTo('.gsap-search', 
        { y: 25, opacity: 0, scale: 0.98 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.75 }, 
        '-=0.6'
      )
      .fromTo('.gsap-desc', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.7 }, 
        '-=0.6'
      )
      .fromTo('.gsap-cta', 
        { y: 15, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6 }, 
        '-=0.5'
      )
      .fromTo('.gsap-mockup', 
        { y: 80, opacity: 0, scale: 0.96 }, 
        { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power4.out' }, 
        '-=0.8'
      );

      // Parallax scroll for background grid and glowing aurora blobs
      gsap.to('.gsap-bg-parallax', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Fade out hero content as we scroll down
      gsap.to('.gsap-content-fade', {
        opacity: 0,
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom 40%',
          scrub: true
        }
      });

      // Gently float left-side cards
      gsap.to('.gsap-float-card-left', {
        y: -10,
        x: -5,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      // Gently float right-side cards
      gsap.to('.gsap-float-card-right', {
        y: 10,
        x: 5,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 0.6
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[100svh] lg:h-[100svh] lg:min-h-[750px] overflow-hidden bg-gradient-to-br from-cream via-[#EDF2E4] to-cream flex flex-col"
      id="home"
    >
      {/* SaaS Geometric Grid Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 gsap-bg-parallax" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(91, 35, 51, 0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(91, 35, 51, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(circle at center, black 45%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 45%, transparent 95%)'
        }}
      />

      {/* Glowing Aurora SaaS background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-olive/15 blur-[120px] pointer-events-none z-1 gsap-bg-parallax" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-[#D9782A]/10 blur-[100px] pointer-events-none z-1 gsap-bg-parallax" />

      {/* Navbar overlay */}
      <Navbar />

      {/* Content wrapper */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-between text-center px-4 gsap-content-fade">
        
        {/* Spacer above content */}
        <div className="h-4 sm:h-6 lg:h-8 shrink-0" />

        {/* Hero Central Text Content */}
        <div className="max-w-3xl mx-auto flex flex-col items-center relative w-full animate-fade-in">
          
          {/* Floating cards on Left (desktop only) */}
          <div className="hidden xl:block absolute left-[-230px] top-[8%] w-[190px] text-left gsap-float-card-left gsap-line-1 opacity-0 z-20">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-md ring-1 ring-ink/5 border border-ink/5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-olive/10 text-olive flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-ink uppercase tracking-wider">AI Split Routing</span>
              </div>
              <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
                Blends local dark-stores (10m) with national e-comm in one unified checkout list.
              </p>
            </div>
          </div>
          
          <div className="hidden xl:block absolute left-[-270px] bottom-[22%] w-[200px] text-left gsap-float-card-left gsap-desc opacity-0 z-20">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-md ring-1 ring-ink/5 border border-ink/5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#D9782A]/10 text-[#D9782A] flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold text-ink uppercase tracking-wider">10-Min Dispatch</span>
              </div>
              <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
                Immediate dispatch for groceries, daily medicines, and household essentials.
              </p>
            </div>
          </div>

          {/* Floating cards on Right (desktop only) */}
          <div className="hidden xl:block absolute right-[-230px] top-[8%] w-[190px] text-left gsap-float-card-right gsap-line-2 opacity-0 z-20">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-md ring-1 ring-ink/5 border border-ink/5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-olive/10 text-olive flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-ink uppercase tracking-wider">AI Pricing Engine</span>
              </div>
              <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
                Real-time local warehouse price comparison + auto coupon matching.
              </p>
            </div>
          </div>
          
          <div className="hidden xl:block absolute right-[-270px] bottom-[22%] w-[200px] text-left gsap-float-card-right gsap-cta opacity-0 z-20">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-md ring-1 ring-ink/5 border border-ink/5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#1F3D26]/10 text-[#1F3D26] flex items-center justify-center">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-ink uppercase tracking-wider">Blended Commerce</span>
              </div>
              <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
                Check out electronics, pharmacy, clothing, and milk together.
              </p>
            </div>
          </div>

          {/* Staggered Heading */}
          <h1 className="text-ink font-display font-normal leading-[1.05] tracking-tight text-[40px] min-[400px]:text-[44px] sm:text-6xl lg:text-7xl xl:text-[80px] flex flex-col items-center">
            <span className="gsap-line-1 opacity-0">
              Everything you need,
            </span>
            <span className="gsap-line-2 opacity-0 text-olive mt-1">
              beautifully simple.
            </span>
          </h1>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="gsap-search opacity-0 mt-5 sm:mt-6 w-full max-w-xl px-2"
          >
            <div className="flex items-center gap-3 rounded-full bg-white/80 backdrop-blur-md ring-1 ring-ink/10 pl-5 pr-1.5 py-1.5 shadow-sm focus-within:ring-olive/45 transition-all">
              <input 
                type="text" 
                placeholder="Search for anything — groceries, gadgets, essentials" 
                className="flex-1 bg-transparent text-sm sm:text-base text-ink placeholder-ink/40 outline-none py-2 font-sans"
              />
              <button 
                type="submit"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-olive text-white hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center justify-center shadow-sm hover:bg-olive-hover"
                aria-label="Submit search"
              >
                <ArrowUp className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </form>

          {/* Description */}
          <p className="gsap-desc opacity-0 mt-4 sm:mt-5 text-ink/75 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md font-sans">
            Clothing, electronics, pharmacy, cosmetics and groceries in one cart —
            <br />
            some essentials delivered in as fast as{' '}
            <span className="inline-flex items-center gap-0.5 text-olive font-semibold whitespace-nowrap">
              <Sparkles className="inline w-4 h-4 text-olive" />
              10 minutes.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="gsap-cta opacity-0 mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-3">
            <a 
              href="http://localhost:5173/" 
              className="bg-olive text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-olive-hover active:bg-olive-active hover:shadow-lg transition-all"
            >
              Shop Now
            </a>
            <a 
              href="#features" 
              className="text-ink text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-ink/20 hover:bg-ink/5 bg-transparent transition-colors"
            >
              Browse Categories
            </a>
          </div>

          {/* Responsive row of tags for mobile/tablets */}
          <div className="xl:hidden flex flex-wrap justify-center gap-2 mt-6 max-w-md gsap-cta opacity-0 px-4">
            <div className="bg-white/70 backdrop-blur-md rounded-full py-1 px-2.5 shadow-sm ring-1 ring-ink/5 flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-olive" />
              <span className="text-[9px] font-semibold text-ink uppercase tracking-wide">AI Split Routing</span>
            </div>
            <div className="bg-white/70 backdrop-blur-md rounded-full py-1 px-2.5 shadow-sm ring-1 ring-ink/5 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-[#D9782A]" />
              <span className="text-[9px] font-semibold text-ink uppercase tracking-wide">10-Min Dispatch</span>
            </div>
            <div className="bg-white/70 backdrop-blur-md rounded-full py-1 px-2.5 shadow-sm ring-1 ring-ink/5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-olive" />
              <span className="text-[9px] font-semibold text-ink uppercase tracking-wide">AI Pricing</span>
            </div>
          </div>
        </div>

        {/* Spacer below hero content */}
        <div className="h-4 sm:h-6 lg:h-8 shrink-0" />

        {/* Mockup Container */}
        <div 
          className="gsap-mockup opacity-0 relative z-0 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0 -mb-10 sm:-mb-20 lg:-mb-32"
        >
          <ProductMockup />
        </div>
      </div>
    </section>
  );
};

export default Hero;
