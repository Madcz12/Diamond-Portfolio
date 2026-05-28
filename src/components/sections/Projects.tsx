import React, { useEffect, useState } from 'react';
import { DiamondBackground } from '../ui/DiamondBackground';
import './Projects.css';

interface ProjectsProps {
  isActive: boolean;
}

export const Projects: React.FC<ProjectsProps> = ({ isActive }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsRevealed(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsRevealed(false);
    }
  }, [isActive]);

  const revealClass = `reveal-up ${isRevealed ? 'revealed' : ''}`;

  const projects = [
    {
      title: 'Plataforma de Analytics en Tiempo Real',
      tag: 'SaaS · Full Stack',
      stack: ['Next.js', 'Python', 'PostgreSQL', 'Redis'],
      description: 'Dashboard de métricas en tiempo real con visualización de datos interactiva y procesamiento de eventos.',
    },
    {
      title: 'App de Gestión Financiera Personal',
      tag: 'Mobile · API',
      stack: ['React Native', 'Node.js', 'OpenAI'],
      description: 'Aplicación móvil para gestión de finanzas personales con IA integrada para recomendaciones.',
    },
    {
      title: 'Sistema de Inventario Distribuido',
      tag: 'E-commerce · Microservices',
      stack: ['Docker', 'Kafka', 'MongoDB', 'AWS'],
      description: 'Sistema distribuido de gestión de inventario para e-commerce con arquitectura de microservicios.',
    },
    {
      title: 'CLI de Automatización de Deployments',
      tag: 'DevTool · CLI',
      stack: ['Python', 'Terraform', 'GitHub Actions'],
      description: 'Herramienta de línea de comandos para automatizar despliegues en múltiples entornos cloud.',
    },
  ];

  return (
    <div className="panel">
      <DiamondBackground variant={3} />
      <div className="panel-inner">
        <h3 className={`section-label ${revealClass}`}>03 · Proyectos</h3>
        <h2 className={`section-title ${revealClass}`}>Obras talladas con código</h2>

        <div className={`projects-grid ${revealClass}`}>
          {projects.map((project, index) => (
            <div className="project-card" key={index}>
              <div className="project-header">
                <span className="project-tag">{project.tag}</span>
                <h4 className="project-title">{project.title}</h4>
              </div>
              <p className="project-desc">{project.description}</p>
              <div className="project-stack">
                {project.stack.map((tech, techIndex) => (
                  <span className="stack-pill" key={techIndex}>{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
