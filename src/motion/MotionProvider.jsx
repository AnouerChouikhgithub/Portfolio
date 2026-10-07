import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { setLenis, getLenis } from './lenisStore';
import { initScrollReveal } from './scrollReveal';

gsap.registerPlugin(ScrollTrigger);

export default function MotionProvider({ children }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return undefined;
    }

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
    });

    setLenis(lenis);

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onLenisScroll);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const handleDocumentClick = (event) => {
      const clickTarget = event.target instanceof Element ? event.target : null;
      const anchor = clickTarget?.closest('a[href^="#"]');
      if (!anchor || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href || anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return;
      }

      const id = href.replace(/^#/, '');
      const scrollTarget = document.getElementById(id);
      if (!scrollTarget) {
        return;
      }

      event.preventDefault();
      window.history.pushState(null, '', href);
      window.dispatchEvent(new HashChangeEvent('hashchange'));

      const offset = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll-offset')) || 84;
      lenis.scrollTo(scrollTarget, { offset: -offset, force: true });
    };

    document.addEventListener('click', handleDocumentClick);

    const handleBodyStyleMutation = () => {
      if (document.body.style.overflow === 'hidden') {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          handleBodyStyleMutation();
        }
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    handleBodyStyleMutation();

    const cleanupReveal = initScrollReveal();

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      observer.disconnect();
      lenis.off('scroll', onLenisScroll);
      gsap.ticker.remove(tick);
      cleanupReveal();
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
