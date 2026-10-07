/**
 * SubScreen — the shared layered sub-screen shell for every modal-class
 * surface (project, event, community, chapter, skills group).
 *
 * Responsibilities (Steps 1–2 of the sub-screen upgrade):
 *  - Portal to document.body so the stacking-context trap in the isolated
 *    page sections can never paint over us.
 *  - Module layer registry: opening over an existing sub-screen marks the
 *    lower layer `.is-covered` (scale .985, dimmed, pointer-events none);
 *    Escape and focus trapping apply to the TOP layer only.
 *  - #root gets `inert` + `aria-hidden="true"` while a sub-screen is open
 *    (portals render outside #root, so the page stays visible but inert).
 *  - Frosted backdrop as its own two absolutely-positioned layers:
 *      A) blur:   backdrop-filter blur(18px) saturate(1.35) brightness(.82)
 *                 (dark) / blur(18px) saturate(1.15) brightness(1.02) (light);
 *                 radius is never animated — the layer fades 0→1 over 320 ms.
 *      B) tint:   30 % (dark) / 25 % (light) project-bg wash so the page stays
 *                 recognizable + one radial accent glow (≈12 %) + vignette.
 *    `@supports not (backdrop-filter…)` lifts the tint to 88 % for readability.
 *    Mobile (≤720 px) and prefers-reduced-transparency drop the blur to 10 px.
 *  - html.has-subscreen while anything is open: page decorative animation
 *    pauses (CSS) and rAF background loops skip frames (they check the class).
 *
 * Consumers render their panel as children; the shell owns wrapper, backdrop,
 * z-index (--z-subscreen + 10·depth) and lifecycle classes (is-open/is-closing/
 * has-origin → variants hook the morphs).
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useModalAccessibility from '../../hooks/useModalAccessibility';
import useScrollLock from '../../hooks/useScrollLock';

/* ── Module-level layer registry (acts across all sub-screen instances) ── */
let layerSeq = 0;
const openLayers = [];

export function notifySubscreenOpen(ref) {
  layerSeq += 1;
  const layer = { id: layerSeq, ref, isClosing: false };
  openLayers.forEach((other) => other.ref.current?.classList.add('is-covered'));
  openLayers.forEach((other) => other.onCovered?.());
  openLayers.push(layer);
  document.documentElement.classList.add('has-subscreen');
  if (typeof window !== 'undefined' && !window.__subscreenTopDepth) {
    window.__subscreenTopDepth = 0;
  }
  window.__subscreenTopDepth = openLayers.length - 1;
  return layer;
}

export function notifySubscreenClose(layer) {
  const idx = openLayers.indexOf(layer);
  if (idx !== -1) openLayers.splice(idx, 1);
  // Whoever is still open on top becomes uncovered again.
  openLayers.forEach((other) => other.ref.current?.classList.remove('is-covered'));
  if (!openLayers.length) {
    document.documentElement.classList.remove('has-subscreen');
  }
  window.__subscreenTopDepth = Math.max(0, openLayers.length - 1);
}

/** true when the given element is the top-most sub-screen layer. */
export function isTopSubscreen(element) {
  const top = openLayers[openLayers.length - 1];
  return Boolean(top && top.ref.current === element);
}

export default function SubScreen({
  open,
  onClose,
  children,
  accent,
  originEl = null,
  labelledBy,
  className = '',
  panelClassName = '',
  variant = '',
}) {
  const [mounted, setMounted] = useState(open);
  const [depth, setDepth] = useState(0);
  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const layerRef = useRef(null);
  const panelOpenProps = useRef(null);

  useEffect(() => {
    if (open) setMounted(true);
    else if (!open && mounted) {
      // Allow the exit animation window before unmounting.
      const timerId = window.setTimeout(() => setMounted(false), 220);
      return () => window.clearTimeout(timerId);
    }
    return undefined;
  }, [open, mounted]);

  useLayoutEffect(() => {
    if (!open || !panelRef.current) return;
    const layer = notifySubscreenOpen(layerRef);
    layerRef.current = layer;
    const panel = panelRef.current;
    layer.onCovered = () => {}; // consumers may use class only
    setDepth(layer.id);
    panelOpenProps.current = { layer };
    // Stamp the origin's rect for the morph variant.
    if (originEl?.getBoundingClientRect) {
      const rect = originEl.getBoundingClientRect();
      panel.style.setProperty('--origin-x', `${rect.left + rect.width / 2}px`);
      panel.style.setProperty('--origin-y', `${rect.top + rect.height / 2}px`);
      panel.style.setProperty('--origin-w', `${rect.width}px`);
      panel.style.setProperty('--origin-h', `${rect.height}px`);
      wrapperRef.current?.classList.add('has-origin');
    }
    return () => {
      notifySubscreenClose(layer);
    };
  }, [open, originEl]);

  // Page-level inertness: portal sits outside #root, so everything inside
  // #root is view-only while any sub-screen is open.
  useEffect(() => {
    if (!open) return undefined;
    const root = document.getElementById('root');
    if (!root) return undefined;
    root.setAttribute('inert', '');
    root.setAttribute('aria-hidden', 'true');
    return () => {
      root.removeAttribute('inert');
      root.removeAttribute('aria-hidden');
    };
  }, [open]);

  // Scroll lock: portal content container is a region that scrolls on mobile.
  useScrollLock(Boolean(open), wrapperRef);
  useModalAccessibility({
    panelRef,
    onClose,
    enabled: Boolean(open),
  });

  if (!mounted) return null;

  const accentStyle = accent ? { '--sub-accent': accent } : undefined;

  return createPortal(
    <div
      ref={wrapperRef}
      className={`subscreen ${variant ? `subscreen--${variant}` : ''} ${className} ${open ? 'is-open' : 'is-closing'}`}
      style={{ zIndex: `calc(var(--z-subscreen) + ${openLayers.length * 10})`, ...accentStyle }}
      role="presentation"
      onClick={(event) => {
        if (event.target === wrapperRef.current) onClose();
      }}
      // Focus trap above only binds while this layer is top; covered layers
      // accept no pointer interaction.
    >
      {/* Layer A — the blur. Own element so its fade never animates the radius. */}
      <div className="subscreen__blur" aria-hidden="true" />

      {/* Layer B — tint + accent glow + vignette */}
      <div className="subscreen__tint" aria-hidden="true" />

      {/* Backdrop click target (kept below panel’s stacking), closes on click */}
      <button
        type="button"
        className="subscreen__catcher"
        aria-label="Close overlay"
        tabIndex={-1}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className={`subscreen__panel ${panelClassName}`}
        aria-labelledby={labelledBy}
        data-depth={depth}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
