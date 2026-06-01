import React from 'react';
import './ArrowButtons.css';

interface ArrowButtonsProps {
  onNext: () => void;
  onPrev: () => void;
  currentPanel: number;
  totalPanels?: number;
}

export const ArrowButtons: React.FC<ArrowButtonsProps> = ({ 
  onNext, 
  onPrev, 
  currentPanel, 
  totalPanels = 6 
}) => {
  const isHero = currentPanel === 0;

  return (
    <div className={`arrow-buttons-container ${isHero ? 'hero-active' : ''}`}>
      <button 
        className={`arrow-btn ${currentPanel === 0 ? 'disabled' : ''} ${isHero ? 'large' : ''}`}
        onClick={onPrev}
        disabled={currentPanel === 0}
        aria-label="Previous section"
      >
        <svg width={isHero ? "22" : "18"} height={isHero ? "22" : "18"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        className={`arrow-btn ${currentPanel === totalPanels - 1 ? 'disabled' : ''} ${isHero ? 'large' : ''}`}
        onClick={onNext}
        disabled={currentPanel === totalPanels - 1}
        aria-label="Next section"
      >
        <svg width={isHero ? "22" : "18"} height={isHero ? "22" : "18"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
