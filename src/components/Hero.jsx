import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import PdfModal from './PdfModal';

const resumePaths = {
  en: '/Anouer_Chouikh_CV_EN.pdf',
  fr: '/Anouer_Chouikh_CV_FR.pdf',
  ar: '/Anouer_Chouikh_CV_EN.pdf',
};

export default function Hero() {
  const { language, t } = useI18n();
  const resumePath = resumePaths[language] || resumePaths.en;
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    const openResume = () => setIsResumeOpen(true);
    window.addEventListener('open-resume', openResume);
    return () => window.removeEventListener('open-resume', openResume);
  }, []);

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
            alt={t('common.portraitAlt')}
          />
          <h1 id="hero-heading" className="hero__name">{t('common.name')}</h1>
          <p className="hero__title">{t('hero.title')}</p>
          <p className="hero__tagline">{t('hero.tagline')}</p>
          <div className="hero__buttons">
            <a className="btn btn--primary" href="#projects">{t('hero.projects')}</a>
            <a className="btn btn--secondary" href="#contact">{t('hero.contact')}</a>
            <a
              ref={triggerRef}
              className="btn btn--secondary"
              href={resumePath}
              onClick={openResume}
            >
              {t('hero.resume')}
            </a>
          </div>
        </div>
      </section>

      {isResumeOpen && (
        <PdfModal
          src={resumePath}
          title={t('hero.resumePreview')}
          showDownload={true}
          onClose={() => setIsResumeOpen(false)}
          triggerRef={triggerRef}
        />
      )}
    </>
  );
}
