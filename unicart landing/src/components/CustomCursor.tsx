import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const cursorRing = cursorRingRef.current;
    if (!cursorDot || !cursorRing) return;

    // Check if device supports hover/pointer interactions (desktop vs mobile)
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    if (!hasMouse) {
      cursorDot.style.display = 'none';
      cursorRing.style.display = 'none';
      return;
    }

    // Set initial transform anchor
    gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
    gsap.set(cursorRing, { xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
      gsap.to(cursorRing, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Set up hover states
    const onMouseEnterLink = () => {
      gsap.to(cursorDot, { scale: 1.6, backgroundColor: '#6B8E23', duration: 0.25 });
      gsap.to(cursorRing, { 
        scale: 1.8, 
        backgroundColor: 'rgba(107, 142, 35, 0.15)', 
        borderColor: '#6B8E23', 
        duration: 0.25 
      });
    };

    const onMouseLeaveLink = () => {
      gsap.to(cursorDot, { scale: 1, backgroundColor: '#6B8E23', duration: 0.25 });
      gsap.to(cursorRing, { 
        scale: 1, 
        backgroundColor: 'transparent', 
        borderColor: 'rgba(47, 58, 47, 0.4)', 
        duration: 0.25 
      });
    };

    // Select interactive elements
    const addListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"], .cursor-hover-scale');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterLink);
        el.addEventListener('mouseleave', onMouseLeaveLink);
      });
    };

    addListeners();

    // Re-attach listeners when DOM changes (in case components mount later)
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorDotRef} 
        className="hidden pointer-events-none fixed top-0 left-0 w-2 h-2 bg-olive rounded-full z-50 mix-blend-normal pointer-fine:block"
      />
      <div 
        ref={cursorRingRef} 
        className="hidden pointer-events-none fixed top-0 left-0 w-8 h-8 border border-ink/40 rounded-full z-50 pointer-fine:block"
      />
    </>
  );
};

export default CustomCursor;
