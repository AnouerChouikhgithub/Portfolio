// Delegated pointer spotlight for cards (Phase 3c).
//
// The card CSS declares `--mx/--my` (radial glow position) and `.project-card`
// additionally consumes `--rx/--ry` (subtle 3D tilt). One document-level
// listener writes them on the closest card under the pointer, rAF-throttled.
// Fine pointers only, fully disabled under prefers-reduced-motion; the resting
// CSS values (-999px / 0deg) mean touch devices simply never show the glow.

const CARD_SELECTOR = '.project-card, .events-card, .community-card, .skills-group-card';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function initCardSpotlight() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};
  if (!window.matchMedia('(pointer: fine)').matches) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  let activeCard = null;
  let pending = null;
  let frameId = 0;

  const clearActive = () => {
    if (!activeCard) return;
    activeCard.style.removeProperty('--mx');
    activeCard.style.removeProperty('--my');
    activeCard.style.removeProperty('--rx');
    activeCard.style.removeProperty('--ry');
    activeCard = null;
  };

  const flush = () => {
    frameId = 0;
    if (!activeCard || !pending) return;
    const { clientX, clientY } = pending;
    pending = null;
    // Read the rect inside the frame (cheap: one element) so the glow stays
    // aligned even after the card's own hover lift shifts its box.
    const rect = activeCard.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    activeCard.style.setProperty('--mx', `${x.toFixed(1)}px`);
    activeCard.style.setProperty('--my', `${y.toFixed(1)}px`);
    activeCard.style.setProperty('--rx', `${clamp((0.5 - y / rect.height) * 8, -6, 6).toFixed(2)}deg`);
    activeCard.style.setProperty('--ry', `${clamp((x / rect.width - 0.5) * 10, -8, 8).toFixed(2)}deg`);
  };

  const onPointerMove = (event) => {
    const target = event.target;
    const card = target instanceof Element ? target.closest(CARD_SELECTOR) : null;
    if (!card) {
      if (activeCard) {
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
        clearActive();
      }
      return;
    }
    if (card !== activeCard) clearActive();
    activeCard = card;
    pending = { clientX: event.clientX, clientY: event.clientY };
    if (!frameId) frameId = window.requestAnimationFrame(flush);
  };

  // Cached rects would go stale on scroll/resize; drop back to the resting state.
  const onInvalidate = () => {
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
    clearActive();
  };

  document.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('scroll', onInvalidate, { passive: true, capture: true });
  window.addEventListener('resize', onInvalidate);

  return () => {
    document.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('scroll', onInvalidate, true);
    window.removeEventListener('resize', onInvalidate);
    if (frameId) window.cancelAnimationFrame(frameId);
    clearActive();
  };
}
