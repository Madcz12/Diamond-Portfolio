import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { DiamondBackground } from '../ui/DiamondBackground';
import './Projects.css';

interface ProjectsProps {
  isActive: boolean;
}

interface ProjectData {
  title: string;
  tag: string;
  stack: string[];
  description: string;
  thumbnail: string;
  screenshots: string[];
  github: string;
  demo: string;
}

/* ─── Lightbox Carousel Modal ─── */
const ProjectLightbox: React.FC<{
  project: ProjectData;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  // Close on Escape + keyboard nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goTo('prev');
      if (e.key === 'ArrowRight') goTo('next');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, currentSlide]);

  const goTo = (direction: 'prev' | 'next') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => {
      const total = project.screenshots.length;
      if (direction === 'prev') return (prev - 1 + total) % total;
      return (prev + 1) % total;
    });
    setTimeout(() => setIsAnimating(false), 400);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  return (
    <div className="proj-lightbox-overlay" onClick={onClose}>
      <div className="proj-lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="proj-lightbox-close" onClick={onClose} aria-label="Cerrar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Carousel Area */}
        <div className="proj-lightbox-carousel">
          {/* Navigation Arrows */}
          {project.screenshots.length > 1 && (
            <>
              <button className="proj-carousel-arrow proj-carousel-prev" onClick={() => goTo('prev')} aria-label="Anterior">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button className="proj-carousel-arrow proj-carousel-next" onClick={() => goTo('next')} aria-label="Siguiente">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Image Track */}
          <div className="proj-carousel-track">
            {project.screenshots.map((src, index) => (
              <div
                key={index}
                className={`proj-carousel-slide ${index === currentSlide ? 'active' : ''}`}
              >
                {!loadedImages.has(index) && (
                  <div className="proj-carousel-loading">
                    <div className="proj-loading-spinner" />
                  </div>
                )}
                <img
                  src={src}
                  alt={`${project.title} - Captura ${index + 1}`}
                  className={`proj-carousel-image ${loadedImages.has(index) ? 'loaded' : ''}`}
                  onLoad={() => handleImageLoad(index)}
                />
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          {project.screenshots.length > 1 && (
            <div className="proj-carousel-dots">
              {project.screenshots.map((_, index) => (
                <button
                  key={index}
                  className={`proj-carousel-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir a captura ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Project Info Area */}
        <div className="proj-lightbox-info">
          <div className="proj-lightbox-header">
            <span className="proj-lightbox-tag">{project.tag}</span>
            <h3 className="proj-lightbox-title">{project.title}</h3>
          </div>
          <p className="proj-lightbox-desc">{project.description}</p>
          <div className="proj-lightbox-stack">
            {project.stack.map((tech, i) => (
              <span className="proj-lightbox-pill" key={i}>{tech}</span>
            ))}
          </div>
          <div className="proj-lightbox-links">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="proj-lightbox-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Repositorio
              </a>
            )}
            {project.demo && (
              <a href={project.demo.startsWith('http') ? project.demo : `https://${project.demo}`} target="_blank" rel="noopener noreferrer" className="proj-lightbox-link proj-lightbox-link--primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Ver demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Projects Section ─── */
export const Projects: React.FC<ProjectsProps> = ({ isActive }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [lightbox, setLightbox] = useState<ProjectData | null>(null);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsRevealed(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsRevealed(false);
      setLightbox(null);
    }
  }, [isActive]);

  const revealClass = `reveal-up ${isRevealed ? 'revealed' : ''}`;

  const projects: ProjectData[] = [
    {
      title: 'Nailed Inventory',
      tag: 'CRM · Full Stack',
      stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma'],
      description: 'Plataforma CRM para administrar productos de uñas acrílicas. Recepción y salida de mercancía con facturación electrónica, gestión de clientes, proveedores, y reportes de inventario.',
      thumbnail: '/projects/naileddashboard.webp',
      screenshots: [
        '/projects/naileddashboard.webp',
        '/projects/naileddetails.webp',
        '/projects/nailedinventario.webp',
        '/projects/nailedinv.webp',
        '/projects/nailedroutes.webp',
      ],
      github: 'https://github.com/Madcz12/Nailed-Inventory.git',
      demo: 'https://nailed-inventory.vercel.app/login',
    },
    {
      title: 'Frontera Tours',
      tag: 'Landing Page · Web',
      stack: ['Next.js', 'TypeScript', 'CSS'],
      description: 'Landing page de Frontera Tours, empresa de transporte entre la frontera Brasil - Venezuela. Diseño moderno con secciones de servicios, paquetes, rutas, testimonios y contacto.',
      thumbnail: '/projects/fronteratoursmain.webp',
      screenshots: [
        '/projects/fronteratoursmain.webp',
      ],
      github: 'https://github.com/Madcz12/FronteraTours-Website.git',
      demo: 'https://frontera-tours.vercel.app',
    },
    {
      title: 'StellaTech E-Commerce',
      tag: 'E-Commerce · Full Stack',
      stack: ['Next.js', 'Stripe', 'TypeScript', 'Prisma'],
      description: 'E-Commerce de tecnología con pasarela de pago integrada (Stripe). Catálogo de productos, carrito de compras, panel de administración y gestión de pedidos.',
      thumbnail: '/projects/stellatechmain.webp',
      screenshots: [
        '/projects/stellatechmain.webp',
        '/projects/stellatechcatalog.webp',
        '/projects/stellatechadm.webp',
        '/projects/stellatechlogin.webp',
      ],
      github: 'https://github.com/Madcz12/NEXTJS-STELLATECH.git',
      demo: 'https://stellatech-ec.vercel.app',
    },
  ];

  const openLightbox = useCallback((project: ProjectData) => {
    setLightbox(project);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  return (
    <div className="panel">
      <DiamondBackground variant={3} />
      <div className="panel-inner">
        <h3 className={`section-label ${revealClass}`}>03 · Proyectos</h3>
        <h2 className={`section-title ${revealClass}`}>Obras talladas con código</h2>

        <div className={`projects-grid ${revealClass}`}>
          {projects.map((project, index) => (
            <div
              className="project-card"
              key={index}
              onClick={() => openLightbox(project)}
              role="button"
              tabIndex={isActive ? 0 : -1}
              onKeyDown={(e) => {
                if (isActive && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  openLightbox(project);
                }
              }}
            >
              {/* Thumbnail */}
              <div className="project-thumbnail">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="project-thumbnail-img"
                  loading="lazy"
                />
                <div className="project-thumbnail-overlay">
                  <span className="project-thumbnail-cta">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Ver detalles
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="project-body">
                <div className="project-header">
                  <span className="project-tag">{project.tag}</span>
                  <h4 className="project-title">{project.title}</h4>
                </div>
                <p className="project-desc">{project.description}</p>
                <div className="project-footer">
                  <div className="project-stack">
                    {project.stack.map((tech, techIndex) => (
                      <span className="stack-pill" key={techIndex}>{tech}</span>
                    ))}
                  </div>
                  <a
                    href="#"
                    className="project-details-link"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openLightbox(project);
                    }}
                  >
                    Ver detalles
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isActive && lightbox && createPortal(
        <ProjectLightbox
          project={lightbox}
          onClose={closeLightbox}
        />,
        document.body
      )}
    </div>
  );
};
