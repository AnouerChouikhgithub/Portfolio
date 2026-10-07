import { useEffect, useRef } from 'react';

/**
 * Reactive dot grid (React Bits DotGrid idea, hand-ported to plain canvas).
 *
 * Discipline copied from the existing background layers:
 * - IntersectionObserver gates the rAF loop to the section's viewport,
 * - the loop also stops while the tab is hidden,
 * - pointer proximity only runs for (hover: hover) + (pointer: fine),
 * - reduced motion renders one static frame and never animates.
 *
 * One owner: this canvas draws the skills dots; no other library touches it.
 */
export default function DotGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement?.closest('section') || canvas?.parentElement;
    if (!canvas || !section) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    const GAP = 26;
    const HOVER_RADIUS = 96;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let inView = false;
    let documentVisible = document.visibilityState !== 'hidden';
    let frameId = 0;
    let pointer = null; // {x, y} in CSS pixels, null when idle

    const resize = () => {
      const rect = section.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const lineColor = getComputedStyle(section).getPropertyValue('--section-line').trim() || '#22d3ee';

      for (let x = GAP / 2; x < width; x += GAP) {
        for (let y = GAP / 2; y < height; y += GAP) {
          let radius = 1;
          let alpha = 0.16;
          if (pointer) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < HOVER_RADIUS) {
              const t = 1 - dist / HOVER_RADIUS;
              radius = 1 + t * 2.4;
              alpha = 0.16 + t * 0.5;
            }
          }
          ctx.globalAlpha = alpha;
          ctx.fillStyle = lineColor;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      draw();
      frameId = 0;
      if (inView && documentVisible && pointer) {
        frameId = requestAnimationFrame(tick);
      }
    };

    const requestDraw = () => {
      if (reducedQuery.matches) {
        draw();
        return;
      }
      if (!frameId && inView && documentVisible) {
        frameId = requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (event) => {
      if (reducedQuery.matches || !pointerQuery.matches) return;
      const rect = section.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      requestDraw();
    };

    const handlePointerLeave = () => {
      pointer = null;
      requestDraw();
    };

    const handleVisibility = () => {
      documentVisible = document.visibilityState !== 'hidden';
      if (!documentVisible && frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      } else {
        requestDraw();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        requestDraw();
      } else if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    }, { rootMargin: '120px 0px', threshold: 0.01 });

    const resizeObserver = new ResizeObserver(() => {
      resize();
      requestDraw();
    });

    resize();
    observer.observe(section);
    resizeObserver.observe(section);
    section.addEventListener('pointermove', handlePointerMove, { passive: true });
    section.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibility);
    reducedQuery.addEventListener('change', requestDraw);
    requestDraw();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      section.removeEventListener('pointermove', handlePointerMove);
      section.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      reducedQuery.removeEventListener('change', requestDraw);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="section-background__dots" aria-hidden="true" />;
}
