import React from 'react';

interface DiamondBackgroundProps {
  variant: number;
}

export const DiamondBackground: React.FC<DiamondBackgroundProps> = ({ variant }) => {
  // Return different geometric SVGs based on variant
  const getSvgContent = () => {
    switch (variant) {
      case 1: // About - Hexagon mesh
        return (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" stroke="white" strokeWidth="0.3" fill="none" />
            <line x1="10" y1="25" x2="90" y2="75" stroke="white" strokeWidth="0.1" />
            <line x1="10" y1="75" x2="90" y2="25" stroke="white" strokeWidth="0.1" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="0.1" />
          </svg>
        );
      case 2: // Tech - Grid/Network
        return (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,50 L100,50 M50,0 L50,100 M25,0 L75,100 M75,0 L25,100" stroke="white" strokeWidth="0.2" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.3" fill="none" />
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="0.1" fill="none" />
          </svg>
        );
      case 3: // Projects - Asymmetric polygon
        return (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <polygon points="20,10 80,30 90,80 40,90 10,60" stroke="white" strokeWidth="0.3" fill="none" />
            <line x1="20" y1="10" x2="90" y2="80" stroke="white" strokeWidth="0.1" />
            <line x1="80" y1="30" x2="10" y2="60" stroke="white" strokeWidth="0.1" />
            <line x1="40" y1="90" x2="20" y2="10" stroke="white" strokeWidth="0.1" />
          </svg>
        );
      case 4: // Certifications - Star/burst
        return (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40" stroke="white" strokeWidth="0.3" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.2" fill="none" />
          </svg>
        );
      case 5: // Contact - Triangle abstract
        return (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,10 90,90 10,90" stroke="white" strokeWidth="0.3" fill="none" />
            <polygon points="50,30 75,75 25,75" stroke="white" strokeWidth="0.2" fill="none" />
            <polygon points="50,50 65,65 35,65" stroke="white" strokeWidth="0.1" fill="none" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (variant === 0) return null; // No background for Hero

  return (
    <div className="diamond-bg">
      {getSvgContent()}
    </div>
  );
};
