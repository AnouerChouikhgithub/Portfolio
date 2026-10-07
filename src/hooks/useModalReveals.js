import { useEffect } from 'react';

export default function useModalReveals(rootRef, resetKey) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const elements = root.querySelectorAll('.modal-reveal');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-revealed'));
      return undefined;
    }

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root,
      threshold: 0.08,
      rootMargin: '0px 0px -24px 0px',
    });

    elements.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 80, 640)}ms`);
      observer.observe(element);
    });
    const handleMotionPreference = () => {
      if (motionPreference.matches) {
        elements.forEach((element) => element.classList.add('is-revealed'));
        observer.disconnect();
      }
    };
    motionPreference.addEventListener('change', handleMotionPreference);
    return () => {
      observer.disconnect();
      motionPreference.removeEventListener('change', handleMotionPreference);
    };
  }, [rootRef, resetKey]);
}
