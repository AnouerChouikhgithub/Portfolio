/**
 * MorphedSubScreenPanel — animates the sub-screen panel between the clicked
 * card's rect and the final centered panel rect using GSAP Flip, and manages
 * the origin card's visibility during the open state.
 *
 * Open:  panel materialises at the card's rect (position/radius included),
 *        then FLIPs to the final layout in ~520 ms expo-out while the backdrop
 *        fades in. After the morph, content reveals run via CSS (existing
 *        .modal-reveal logic inside the modal handles itself).
 * Close: re-measure the card's current rect (it may have scrolled), FLIP back,
 *        restore the card's visibility, focus returns to the card.
 *
 * Fallbacks (fade/scale entrance, no FLIP): prefers-reduced-motion, no
 * originEl (e.g. hash deep link), tab hidden, or an interrupted close.
 * The close button stays interactive during the morph — any interrupt kills
 * the running timeline first.
 */

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const MORPH_MS = 0.52;
const EXIT_MS = 0.34;

export default function MorphedSubScreenPanel({ originEl, active, onClose, children, restoreFocusTo }) {
  const hostRef = useRef(null);
  const timelineRef = useRef(null);
  const exitTimelineRef = useRef(null);

  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host || !active) return undefined;

    const canMorph = Boolean(originEl?.getBoundingClientRect) && !reducedMotion
      && document.visibilityState !== 'hidden';

    // The origin card hides itself while the sub-screen owns its slot.
    originEl?.classList?.add('is-open-behind');

    if (!canMorph) {
      gsap.fromTo(
        host.querySelector('.subscreen__panel') ?? host,
        { opacity: 0, y: 16, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.36, ease: 'power2.out' },
      );
      return () => { timelineRef.current?.kill(); };
    }

    const cardRect = originEl.getBoundingClientRect();
    const panel = host.querySelector('.subscreen__panel');
    if (!panel) return undefined;

    // Freeze the panel at the card's rect, then FLIP to layout.
    gsap.set(panel, {
      position: 'fixed',
      top: cardRect.top,
      left: cardRect.left,
      width: cardRect.width,
      height: cardRect.height,
      borderRadius: getComputedStyle(originEl).borderRadius || '14px',
      opacity: 0.96,
    });

    const state = Flip.getState(panel);
    panel.style.position = '';
    panel.style.top = '';
    panel.style.left = '';
    panel.style.width = '';
    panel.style.height = '';

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(panel, { clearProps: 'all' });
      },
    });
    timelineRef.current = timeline;

    timeline
      .fromTo(panel, { opacity: 0.96 }, { opacity: 1, duration: MORPH_MS, ease: 'none' }, 0)
      .add(Flip.from(state, {
        targets: panel,
        duration: MORPH_MS,
        ease: 'expo.out',
        scale: false,
        absolute: false,
        onComplete: () => gsap.set(panel, { clearProps: 'transform,width,height,borderRadius,position,top,left' }),
      }), 0);

    return () => {
      timeline.kill();
      gsap.set(panel, { clearProps: 'all' });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Exit animation runs on a dedicated watcher so close-from-any-point works:
  // kill the entrance/morph timeline, reverse the panel toward the card.
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    if (active) {
      exitTimelineRef.current?.kill();
      return undefined;
    }

    const panel = host.querySelector('.subscreen__panel');
    if (!panel) return undefined;

    const canMorphBack = Boolean(originEl?.getBoundingClientRect)
      && !reducedMotion
      && originEl.classList.contains('is-open-behind');

    if (!canMorphBack) {
      const fallback = gsap.to(panel, {
        opacity: 0,
        y: 16,
        scale: 0.98,
        duration: EXIT_MS,
        ease: 'power2.in',
        onComplete: () => gsap.set(panel, { clearProps: 'all' }),
      });
      exitTimelineRef.current = fallback;
      return () => { fallback.kill(); };
    }

    const cardRect = originEl.getBoundingClientRect();
    const state = Flip.getState(panel);
    gsap.set(panel, {
      position: 'fixed',
      top: cardRect.top,
      left: cardRect.left,
      width: cardRect.width,
      height: cardRect.height,
      borderRadius: getComputedStyle(originEl).borderRadius || '14px',
      opacity: 0.94,
    });

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(panel, { clearProps: 'all' });
        originEl?.classList?.remove('is-open-behind');
      },
    });
    exitTimelineRef.current = timeline;
    timeline
      .to(panel, { opacity: 0.94, duration: EXIT_MS, ease: 'none' }, 0)
      .to(Flip.from(state, { targets: panel, duration: EXIT_MS, ease: 'power3.inOut', scale: false }), 0)
      .call(() => {
        restoreFocusTo?.focus?.();
      });

    return () => {
      timeline.kill();
      gsap.set(panel, { clearProps: 'all' });
      originEl?.classList?.remove('is-open-behind');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div ref={hostRef} className="morphed-panel-host">
      {children}
    </div>
  );
}
