import React, { useEffect, useRef, useState } from 'react';
import './Cursor.css';

export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const cursorActive = useRef(false);

  // Position state for lerp
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Check if it's a touch device
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const onMouseMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      
      // Initial positioning without delay
      if (!cursorActive.current) {
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        cursorActive.current = true;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    const render = () => {
      // Lerp for smooth ring following
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      requestRef.current = requestAnimationFrame(render);
    };
    requestRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </>
  );
};
