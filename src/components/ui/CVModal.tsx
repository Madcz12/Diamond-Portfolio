import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './CVModal.css';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`cv-modal-backdrop ${isOpen ? 'cv-modal-open' : ''}`}
      ref={modalRef}
      onClick={handleBackdropClick}
    >
      <div className="cv-modal-content">
        {/* Close button */}
        <button className="cv-modal-close" onClick={onClose} aria-label="Close modal">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Header */}
        <div className="cv-modal-header">
          <span className="cv-modal-label">CURRICULUM VITAE</span>
          <h2 className="cv-modal-title">Descargar CV</h2>
          <p className="cv-modal-subtitle">Selecciona el idioma de tu preferencia</p>
        </div>

        {/* CV Cards */}
        <div className="cv-modal-cards">
          {/* Spanish CV */}
          <a
            href="/cv/CV_Miguel_Diamond_Software_Engineer_ES.pdf"
            download="CV_Miguel_Diamond_ES.pdf"
            className="cv-card"
            id="cv-download-es"
          >
            <div className="cv-card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
            </div>
            <div className="cv-card-info">
              <span className="cv-card-lang">Español</span>
              <span className="cv-card-flag">🇪🇸</span>
            </div>
            <span className="cv-card-action">Descargar PDF</span>
            <div className="cv-card-shimmer" />
          </a>

          {/* English CV */}
          <a
            href="/cv/CV_Miguel_Diamond_Software_Engineer_EN.pdf"
            download="CV_Miguel_Diamond_EN.pdf"
            className="cv-card"
            id="cv-download-en"
          >
            <div className="cv-card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
            </div>
            <div className="cv-card-info">
              <span className="cv-card-lang">English</span>
              <span className="cv-card-flag">🇺🇸</span>
            </div>
            <span className="cv-card-action">Download PDF</span>
            <div className="cv-card-shimmer" />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};
