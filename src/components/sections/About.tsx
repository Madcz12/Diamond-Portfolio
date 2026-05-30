import React, { useEffect, useState } from 'react';
import { DiamondBackground } from '../ui/DiamondBackground';
import { CVModal } from '../ui/CVModal';
import './About.css';

interface AboutProps {
  isActive: boolean;
}

export const About: React.FC<AboutProps> = ({ isActive }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Small delay to ensure the panel has transitioned in before revealing
      const timer = setTimeout(() => setIsRevealed(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsRevealed(false);
    }
  }, [isActive]);

  const revealClass = `reveal-up ${isRevealed ? 'revealed' : ''}`;

  return (
    <div className="panel">
      <DiamondBackground variant={1} />
      <CVModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} />
      <div className="panel-inner about-panel-inner">
        <div className={`about-dashboard ${revealClass}`}>
          
          {/* Column 1: Personal Profile */}
          <div className="dashboard-col col-profile">
            <h3 className="section-label">01 · Sobre mí</h3>
            <div className="col-content animate-content">
              <p>Soy Ingeniero en Informática con 4 años de experiencia en el desarrollo de software.</p>
              <p>Me especializo en el área frontend del desarrollo web, sin embargo cuento con sólidos conocimientos con tecnologías backend.</p>
              <p>
                Trabajo en la intersección entre la ingeniería de producto, arquitectura de software técnica y
                colaboración con herramientas de IA, y así atacar el problema del negocio hasta llegar a la
                solución correcta.
              </p>
              <div className="value-prop-accent">
                <strong>Propuesta de valor:</strong><br />
                arquitectura de prompts, puente cliente-código, entregas consolidadas.
              </div>
              <button
                className="cv-download-btn"
                id="open-cv-modal"
                onClick={() => setIsCVModalOpen(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
                Descargar CV
              </button>
            </div>
          </div>

          {/* Column 2: Work Philosophy / Approach */}
          <div className="dashboard-col col-philosophy">
            <h3 className="section-label">01.1 · Enfoque</h3>
            <div className="col-content animate-content">
              <p>He trabajado creando interfaces de usuario intuitivas y eficientes para sistemas web empresariales.</p>
              <p>Actualmente hago uso de herramientas IA tales como modelos LLM para integrar y crear proyectos de acuerdo a la necesidad del cliente.</p>
              <p>Cuento con una sólida base en JavaScript y bases de datos. Autodidacta y dispuesto a colaborar en equipo desde la planeación a la ejecución.</p>
              
              <div className="migration-card">
                <span className="migration-title">MIGRACIÓN TECNOLÓGICA</span>
                <p>Migración de sistemas legacy en producción:</p>
                <div className="tech-migration-badge">
                  Laravel 5 · SQLServer · Bootstrap
                  <div className="migration-arrow">&darr;</div>
                  Laravel 10 · PostgreSQL · Vue · Tailwind
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Compact Experience Tree */}
          <div className="dashboard-col col-timeline">
            <h3 className="section-label">01.2 · Experiencia</h3>
            <div className="col-content animate-content">
              <div className="tree-timeline">
                <div className="tree-line"></div>
                
                <div className="tree-item">
                  <div className="tree-dot green-dot"></div>
                  <div className="tree-content">
                    <h4>BRIQCAR CA</h4>
                    <h5>Desarrollador Web</h5>
                    <p className="tree-desc">Implantación de sistema web de firmas autorizadas.</p>
                  </div>
                  <div className="tree-period-box">
                    <span className="period-year">2021</span>
                  </div>
                </div>

                <div className="tree-item">
                  <div className="tree-dot white-dot"></div>
                  <div className="tree-content">
                    <h4>BRIQCAR CA</h4>
                    <h5>Desarrollador Web</h5>
                    <p className="tree-desc">Creación de módulos comerciales de almacén.</p>
                  </div>
                  <div className="tree-period-box">
                    <span className="period-year">2021 - 22</span>
                  </div>
                </div>

                <div className="tree-item">
                  <div className="tree-dot white-dot"></div>
                  <div className="tree-content">
                    <h4>CVG</h4>
                    <h5>Desarrollador de Sistemas</h5>
                    <p className="tree-desc">Sistema de seguimiento de proyectos especiales.</p>
                  </div>
                  <div className="tree-period-box">
                    <span className="period-year">2022</span>
                  </div>
                </div>

                <div className="tree-item">
                  <div className="tree-dot green-dot"></div>
                  <div className="tree-content">
                    <h4>Nailed Nails</h4>
                    <h5>Desarrollador Full Stack</h5>
                    <p className="tree-desc">Control de inventario y adquisiciones.</p>
                  </div>
                  <div className="tree-period-box">
                    <span className="period-year">2024</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
