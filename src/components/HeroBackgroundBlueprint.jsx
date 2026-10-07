import { useEffect, useRef } from 'react';
import './hero-background-blueprint.css';

export default function HeroBackgroundBlueprint() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const background = backgroundRef.current;
    const hero = background?.parentElement;
    if (!background || !hero) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const target = { x: 0.5, y: 0.42 };
    const current = { x: 0.5, y: 0.42 };
    let inView = hero.getBoundingClientRect().bottom > 0;
    let documentVisible = document.visibilityState !== 'hidden';
    let frameId = 0;

    const updateActivity = () => {
      background.dataset.active = String(inView && documentVisible);
      background.dataset.reducedMotion = String(reducedMotion.matches);
      if ((!inView || !documentVisible || reducedMotion.matches) && frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    const followPointer = () => {
      current.x += (target.x - current.x) * 0.09;
      current.y += (target.y - current.y) * 0.09;
      background.style.setProperty('--blueprint-spot-x', `${current.x * hero.clientWidth}px`);
      background.style.setProperty('--blueprint-spot-y', `${current.y * hero.clientHeight}px`);

      if (Math.abs(target.x - current.x) > 0.001 || Math.abs(target.y - current.y) > 0.001) {
        frameId = requestAnimationFrame(followPointer);
      } else {
        frameId = 0;
      }
    };

    const handlePointerMove = (event) => {
      if (reducedMotion.matches || !pointerQuery.matches || !inView || !documentVisible) return;
      const bounds = hero.getBoundingClientRect();
      target.x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      target.y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
      if (!frameId) frameId = requestAnimationFrame(followPointer);
    };

    const handleVisibilityChange = () => {
      documentVisible = document.visibilityState !== 'hidden';
      updateActivity();
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateActivity();
    }, { threshold: 0.01 });

    observer.observe(hero);
    hero.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotion.addEventListener('change', updateActivity);
    pointerQuery.addEventListener('change', updateActivity);
    updateActivity();

    return () => {
      observer.disconnect();
      hero.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotion.removeEventListener('change', updateActivity);
      pointerQuery.removeEventListener('change', updateActivity);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={backgroundRef} className="hero-background-blueprint" data-active="false" aria-hidden="true">
      <div className="hero-background-blueprint__grid" />
      <svg className="hero-background-blueprint__drawing" viewBox="0 0 1600 900" preserveAspectRatio="none">
        <g className="blueprint-draw blueprint-draw--one">
          <path d="M90 210 H360 L420 270 H610 M1510 190 H1270 L1200 260 H1010" />
          <path d="M180 700 H430 L500 630 H680 M1420 680 H1190 L1120 610 H930" />
          <path d="M800 90 V210 M800 810 V690" />
          <path d="M360 196 V224 M610 256 V284 M1270 176 V204 M1010 246 V274" />
        </g>
        <g className="blueprint-draw blueprint-draw--two">
          <g transform="translate(0 75) scale(1 0.75)">
            <path className="blueprint-gear" d="M390 420 L406 420 L412 399 L430 393 L445 406 L457 394 L451 378 L461 361 L480 362 L487 345 L474 331 L480 313 L498 307 L498 291 L480 285 L474 267 L487 253 L480 237 L461 238 L451 221 L457 205 L445 193 L430 205 L412 199 L406 178 L390 178 L384 199 L366 205 L351 193 L339 205 L345 221 L335 238 L316 237 L309 253 L322 267 L316 285 L298 291 L298 307 L316 313 L322 331 L309 345 L316 362 L335 361 L345 378 L339 394 L351 406 L366 393 L384 399 Z" />
            <circle cx="398" cy="299" r="42" />
          </g>
          <path d="M1010 410 H1080 V365 H1140 V410 H1210 V465 H1140 V520 H1080 V465 H1010 Z" />
          <path d="M1010 438 H955 L920 473 H870 M1210 438 H1265 L1300 473 H1350 M1120 365 V320 H1180 V280" />
          <circle cx="920" cy="473" r="5" />
          <circle cx="1300" cy="473" r="5" />
          <circle cx="1180" cy="280" r="5" />
        </g>
        <g className="hero-background-blueprint__labels">
          <text x="500" y="282">Ø 40</text>
          <text x="1080" y="555">245 °C</text>
          <text x="1220" y="310">1:2</text>
          <text x="330" y="470">REV C</text>
        </g>
      </svg>
      <div className="hero-background-blueprint__spotlight" />
      <div className="hero-background-blueprint__bottom" />
    </div>
  );
}
