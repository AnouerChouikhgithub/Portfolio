import { useEffect, useState } from 'react';

/**
 * Auto-cycling photo index for card media.
 *
 * Advances `index` every `intervalMs` while the host element is on screen AND
 * the tab is visible; stays at 0 for lists shorter than two photos or under
 * prefers-reduced-motion. Deliberately simpler than useAutoCarousel: cards
 * don't need decode gating, progress rings, or slot/grace semantics — just a
 * paused-when-invisible interval so five cards never cost five rAF loops.
 */
export default function usePhotoCycle(count, hostRef, intervalMs = 3000) {
  const [index, setIndex] = useState(0);

  // Reset when the photo list changes (count 0 → n, or a different club).
  useEffect(() => {
    setIndex(0);
  }, [count]);

  useEffect(() => {
    if (count < 2) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const host = hostRef?.current ?? null;
    let inView = !host || typeof IntersectionObserver === 'undefined';
    let timerId = 0;

    const start = () => {
      if (timerId || !inView || document.hidden) return;
      timerId = window.setInterval(() => {
        setIndex((current) => (current + 1) % count);
      }, intervalMs);
    };
    const stop = () => {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = 0;
      }
    };
    const sync = () => {
      if (inView && !document.hidden) start();
      else stop();
    };

    const observer = host && typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        sync();
      }, { threshold: 0.15 })
      : null;
    observer?.observe(host);
    document.addEventListener('visibilitychange', sync);
    start();

    return () => {
      stop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [count, hostRef, intervalMs]);

  return index;
}
