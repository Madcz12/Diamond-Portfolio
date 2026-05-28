import React, { useState, useEffect } from 'react';
import './Nav.css';

interface NavProps {
  currentPanel: number;
  onNavigate: (index: number) => void;
}

export const Nav: React.FC<NavProps> = ({ currentPanel, onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show nav from panel 1 onwards
    if (currentPanel > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [currentPanel]);

  const navItems = [
    { label: 'Sobre mí', index: 1 },
    { label: 'Tecnologías', index: 2 },
    { label: 'Proyectos', index: 3 },
    { label: 'Certificaciones', index: 4 },
    { label: 'Contacto', index: 5 },
  ];

  return (
    <nav className={`global-nav ${isVisible ? 'visible' : ''}`}>
      <div className="nav-logo" onClick={() => onNavigate(0)}>
        M · Diamond
      </div>
      <div className="nav-links">
        {navItems.map((item) => (
          <div
            key={item.index}
            className={`nav-item ${currentPanel === item.index ? 'active' : ''}`}
            onClick={() => onNavigate(item.index)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </nav>
  );
};
