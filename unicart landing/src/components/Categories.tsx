import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  gridClass: string;
  accentBg: string;
  isQuick?: boolean;
}

export const Categories: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const categories: CategoryItem[] = [
    {
      id: 'clothing',
      title: 'Clothing',
      subtitle: 'Elevated Wardrobe',
      description: 'Premium everyday essentials, organic linen shirts, and sustainable loungewear tailored for comfort.',
      imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
      gridClass: 'md:col-span-2 md:row-span-2 h-[450px] md:h-auto',
      accentBg: 'bg-ink/5',
    },
    {
      id: 'grocery',
      title: 'Grocery',
      subtitle: 'Fresh Harvest',
      description: 'Organic produce, seasonal greens, fresh dairy, and kitchen staples hand-selected for quality.',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
      gridClass: 'md:col-span-1 h-[300px] md:h-auto',
      accentBg: 'bg-olive-light/60',
      isQuick: true,
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy',
      subtitle: 'Wellness & Care',
      description: 'OTC medications, wellness supplements, vitamins, and first-aid kits dispatched to your door.',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
      gridClass: 'md:col-span-1 h-[300px] md:h-auto',
      accentBg: 'bg-olive-light/40',
      isQuick: true,
    },
    {
      id: 'electronics',
      title: 'Electronics',
      subtitle: 'Modern Gadgets',
      description: 'Workstation tools, chargers, high-quality audio gear, and smart home items from top brands.',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
      gridClass: 'md:col-span-2 h-[300px]',
      accentBg: 'bg-ink/5',
    },
    {
      id: 'cosmetics',
      title: 'Cosmetics',
      subtitle: 'Aesthetic Beauty',
      description: 'Clean skincare, botanical serums, hair care products, and cosmetics for your daily self-care ritual.',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
      gridClass: 'md:col-span-1 h-[300px]',
      accentBg: 'bg-pink-50',
    },
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Fade and slide the header group
      gsap.fromTo('.gsap-cat-header',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Slide in the bento item cards with stagger
      gsap.fromTo('.gsap-bento-item',
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gsap-bento-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Parallax scroll for background glow blob
      gsap.to('.gsap-cat-bg', {
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
    <section ref={sectionRef} id="categories" className="py-24 px-5 sm:px-8 lg:px-10 bg-cream relative overflow-hidden">
      {/* Background Soft Glow Blob for SaaS styling */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-olive-light/20 blur-[150px] pointer-events-none z-0 gsap-cat-bg" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="gsap-cat-header opacity-0 flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-olive text-sm font-semibold tracking-wider uppercase flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4" />
              Tailored Selection
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-normal text-ink leading-tight">
              Shop by Category
            </h2>
          </div>
          <p className="text-ink-muted text-sm sm:text-base max-w-md mt-4 md:mt-0 font-sans">
            From daily 10-minute essentials to next-day lifestyle items. Add anything to your single unified cart.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="gsap-bento-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`rounded-3xl overflow-hidden relative group flex flex-col justify-between p-6 shadow-sm border border-ink/5 transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 hover:ring-1 hover:ring-olive-hover/20 gsap-bento-item opacity-0 ${cat.gridClass} ${cat.accentBg}`}
            >
              {/* Image Background (with zoom effect on hover) */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  className="w-full h-full object-cover mix-blend-multiply opacity-80 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent z-1" />
              </div>

              {/* Top Row: Tags */}
              <div className="relative z-10 flex items-center justify-between w-full">
                {cat.isQuick ? (
                  <span className="bg-[#D9782A] text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                    ⚡ 10 MIN DELIVERY
                  </span>
                ) : (
                  <span className="bg-white/90 text-ink text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase">
                    STANDARD SHIPPING
                  </span>
                )}
                
                {/* Arrow indicator */}
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-white group-hover:text-ink transition-colors duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom Row: Text Content */}
              <div className="relative z-10 text-white mt-auto pt-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FBEFC6] opacity-90 block mb-1">
                  {cat.subtitle}
                </span>
                <h3 className="font-display text-2xl font-semibold leading-tight mb-2">
                  {cat.title}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed font-sans line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
