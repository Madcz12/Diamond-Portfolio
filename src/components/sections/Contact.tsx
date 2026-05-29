import React, { useEffect, useState, useRef } from 'react';
import { DiamondBackground } from '../ui/DiamondBackground';
import './Contact.css';

interface ContactProps {
  isActive: boolean;
}

export const Contact: React.FC<ContactProps> = ({ isActive }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [emailCopied, setEmailCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('diamondmiguel12@gmail.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsRevealed(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsRevealed(false);
    }
  }, [isActive]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch("https://api.staticforms.dev/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accessKey: "sf_ba90c299a986f92ed22b7985",
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        console.error("StaticForms error response:", data);
        setStatus('error');
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setStatus('error');
    }

    // Reset status after a few seconds
    setTimeout(() => {
      setStatus('idle');
    }, 5000);
  };

  const revealClass = `reveal-up ${isRevealed ? 'revealed' : ''}`;

  return (
    <div className="panel">
      <DiamondBackground variant={5} />
      <div className="panel-inner contact-inner">

        <div className="contact-grid">
          {/* ── Left: Info + Social Links ── */}
          <div className={`contact-left ${revealClass}`}>
            <h3 className="section-label">05 · Contacto</h3>
            <h2 className="section-title">Construyamos algo brillante juntos.</h2>

            <p className="contact-subtitle">
              ¿Tienes un proyecto en mente o simplemente quieres conectar? Escríbeme y hagamos que suceda.
            </p>

            <div className="availability">
              <div className="status-dot"></div>
              <span>Disponible para proyectos</span>
            </div>

            <div className="contact-socials">
              <button 
                type="button" 
                onClick={handleCopyEmail} 
                className="contact-social-link"
              >
                {emailCopied ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span style={{ color: '#22c55e' }}>Email copiado en portapapeles</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>diamondmiguel12@gmail.com</span>
                  </>
                )}
              </button>

              <a href="https://www.linkedin.com/in/miguel-diamond-2b4273a0" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span>LinkedIn</span>
              </a>

              <a href="https://github.com/Madcz12" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* ── Right: Contact Form ── */}
          <div className={`contact-right ${revealClass}`}>
            <form
              ref={formRef}
              className="contact-form"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div className="form-group">
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="contact-name" className="form-label">Nombre</label>
                <div className="form-highlight"></div>
              </div>

              <div className="form-group">
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="contact-email" className="form-label">Email</label>
                <div className="form-highlight"></div>
              </div>

              <div className="form-group">
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  className="form-input"
                  placeholder="Asunto"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="contact-subject" className="form-label">Asunto</label>
                <div className="form-highlight"></div>
              </div>

              <div className="form-group">
                <textarea
                  id="contact-message"
                  name="message"
                  className="form-textarea"
                  placeholder="Mensaje"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <label htmlFor="contact-message" className="form-label">Mensaje</label>
                <div className="form-highlight"></div>
              </div>

              <div className="form-submit-wrapper">
                <button
                  type="submit"
                  className="form-submit"
                  disabled={status === 'sending'}
                >
                  <span>{status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>

                <span
                  className={`form-status ${status === 'success' || status === 'error' ? 'visible' : ''} ${status}`}
                >
                  {status === 'success' && '◆ ¡Mensaje enviado con éxito!'}
                  {status === 'error' && '◆ Algo salió mal, intenta de nuevo'}
                </span>
              </div>
            </form>
          </div>
        </div>

        <div className={`contact-footer ${revealClass}`}>
          <span>Miguel Diamond · Ingeniero en Informática</span>
          <span>Software brillante como el diamante ◆</span>
        </div>

      </div>
    </div>
  );
};
