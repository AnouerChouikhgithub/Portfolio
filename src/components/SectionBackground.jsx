import { useEffect, useRef } from 'react';
import './section-background.css';

export default function SectionBackground({ variant = 'about' }) {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const background = backgroundRef.current;
    const section = background?.parentElement;
    if (!background || !section) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = section.getBoundingClientRect().bottom > 0
      && section.getBoundingClientRect().top < window.innerHeight;
    let documentVisible = document.visibilityState !== 'hidden';

    const updateActivity = () => {
      background.classList.toggle('is-active', inView && documentVisible && !reducedMotion.matches);
    };
    const updateVisibility = () => {
      documentVisible = document.visibilityState !== 'hidden';
      updateActivity();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateActivity();
    }, { rootMargin: '120px 0px', threshold: 0.01 });

    observer.observe(section);
    document.addEventListener('visibilitychange', updateVisibility);
    reducedMotion.addEventListener('change', updateActivity);
    updateActivity();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
      reducedMotion.removeEventListener('change', updateActivity);
    };
  }, []);

  return (
    <div ref={backgroundRef} className={`section-background section-background--${variant}`} aria-hidden="true">
      <div className="section-background__base" />
      <div className="section-background__grid" />
      <div className="section-background__motion" />
      <div className="section-background__fade section-background__fade--top" />
      <div className="section-background__fade section-background__fade--bottom" />
    </div>
  );
}
