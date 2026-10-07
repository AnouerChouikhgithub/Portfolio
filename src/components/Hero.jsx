import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useI18n } from '../i18n/I18nProvider';
import HeroBackground from './HeroBackground';
import HeroBackgroundBlueprint from './HeroBackgroundBlueprint';
import ModalErrorBoundary from './ModalErrorBoundary';
import SplitText from './reactbits/SplitText';
import Magnet from './reactbits/Magnet';

// Lazy-loaded: pdfjs-dist (~450 KB) is only fetched when the user opens the resume.
const PdfModal = lazy(() => import('./PdfModal'));

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
  const contentRef = useRef(null);

  // Staged hero entrance (mount only): portrait "pops", the gradient name
  // rises out of a blur, then the buttons stagger in. SplitText owns the
  // title/tagline words — one owner per element. useLayoutEffect applies
  // the from-state before the first paint (no flash); clearProps hands
  // transform/opacity back to CSS so .btn:hover keeps working.
  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        '.hero__portrait-wrap',
        { autoAlpha: 0, scale: 0.86 },
        { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'back.out(1.4)', clearProps: 'transform,opacity,visibility' },
        0,
      )
        .fromTo(
          '.hero__name',
          { autoAlpha: 0, y: 40, filter: 'blur(12px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1, clearProps: 'transform,opacity,visibility,filter' },
          0.15,
        )
        .fromTo(
          '.hero__buttons .btn',
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.09,
            clearProps: 'transform,opacity,visibility',
          },
          0.85,
        );
    }, contentRef);

    return () => ctx.revert();
  }, []);

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
      <section className="hero" aria-labelledby="hero-heading" data-hero-active="false">
        {/* Both layers stay mounted; CSS crossfades them on theme change so
            toggling never hard-cuts. Each layer pauses itself when hidden. */}
        <HeroBackground />
        <HeroBackgroundBlueprint />
        <div className="hero__container container">
          <div className="hero__content" ref={contentRef}>
            <div className="hero__portrait-wrap">
              <img
                className="hero__portrait"
                src="/me2.jpg"
                alt={t('common.portraitAlt')}
              />
            </div>
            <h1 id="hero-heading" className="hero__name">{t('common.name')}</h1>
            <SplitText
              tag="p"
              className="hero__title"
              text={t('hero.title')}
              splitType="words"
              delay={0.45}
              stagger={0.04}
              duration={0.7}
            />
            <SplitText
              tag="p"
              className="hero__tagline"
              text={t('hero.tagline')}
              splitType="chars"
              delay={0.75}
              stagger={0.03}
              duration={0.6}
            />
            <div className="hero__buttons">
              <Magnet>
                <a className="btn btn--primary" href="#projects">{t('hero.projects')}</a>
              </Magnet>
              <Magnet>
                <a className="btn btn--secondary" href="#contact">{t('hero.contact')}</a>
              </Magnet>
              <Magnet>
                <a
                  ref={triggerRef}
                  className="btn btn--secondary"
                  href={resumePath}
                  onClick={openResume}
                >
                  {t('hero.resume')}
                </a>
              </Magnet>
            </div>
          </div>
        </div>
      </section>

      {isResumeOpen && (
        <Suspense fallback={null}>
          <ModalErrorBoundary
            onClose={() => setIsResumeOpen(false)}
            message={t('common.viewLoadError')}
            closeLabel={t('common.close')}
          >
            <PdfModal
              src={resumePath}
              title={t('hero.resumePreview')}
              showDownload={true}
              onClose={() => setIsResumeOpen(false)}
              triggerRef={triggerRef}
            />
          </ModalErrorBoundary>
        </Suspense>
      )}
    </>
  );
}
