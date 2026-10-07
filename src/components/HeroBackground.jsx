import { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { loadAnime, prefersReducedMotion } from '../motion/anime';
import './hero-background.css';

const traces = [
  'M80 230 H350 L430 310 H620',
  'M1520 180 H1280 L1190 270 H980',
  'M120 680 H390 L500 570 H690',
  'M1480 650 H1260 L1150 540 H920',
  'M800 70 V190 L720 270',
  'M800 830 V700 L900 600',
];

export default function HeroBackground() {
  const backgroundRef = useRef(null);
  const hasDrawnRef = useRef(false);
  const { theme } = useTheme();

  // anime.js owns the draw-on (lazy chunk). The CSS hide-rule stays active
  // until the drawable proxies have written their own dash attributes, so
  // there is never a frame showing the finished traces.
  const drawTraces = () => {
    const background = backgroundRef.current;
    if (!background || hasDrawnRef.current) return;
    hasDrawnRef.current = true;

    if (prefersReducedMotion()) {
      background.dataset.draw = 'ready';
      return;
    }

    loadAnime()
      .then(({ animate, svg, stagger }) => {
        const paths = background.querySelectorAll('.hero-background__trace');
        if (!paths.length) {
          background.dataset.draw = 'ready';
          return;
        }
        const drawables = svg.createDrawable(paths);
        background.dataset.draw = 'ready';
        animate(drawables, {
          draw: ['0 0', '0 1'],
          duration: 1500,
          delay: stagger(140),
          ease: 'inOutQuad',
        });
      })
      .catch(() => {
        // Network/parse failure: reveal the traces rather than hide art.
        background.dataset.draw = 'ready';
      });
  };

  useEffect(() => {
    const background = backgroundRef.current;
    const hero = background?.parentElement;
    if (!background || !hero) return undefined;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const target = { x: 0.5, y: 0.38 };
    const current = { x: 0.5, y: 0.38 };
    const parallaxLayers = background.querySelectorAll('[data-parallax]');
    const heroBounds = hero.getBoundingClientRect();
    let isInView = heroBounds.bottom > 0 && heroBounds.top < window.innerHeight;
    let isDocumentVisible = document.visibilityState !== 'hidden';
    let frameId = 0;

    const isThemeVisible = () => theme === 'dark';

    const updateActiveState = () => {
      // The hero itself is "active" whenever it is on screen (the portrait
      // ring keys off this), but this layer only animates when it is the
      // layer the current theme actually shows.
      const heroActive = isInView && isDocumentVisible;
      const layerActive = heroActive && isThemeVisible();
      background.dataset.active = String(layerActive);
      background.dataset.reducedMotion = String(reducedMotionQuery.matches);
      hero.dataset.heroActive = String(heroActive);
      if (layerActive) drawTraces();
      if (!layerActive && frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    const updatePointer = (event) => {
      if (reducedMotionQuery.matches || !pointerQuery.matches || !isInView
        || !isDocumentVisible || !isThemeVisible()) return;
      const bounds = hero.getBoundingClientRect();
      target.x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      target.y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));

      if (!frameId) {
        const followPointer = () => {
          current.x += (target.x - current.x) * 0.085;
          current.y += (target.y - current.y) * 0.085;
          background.style.setProperty('--spotlight-x', `${current.x * hero.clientWidth}px`);
          background.style.setProperty('--spotlight-y', `${current.y * hero.clientHeight}px`);

          const offsetX = (current.x - 0.5) * 30;
          const offsetY = (current.y - 0.5) * 30;
          parallaxLayers.forEach((layer) => {
            const depth = Number(layer.dataset.parallax);
            layer.style.transform = `translate3d(${-offsetX * depth}px, ${-offsetY * depth}px, 0)`;
          });

          if (Math.abs(target.x - current.x) > 0.001 || Math.abs(target.y - current.y) > 0.001) {
            frameId = window.requestAnimationFrame(followPointer);
          } else {
            frameId = 0;
          }
        };
        frameId = window.requestAnimationFrame(followPointer);
      }
    };

    const resetPointer = () => {
      target.x = 0.5;
      target.y = 0.38;
      updatePointer({ clientX: hero.getBoundingClientRect().left + hero.clientWidth / 2,
        clientY: hero.getBoundingClientRect().top + hero.clientHeight * 0.38 });
    };
    const updateDocumentVisibility = () => {
      isDocumentVisible = document.visibilityState !== 'hidden';
      updateActiveState();
    };
    const updateMotionPreference = () => {
      updateActiveState();
      hero.removeEventListener('pointermove', updatePointer);
      if (!reducedMotionQuery.matches && pointerQuery.matches) {
        hero.addEventListener('pointermove', updatePointer, { passive: true });
      }
    };
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
        isInView = entry.isIntersecting;
        updateActiveState();
      }, { threshold: 0.01 })
      : null;

    if (observer) {
      observer.observe(hero);
    } else {
      isInView = true;
    }
    updateActiveState();
    document.addEventListener('visibilitychange', updateDocumentVisibility);
    reducedMotionQuery.addEventListener('change', updateMotionPreference);
    pointerQuery.addEventListener('change', updateMotionPreference);
    hero.addEventListener('pointerleave', resetPointer);
    updateMotionPreference();

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', updateDocumentVisibility);
      reducedMotionQuery.removeEventListener('change', updateMotionPreference);
      pointerQuery.removeEventListener('change', updateMotionPreference);
      hero.removeEventListener('pointermove', updatePointer);
      hero.removeEventListener('pointerleave', resetPointer);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [theme]);

  return (
    <div ref={backgroundRef} className="hero-background" data-active="false" data-draw="pending" aria-hidden="true">
      <div className="hero-background__parallax" data-parallax="0.75">
        <div className="hero-background__glow hero-background__glow--cyan" />
      </div>
      <div className="hero-background__parallax" data-parallax="0.45">
        <div className="hero-background__glow hero-background__glow--teal" />
      </div>
      <div className="hero-background__parallax" data-parallax="0.25">
        <div className="hero-background__glow hero-background__glow--blue" />
      </div>
      <div className="hero-background__grid" />
      <svg className="hero-background__circuit" viewBox="0 0 1600 900" preserveAspectRatio="none">
        {traces.map((trace) => (
          <path key={trace} className="hero-background__trace" d={trace} />
        ))}
        <circle className="hero-background__node hero-background__node--one" cx="430" cy="310" r="3" />
        <circle className="hero-background__node hero-background__node--two" cx="1190" cy="270" r="3" />
        <circle className="hero-background__node hero-background__node--three" cx="500" cy="570" r="3" />
        <circle className="hero-background__node hero-background__node--four" cx="1150" cy="540" r="3" />
      </svg>
      <span className="hero-background__pulse hero-background__pulse--one" />
      <span className="hero-background__pulse hero-background__pulse--two" />
      <span className="hero-background__pulse hero-background__pulse--three" />
      <div className="hero-background__spotlight" />
      <div className="hero-background__noise" />
      <div className="hero-background__bottom" />
    </div>
  );
}
