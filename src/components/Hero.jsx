import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

const resumePaths = {
  en: '/Anouer_Chouikh_CV_EN.pdf',
  fr: '/Anouer_Chouikh_CV_FR.pdf',
  ar: '/Anouer_Chouikh_CV_EN.pdf',
};

export default function Hero() {
  const { language, t } = useI18n();
  const resumePath = resumePaths[language] || resumePaths.en;
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
          <img
            className="hero__portrait"
            src="/me2.jpg"
            alt="Portrait of Anouer Chouikh"
          />
          <h1 id="hero-heading" className="hero__name">Anouer Chouikh</h1>
          <p className="hero__title">{t('hero.title')}</p>
          <p className="hero__tagline">{t('hero.tagline')}</p>
          <div className="hero__buttons">
            <a className="btn btn--primary" href="#projects">{t('hero.projects')}</a>
            <a className="btn btn--secondary" href="#contact">{t('hero.contact')}</a>
            <a className="btn btn--secondary" href={resumePath} onClick={openResume}>{t('hero.resume')}</a>
          </div>
        </div>
      </section>

      {isResumeOpen && (
        <div className="event-modal" onClick={() => setIsResumeOpen(false)}>
          <div
            className="event-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-label={t('hero.resumePreview')}
            onClick={(event) => event.stopPropagation()}
            ref={modalRef}
          >
            <button
              type="button"
              className="event-modal__close"
              aria-label={t('hero.closeResume')}
              onClick={() => setIsResumeOpen(false)}
            >
              ×
            </button>
            <a
              className="btn btn--secondary resume-modal__download"
              href={resumePath}
              download
              aria-label={t('hero.downloadResume')}
              title={t('hero.downloadResume')}
            >
              <Download size={17} aria-hidden="true" />
            </a>

            <div className="event-modal__content resume-modal__content">
              <div className="event-modal__gallery resume-modal__gallery">
                <iframe
                  className="resume-modal__frame"
                  src={`${resumePath}#toolbar=0&navpanes=0`}
                  title={t('hero.resumeTitle')}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
