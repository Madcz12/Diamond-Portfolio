import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const TOTAL_PANELS = 6; // Hero, About, Tech, Projects, Certifications, Contact
const WHEEL_COOLDOWN = 800;
const WHEEL_THRESHOLD = 30;
const TOUCH_THRESHOLD = 50;

interface UsePanelNavigationReturn {
  currentPanel: number;
  setPanel: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isAnimating: boolean;
}

export function usePanelNavigation(): UsePanelNavigationReturn {
  const [currentPanel, setCurrentPanel] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isAnimatingRef = useRef(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastWheelTime = useRef(0);
  const touchStartRef = useRef({ x: 0, y: 0 });

  const animateToPanel = useCallback((index: number) => {
    if (index < 0 || index >= TOTAL_PANELS || isAnimatingRef.current) return;
    if (index === currentPanel) return;

    isAnimatingRef.current = true;
    setIsAnimating(true);
    setCurrentPanel(index);

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        x: -index * window.innerWidth,
        duration: 1.2,
        ease: 'power3.inOut',
        onComplete: () => {
          isAnimatingRef.current = false;
          setIsAnimating(false);
        },
      });
    }
  }, [currentPanel]);

  const goNext = useCallback(() => {
    animateToPanel(currentPanel + 1);
  }, [currentPanel, animateToPanel]);

  const goPrev = useCallback(() => {
    animateToPanel(currentPanel - 1);
  }, [currentPanel, animateToPanel]);

  const setPanel = useCallback((index: number) => {
    animateToPanel(index);
  }, [animateToPanel]);

  // Wheel handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime.current < WHEEL_COOLDOWN) return;
      if (isAnimatingRef.current) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < WHEEL_THRESHOLD) return;

      lastWheelTime.current = now;
      if (delta > 0) goNext();
      else goPrev();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [goNext, goPrev]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current) return;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goPrev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Touch/Swipe handler
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      const touch = e.changedTouches[0];
      const deltaX = touchStartRef.current.x - touch.clientX;
      const deltaY = touchStartRef.current.y - touch.clientY;

      // Only navigate on horizontal swipe to allow vertical scrolling on mobile
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) < TOUCH_THRESHOLD) return;
        if (deltaX > 0) goNext();
        else goPrev();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goNext, goPrev]);

  // Handle resize — re-snap to current panel
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        gsap.set(containerRef.current, {
          x: -currentPanel * window.innerWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPanel]);

  return {
    currentPanel,
    setPanel,
    goNext,
    goPrev,
    containerRef,
    isAnimating,
  };
}
