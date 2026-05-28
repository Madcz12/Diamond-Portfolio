import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DiamondBackground } from '../ui/DiamondBackground';
import * as pdfjsLib from 'pdfjs-dist';
import './Certifications.css';

// Configure the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

interface CertificationsProps {
  isActive: boolean;
}

interface CertData {
  name: string;
  issuer: string;
  file: string;
}

/* ─── PDF Thumbnail sub-component ─── */
const PdfThumbnail: React.FC<{
  pdfUrl: string;
  onClick: () => void;
}> = ({ pdfUrl, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);

        if (cancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Render at a resolution that fills the thumbnail box nicely
        const desiredWidth = 400; // CSS pixels × 2 for retina
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = desiredWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, canvas, viewport }).promise;

        if (!cancelled) setLoaded(true);
      } catch (err) {
        console.error('Error rendering PDF thumbnail:', err);
      }
    };

    render();
    return () => { cancelled = true; };
  }, [pdfUrl]);

  return (
    <div className={`cert-thumbnail ${loaded ? 'loaded' : ''}`} onClick={onClick}>
      <canvas ref={canvasRef} className="cert-canvas" />
      {!loaded && (
        <div className="cert-loading">
          <div className="cert-loading-spinner" />
        </div>
      )}
      <div className="cert-hover-overlay">
        <span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          Ver certificado
        </span>
      </div>
    </div>
  );
};

/* ─── Lightbox modal ─── */
const CertLightbox: React.FC<{
  pdfUrl: string | null;
  certName: string;
  onClose: () => void;
}> = ({ pdfUrl, certName, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Render high-res PDF page
  useEffect(() => {
    if (!pdfUrl) return;
    let cancelled = false;
    setLoading(true);

    const render = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);

        if (cancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // High-res render for the lightbox
        const desiredWidth = 1200;
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = desiredWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, canvas, viewport }).promise;
        if (!cancelled) setLoading(false);
      } catch (err) {
        console.error('Error rendering PDF lightbox:', err);
      }
    };

    render();
    return () => { cancelled = true; };
  }, [pdfUrl]);

  if (!pdfUrl) return null;

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
          <canvas
            ref={canvasRef}
            className={`cert-lightbox-canvas ${loading ? 'hidden' : ''}`}
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
    }
  }, [isActive]);

  const revealClass = `reveal-up ${isRevealed ? 'revealed' : ''}`;

  const certs: CertData[] = [
    {
      name: 'NestJS',
      issuer: 'Udemy',
      file: '/cert-nest.pdf'
    },
    {
      name: 'React Pro',
      issuer: 'Udemy',
      file: '/cert-react-pro.pdf'
    },
    {
      name: 'React — De Cero a Experto',
      issuer: 'Udemy',
      file: '/cert-react-ceroexperto.pdf'
    }
  ];

  const openLightbox = useCallback((cert: CertData) => {
    setLightbox({ url: cert.file, name: cert.name });
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
            <div className="cert-card" key={index}>
              <PdfThumbnail
                pdfUrl={cert.file}
                onClick={() => openLightbox(cert)}
              />
              <div className="cert-info">
                <h4 className="cert-name">{cert.name}</h4>
                <span className="cert-issuer">{cert.issuer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <CertLightbox
          pdfUrl={lightbox.url}
          certName={lightbox.name}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
};
