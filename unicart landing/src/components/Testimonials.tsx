import React, { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  review: string;
  avatarInitials: string;
  avatarBg: string;
}

export const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const testimonials: TestimonialItem[] = [
    {
      id: 1,
      name: 'Ananya Sharma',
      role: 'Product Designer · Mumbai',
      review: "I used to jump between three different apps to order groceries, prescription pills, and charging cables. Unicart's agentic search combined all of them into a single checkout and routed them perfectly. Truly a masterpiece of user experience.",
      avatarInitials: 'AS',
      avatarBg: 'bg-[#DCE8D0] text-ink',
    },
    {
      id: 2,
      name: 'Rahul Verma',
      role: 'Tech Lead · Bengaluru',
      review: "The AI agent is scarily smart. I typed 'allergy meds, oat milk, and a blue linen shirt size M', and it not only auto-applied the best coupons but also flagged that one grocery store had a lower price. Delivered in record time.",
      avatarInitials: 'RV',
      avatarBg: 'bg-olive-light text-olive-active',
    },
    {
      id: 3,
      name: 'Meera Nair',
      role: 'Independent Researcher · Delhi',
      review: "Fast dispatch for daily essentials combined with premium e-commerce catalogs makes this my default shopping page. The scaled interface and natural language checkout feel like the future.",
      avatarInitials: 'MN',
      avatarBg: 'bg-pink-100 text-pink-700',
    },
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Header slide
      gsap.fromTo('.gsap-test-header',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Cards slide-up stagger
      gsap.fromTo('.gsap-test-card',
        { y: 55, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gsap-test-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Parallax scroll for background glow blob
      gsap.to('.gsap-test-bg', {
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
    <section ref={sectionRef} id="testimonials" className="py-24 px-5 sm:px-8 lg:px-10 bg-cream border-t border-ink/5 relative overflow-hidden">
      {/* Background Soft Glow Blob for SaaS styling */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-olive-light/20 blur-[150px] pointer-events-none z-0 gsap-test-bg" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        
        {/* Header */}
        <div className="gsap-test-header opacity-0 max-w-xl mx-auto flex flex-col items-center mb-16">
          <span className="text-olive text-sm font-semibold tracking-wider uppercase mb-2">
            Customer Stories
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-normal text-ink leading-tight">
            Loved by Busy Shoppers
          </h2>
          <p className="text-ink-muted text-sm sm:text-base mt-4 font-sans leading-relaxed">
            See how Unicart is redefining checkout simplicity and speed for our community.
          </p>
        </div>

        {/* Grid */}
        <div className="gsap-test-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="gsap-test-card opacity-0 rounded-3xl bg-white p-8 shadow-sm border border-ink/5 flex flex-col justify-between text-left relative group hover:shadow-lg hover:-translate-y-1.5 hover:ring-1 hover:ring-olive-hover/10 transition-all duration-500"
            >
              {/* Quote Icon Overlay */}
              <div className="absolute top-6 right-6 text-ink/5 group-hover:text-ink/10 transition-colors duration-300">
                <Quote className="w-12 h-12 rotate-180 fill-current" />
              </div>

              <div>
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-5 text-[#D9782A]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans mb-6">
                  "{test.review}"
                </p>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-3 mt-4">
                <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center ${test.avatarBg}`}>
                  {test.avatarInitials}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-semibold text-ink leading-tight">
                    {test.name}
                  </span>
                  <span className="text-[10px] sm:text-xs text-ink-muted mt-0.5">
                    {test.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
