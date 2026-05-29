import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

interface HeroProps {
  isActive: boolean;
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ isActive, onExplore }) => {
  return (
    <div className="panel hero-panel">
      {/* Glow Effect */}
      <motion.div
        className="hero-glow"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2, delay: 0.2, ease: 'easeOut' }}
      />

      <div className="hero-content" style={{ pointerEvents: isActive ? 'auto' : 'none' }}>
        <motion.h1
          className="hero-name"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        >
          Miguel Diamond
        </motion.h1>

        <motion.h2
          className="hero-role"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          Ingeniero en Informática
        </motion.h2>

        <motion.p
          className="hero-cta-text"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
        >
          "Creando software brillante como el diamante"
        </motion.p>

        <motion.button
          className="hero-btn"
          onClick={onExplore}
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
        >
          Explorar
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
      >
        <span className="hero-scroll-text">Scroll</span>
        <div className="hero-scroll-line" />
      </motion.div>
    </div>
  );
};
