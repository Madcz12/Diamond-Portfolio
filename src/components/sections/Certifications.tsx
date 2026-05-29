import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { DiamondBackground } from '../ui/DiamondBackground';
// pdfjs-dist import removed to improve bundle size and loading speed
import './Certifications.css';

// pdfjs-dist worker initialization removed

interface CertificationsProps {
  isActive: boolean;
}

interface CertData {
  name: string;
  issuer: string;
  file: string;
  image: string;
}

/* ─── Certificate Thumbnail sub-component ─── */
const CertThumbnail: React.FC<{
  imageUrl: string;
  alt: string;
}> = ({ imageUrl, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`cert-thumbnail ${loaded ? 'loaded' : ''}`}>
      <img 
        src={imageUrl} 
        alt={alt} 
        className="cert-canvas" 
        onLoad={() => setLoaded(true)} 
      />
      {!loaded && (
        <div className="cert-loading">
          <div className="cert-loading-spinner" />
        </div>
      )}
    </div>
  );
};

/* ─── Lightbox modal ─── */
const CertLightbox: React.FC<{
  imageUrl: string | null;
  certName: string;
  onClose: () => void;
}> = ({ imageUrl, certName, onClose }) => {
  const [loading, setLoading] = useState(true);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!imageUrl) return null;

  return (
    <div className="cert-lightbox-overlay" onClick={onClose}>
      <div className="cert-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="cert-lightbox-close" onClick={onClose} aria-label="Cerrar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <h3 className="cert-lightbox-title">{certName}</h3>
        <div className="cert-lightbox-canvas-wrap">
          {loading && (
            <div className="cert-lightbox-loading">
              <div className="cert-loading-spinner large" />
            </div>
          )}
          <img
            src={imageUrl}
            alt={certName}
            className={`cert-lightbox-image ${loading ? 'hidden' : ''}`}
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
    </div>
  );
};

/* ─── Main section ─── */
export const Certifications: React.FC<CertificationsProps> = ({ isActive }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [lightbox, setLightbox] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsRevealed(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsRevealed(false);
      setLightbox(null); // close lightbox when leaving the panel
    }
  }, [isActive]);

  const revealClass = `reveal-up ${isRevealed ? 'revealed' : ''}`;

  const certs: CertData[] = [
    {
      name: 'Certificado NestJS: Nest — Desarrollo de backend escalable con Node',
      issuer: 'Dev/Talles',
      file: '/cert-nest.pdf',
      image: '/Nest.PNG'
    },
    {
      name: 'Certificado React PRO: React PRO, lleva tus bases al siguiente nivel',
      issuer: 'Dev/Talles',
      file: '/cert-react-pro.pdf',
      image: '/ReactPRO.PNG'
    },
    {
      name: 'Certificado React: De Cero a Experto (Hooks y MERN)',
      issuer: 'Dev/Talles',
      file: '/cert-react-ceroexperto.pdf',
      image: '/ReactBasico.PNG'
    }
  ];

  const openLightbox = useCallback((cert: CertData) => {
    setLightbox({ url: cert.image, name: cert.name });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  return (
    <div className="panel">
      <DiamondBackground variant={4} />
      <div className="panel-inner">
        <h3 className={`section-label ${revealClass}`}>04 · Certificaciones</h3>
        <h2 className={`section-title ${revealClass}`}>Formación continua</h2>

        <div className={`certs-grid ${revealClass}`}>
          {certs.map((cert, index) => (
            <div className="cert-card" key={index} onClick={() => openLightbox(cert)} role="button" tabIndex={isActive ? 0 : -1} onKeyDown={(e) => { if (isActive && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openLightbox(cert); } }}>
              <CertThumbnail imageUrl={cert.image} alt={cert.name} />
              <div className="cert-info">
                <h4 className="cert-name">{cert.name}</h4>
                <div className="cert-meta">
                  <span className="cert-issuer">{cert.issuer}</span>
                  <span className="cert-separator">·</span>
                  <a
                    href="#"
                    className="cert-link"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openLightbox(cert);
                    }}
                  >
                    Ver certificado
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isActive && lightbox && createPortal(
        <CertLightbox
          imageUrl={lightbox.url}
          certName={lightbox.name}
          onClose={closeLightbox}
        />,
        document.body
      )}
    </div>
  );
};
