import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../i18n/I18nProvider';
import SplitText from './reactbits/SplitText';
import Magnet from './reactbits/Magnet';

gsap.registerPlugin(ScrollTrigger);

// Lazy-loaded: pdfjs-dist (~450 KB) is only fetched when the user opens the resume.
const PdfModal = lazy(() => import('./PdfModal'));

const resumePaths = {
  en: '/Anouer_Chouikh_CV_EN.pdf',
  fr: '/Anouer_Chouikh_CV_FR.pdf',
  ar: '/Anouer_Chouikh_CV_EN.pdf',
};

export default function Hero() {
  const { language, t } = useI18n();
  const heroRef = useRef(null);
  const resumePath = resumePaths[language] || resumePaths.en;
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const triggerRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero__portrait',
        { opacity: 0, scale: 0.6, rotate: -8 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.6)' },
      );

      gsap.fromTo(
        '.hero__name',
        { opacity: 0, y: 30, filter: 'blur(14px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
      );

      gsap.fromTo(
        '.hero__buttons .magnet',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' },
      );

      gsap.to('.hero__content', {
        yPercent: -12,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero__content',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, { scope: heroRef });

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
      <section className="hero container" aria-labelledby="hero-heading" ref={heroRef}>
        <div className="hero__content">
          <img
            className="hero__portrait"
            src="/me2.jpg"
            alt={t('common.portraitAlt')}
          />
          <h1 id="hero-heading" className="hero__name">{t('common.name')}</h1>
          <SplitText text={t('hero.title')} className="hero__title" splitType="chars" duration={0.75} stagger={0.025} delay={0.15} from={{ opacity: 0, y: 18, filter: 'blur(8px)' }} />
          <SplitText text={t('hero.tagline')} className="hero__tagline" splitType="words" duration={0.75} stagger={0.08} delay={0.2} from={{ opacity: 0, y: 18, filter: 'blur(10px)' }} trigger="mount" />
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
      </section>

      {isResumeOpen && (
        <Suspense fallback={null}>
          <PdfModal
            src={resumePath}
            title={t('hero.resumePreview')}
            showDownload={true}
            onClose={() => setIsResumeOpen(false)}
            triggerRef={triggerRef}
          />
        </Suspense>
      )}
    </>
  );
}
