import React from 'react';
import './FacetIndicator.css';

interface FacetIndicatorProps {
  currentPanel: number;
  onNavigate: (index: number) => void;
  totalPanels?: number;
}

export const FacetIndicator: React.FC<FacetIndicatorProps> = ({ 
  currentPanel, 
  onNavigate, 
  totalPanels = 6 
}) => {
  const sections = [
    'Hero',
    'Sobre mí',
    'Tecnologías',
    'Proyectos',
    'Certificaciones',
    'Contacto'
  ];

  return (
    <div className={`facet-indicator ${currentPanel === 0 ? 'hidden' : ''}`}>
      {Array.from({ length: totalPanels }).map((_, index) => (
        <div 
          key={index}
          className="facet-dot-wrapper"
          onClick={() => onNavigate(index)}
        >
          <div className="facet-tooltip">{sections[index]}</div>
          <div className={`facet-dot ${currentPanel === index ? 'active' : ''}`} />
        </div>
      ))}
    </div>
  );
};
