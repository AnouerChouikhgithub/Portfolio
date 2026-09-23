import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';

const resumePath = '/Anouer_Chouikh_CV.pdf';

export default function Hero() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const openResume = () => setIsResumeOpen(true);
    window.addEventListener('open-resume', openResume);

    return () => window.removeEventListener('open-resume', openResume);
  }, []);

  useEffect(() => {
    if (!isResumeOpen) {
      return undefined;
    }

    const previousActiveElement = document.activeElement;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsResumeOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [isResumeOpen]);

  const openResume = (event) => {
    event.preventDefault();
    setIsResumeOpen(true);
  };

  return (
    <>
      <section className="hero container" aria-labelledby="hero-heading">
        <div className="hero__content">
          <h1 id="hero-heading" className="hero__name">Anouer Chouikh</h1>
          <p className="hero__title">3rd year student in  Computer Engneering & Internet of Things (ISITCom)</p>
          <p className="hero__tagline">Robotics • IoT</p>
          <div className="hero__buttons">
            <a className="btn btn--primary" href="#projects">View Projects</a>
            <a className="btn btn--secondary" href="#contact">Contact</a>
            <a className="btn btn--secondary" href={resumePath} onClick={openResume}>View Résumé</a>
          </div>
        </div>
      </section>

      {isResumeOpen && (
        <div className="event-modal" onClick={() => setIsResumeOpen(false)}>
          <div
            className="event-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Résumé preview"
            onClick={(event) => event.stopPropagation()}
            ref={modalRef}
          >
            <button
              type="button"
              className="event-modal__close"
              aria-label="Close résumé"
              onClick={() => setIsResumeOpen(false)}
            >
              ×
            </button>
            <a
              className="btn btn--secondary resume-modal__download"
              href={resumePath}
              download
              aria-label="Download résumé"
              title="Download résumé"
            >
              <Download size={17} aria-hidden="true" />
            </a>

            <div className="event-modal__content resume-modal__content">
              <div className="event-modal__gallery resume-modal__gallery">
                <iframe
                  className="resume-modal__frame"
                  src={`${resumePath}#toolbar=0&navpanes=0`}
                  title="Anouer Chouikh résumé"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
