/**
 * Lazy accessor for anime.js v4.
 *
 * The bundle budget requires anime.js to stay out of the initial chunk
 * (it is only used for post-load micro-motion: icon morphs, count-ups,
 * chip staggers, SVG draw-ons). Importing it lazily keeps ~35 kB raw out
 * of the entry bundle while giving callers a single cached promise.
 *
 * Library ownership (see src/motion/README.md): anime.js owns SVG and
 * micro-motion only — never scroll-linked work (GSAP) or layout/presence
 * (React + CSS).
 */
let animePromise;

export function loadAnime() {
  if (!animePromise) {
    animePromise = import('animejs');
  }
  return animePromise;
}

/** True when the visitor prefers reduced motion. */
export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Run a micro-animation with anime.js unless motion is reduced.
 * Resolves with the animation (or `null` when skipped) so callers can chain.
 */
export async function microAnimate(targets, params) {
  if (prefersReducedMotion()) return null;
  const { animate } = await loadAnime();
  return animate(targets, params);
}
