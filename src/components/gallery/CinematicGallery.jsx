/**
 * CinematicGallery — the one gallery engine behind all three modals.
 *
 * Owns: 16/10 stage, direction-aware GSAP slide transitions (480 ms inside the
 * 1.5 s slot), landscape=cover / portrait=contain-over-blurred-backdrop fit,
 * auto-centered thumbs (container.scrollTo — never scrollIntoView, so Lenis
 * never jumps), arrows (fade on desktop, always visible on touch), swipe,
 * keyboard (←/→/Space on the stage), and the Play/Pause button with the
 * WCAG 2.2.2 progress ring.
 *
 * The three modals keep their own visual identity through the `variant` prop:
 *   event     → director's cut: letterbox bars, Ken Burns drift, REC HUD
 *   community → network deck: polaroid stack + constellation (rendered here)
 *   project   → blueprint HUD: corner brackets, scanline sweep, spec readout
 * Variant-specific extras (HUD chrome, constellation canvas, PET packets)
 * render via this component so there is still exactly one stage markup.
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import WebpImage from '../WebpImage';
import useAutoCarousel from '../../hooks/useAutoCarousel';
import { GALLERY_INTERVAL_MS } from '../../hooks/useAutoCarousel';

gsap.registerPlugin(useGSAP);

const TRANSITION_MS = 480;

const getSource = (item) => (typeof item === 'string' ? item : item?.src);

export default function CinematicGallery({
  items,
  variant = 'event',
  altBuilder,
  labels,
  onIndexChange,
  isObscured = false,
  caption = null,
  renderSlideOverlay = null,
  className = '',
  thumbClass = '',
  emptyNode = null,
  labelId,
}) {
  const itemList = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const count = itemList.length;

  const gallery = useAutoCarousel(itemList, { isObscured });
  const { index, previousIndex, direction, slotKey, isPlaying, togglePlay, selectIndex, next, previous, progressRef } = gallery;

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const outRef = useRef(null);
  const inRef = useRef(null);
  const thumbsRef = useRef(null);
  const indicatorRef = useRef(null);
  const [fitModes, setFitModes] = useState({}); // src -> 'cover' | 'contain'
  const pointerState = useRef({ startX: 0, startY: 0, active: false });

  useEffect(() => { onIndexChange?.(index); }, [index, onIndexChange]);

  const srcAt = (i) => getSource(itemList[i]);
  const altAt = (i) => (altBuilder ? altBuilder(itemList[i], i) : `Photo ${i + 1}`);

  // Decide cover vs contain per photo from its intrinsic ratio (portrait faces
  // are never cropped: they sit on a blurred copy of themselves).
  useEffect(() => {
    let cancelled = false;
    const missing = itemList
      .map(getSource)
      .filter(Boolean)
      .filter((src) => fitModes[src] === undefined);
    if (!missing.length) return undefined;
    Promise.all(missing.map((src) => new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve([src, image.naturalWidth >= image.naturalHeight * 1.2 ? 'cover' : 'contain']);
      image.onerror = () => resolve([src, 'cover']);
      image.src = src;
    }))).then((pairs) => {
      if (!cancelled && pairs.length) {
        setFitModes((prev) => ({ ...prev, ...Object.fromEntries(pairs) }));
      }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemList]);

  const fitFor = useCallback((i) => {
    const src = srcAt(i);
    if (!src) return 'contain';
    return fitModes[src] ?? 'cover';
  }, [fitModes, itemList]);

  // ── Slide transition: one GSAP timeline per slot, direction-aware ─────────
  useGSAP(() => {
    if (previousIndex === null || !stageRef.current) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Plain crossfade under reduced motion (no Ken Burns, no wipes).
      const incoming = inRef.current;
      const outgoing = outRef.current;
      if (incoming) gsap.fromTo(incoming, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power1.out' });
      if (outgoing) gsap.to(outgoing, { opacity: 0, duration: 0.28, ease: 'power1.out' });
      return undefined;
    }

    const outgoing = outRef.current;
    const incoming = inRef.current;
    if (!incoming) return undefined;

    const slideFrom = direction > 0 ? 42 : -42;
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut', duration: TRANSITION_MS / 1000 },
      onComplete: () => {
        gsap.set([outgoing, incoming], { clearProps: 'transform,opacity,clipPath,filter' });
      },
    });

    if (outgoing) {
      tl.to(outgoing, { opacity: 0, xPercent: direction > 0 ? -6 : 6, scale: 1.02 }, 0);
    }
    // Incoming: clip-path wipe from the travel side + slight counter-slide.
    tl.fromTo(
      incoming,
      {
        opacity: 0.35,
        xPercent: slideFrom / 6,
        clipPath: direction > 0 ? 'inset(0 0 0 14%)' : 'inset(0 14% 0 0)',
      },
      { opacity: 1, xPercent: 0, clipPath: 'inset(0 0% 0 0%)' },
      0,
    );
    return () => { tl.kill(); };
  }, { dependencies: [slotKey, direction, previousIndex], scope: stageRef, revertOnUpdate: true });

  // Ken Burns drift on the active slide (event variant, playing, motion allowed).
  // Runs only while the modal stage is mounted; killed on unmount/re-slot.
  useGSAP(() => {
    if (variant !== 'event' || !isPlaying || !inRef.current) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const panX = index % 2 === 0 ? -2.5 : 2.5;
    const panY = index % 3 === 0 ? -1.5 : 1.5;
    const tween = gsap.fromTo(
      inRef.current,
      { scale: 1.0, xPercent: 0, yPercent: 0 },
      { scale: 1.07, xPercent: panX, yPercent: panY, duration: 2.6, ease: 'sine.inOut' },
    );
    return () => { tween.kill(); };
  }, { dependencies: [slotKey, index, variant, isPlaying], scope: stageRef, revertOnUpdate: true });

  // ── Community polaroid stack (variant-specific chrome, same stage) ────────
  useGSAP(() => {
    if (variant !== 'community' || previousIndex === null || !stageRef.current) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const stack = stageRef.current?.querySelectorAll('.cine-polaroid--under');
    const top = stageRef.current?.querySelector('.cine-polaroid--top');
    const tl = gsap.timeline({
      defaults: { duration: TRANSITION_MS / 1000 },
      onComplete: () => gsap.set(stageRef.current?.querySelectorAll('.cine-polaroid'), { clearProps: 'transform,opacity' }),
    });
    if (top) {
      const flyX = direction > 0 ? 130 : -130;
      tl.to(top, { xPercent: flyX, rotation: direction > 0 ? 14 : -14, opacity: 0, ease: 'power3.in' }, 0);
    }
    if (stack?.length) {
      tl.fromTo(stack, { scale: 0.94, opacity: 0.7 }, { scale: 1, opacity: 1, ease: 'power2.out' }, 0.05);
    }
    return () => { tl.kill(); };
  }, { dependencies: [slotKey, direction, previousIndex, variant], scope: stageRef, revertOnUpdate: true });

  // ── Project scanline sweep + scan-reveal (variant-specific) ───────────────
  useGSAP(() => {
    if (variant !== 'project' || previousIndex === null || !stageRef.current) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const scan = stageRef.current?.querySelector('.cine-scanline');
    const incoming = inRef.current;
    const tl = gsap.timeline({ defaults: { duration: TRANSITION_MS / 1000 } });
    if (scan) {
      const fromY = direction > 0 ? '-12%' : '112%';
      const toY = direction > 0 ? '112%' : '-12%';
      tl.fromTo(scan, { yPercent: 0, top: fromY, opacity: 0.9 }, { top: toY, opacity: 0.9, ease: 'power2.inOut' }, 0)
        .to(scan, { opacity: 0, duration: 0.08 }, TRANSITION_MS / 1000 - 0.08);
    }
    if (incoming) {
      tl.fromTo(incoming, { clipPath: direction > 0 ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0% 0)', ease: 'power3.inOut' }, 0);
    }
    return () => { tl.kill(); };
  }, { dependencies: [slotKey, direction, previousIndex, variant], scope: stageRef, revertOnUpdate: true });

  // Auto-center the active thumb by scrolling its container only.
  useEffect(() => {
    const container = thumbsRef.current;
    if (!container) return;
    const thumb = container.children[index];
    if (!thumb) return;
    const target = thumb.offsetLeft - (container.clientWidth - thumb.clientWidth) / 2;
    container.scrollTo({ left: target, behavior: 'smooth' });
  }, [index, count]);

  // Animated active-pill indicator between thumbs (left position tween).
  useGSAP(() => {
    const container = thumbsRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;
    const thumb = container.children[index];
    if (!thumb) return;
    gsap.to(indicator, {
      left: thumb.offsetLeft,
      width: thumb.clientWidth,
      duration: 0.35,
      ease: 'power3.out',
    });
  }, { dependencies: [index, count], scope: rootRef });

  // ── Keyboard: arrows + Space (Space only, not page scroll) ────────────────
  const stageKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      direction > 0 ? next() : next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previous();
    } else if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      togglePlay();
    }
  }, [next, previous, togglePlay]);

  // ── Pointer swipe (no library) ────────────────────────────────────────────
  const onPointerDown = useCallback((event) => {
    if (event.pointerType === 'mouse') return;
    pointerState.current = { startX: event.clientX, startY: event.clientY, active: true };
  }, []);
  const onPointerUp = useCallback((event) => {
    if (!pointerState.current.active) return;
    pointerState.current.active = false;
    const dx = event.clientX - pointerState.current.startX;
    const dy = event.clientY - pointerState.current.startY;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      // RTL: swipe direction semantics flip with layout direction.
      const isRtl = rootRef.current?.closest('[dir="rtl"]') != null;
      (isRtl ? dx < 0 : dx > 0) ? next() : previous();
    }
  }, [next, previous]);

  if (!count) {
    return emptyNode ?? (
      <div className={`cine-gallery cine-gallery--empty ${className}`} ref={rootRef}>
        <div className="event-modal__empty"><span>{labels?.noPhotos}</span></div>
      </div>
    );
  }

  const prevLabel = labels?.prev ?? 'Previous photo';
  const nextLabel = labels?.next ?? 'Next photo';

  return (
    <div className={`cine-gallery cine-gallery--${variant} ${className}`} ref={rootRef}>
      {/* Stage */}
      <div
        className="cine-stage"
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={labels?.stage ?? 'Photo gallery'}
        tabIndex={0}
        onKeyDown={stageKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        data-gallery-progress-host
      >
        {/* Blurred backdrop layer for portrait/square photos */}
        {fitFor(index) === 'contain' && srcAt(index) && (
          <div className="cine-stage__backdrop" aria-hidden="true">
            <WebpImage src={srcAt(index)} alt="" aria-hidden="true" />
          </div>
        )}

        {/* Outgoing layer (kept mounted through the 480 ms overlap) */}
        {previousIndex !== null && previousIndex !== index && srcAt(previousIndex) && (
          <div className="cine-layer cine-layer--out" ref={outRef} aria-hidden="true" key={`out-${slotKey}`}>
            {renderSlideOverlay?.(itemList[previousIndex], previousIndex, 'out')}
            <div className={`cine-frame cine-frame--${fitFor(previousIndex)}`}>
              <CineImg src={srcAt(previousIndex)} alt="" />
            </div>
          </div>
        )}

        {/* Incoming / active layer */}
        <div className="cine-layer cine-layer--in" ref={inRef} key={`in-${slotKey}`} aria-live="off">
          {renderSlideOverlay?.(itemList[index], index, 'in')}
          <div className={`cine-frame cine-frame--${fitFor(index)}`}>
            <CineImg src={srcAt(index)} alt={altAt(index)} />
          </div>
        </div>

        {/* Variant chrome that must sit above the image */}
        {variant === 'event' && (
          <>
            <span className="cine-letterbox cine-letterbox--top" aria-hidden="true" />
            <span className="cine-letterbox cine-letterbox--bottom" aria-hidden="true" />
            <span className="cine-vignette" aria-hidden="true" />
            <span className="cine-grain" aria-hidden="true" />
            <span className="cine-streak" aria-hidden="true" />
          </>
        )}
        {variant === 'project' && (
          <>
            <span className="cine-scanline" aria-hidden="true" />
            <span className="cine-bracket cine-bracket--tl" aria-hidden="true" />
            <span className="cine-bracket cine-bracket--tr" aria-hidden="true" />
            <span className="cine-bracket cine-bracket--bl" aria-hidden="true" />
            <span className="cine-bracket cine-bracket--br" aria-hidden="true" />
          </>
        )}
        {variant === 'community' && (
          <div className="cine-polaroid-stack" aria-hidden="true">
            <span className="cine-polaroid cine-polaroid--under cine-polaroid--under2" />
            <span className="cine-polaroid cine-polaroid--under cine-polaroid--under1" />
            <span className="cine-polaroid cine-polaroid--top" />
          </div>
        )}
      </div>

      {/* Controls row: play/pause ring + progress readout + arrows */}
      <div className="cine-controls">
        <button
          type="button"
          className="cine-playpause"
          onClick={togglePlay}
          aria-label={isPlaying ? (labels?.pause ?? 'Pause slideshow') : (labels?.play ?? 'Play slideshow')}
          aria-pressed={!isPlaying}
          data-gallery-progress
          ref={progressRef}
        >
          <svg viewBox="0 0 36 36" aria-hidden="true" className="cine-playpause__ring">
            <circle className="cine-playpause__track" cx="18" cy="18" r="16" />
            <circle
              className="cine-playpause__fill"
              cx="18" cy="18" r="16"
              strokeDasharray="100.53"
              strokeDashoffset="100.53"
              pathLength="100"
            />
          </svg>
          <span className="cine-playpause__icon" aria-hidden="true">{isPlaying ? '❚❚' : '▶'}</span>
        </button>

        <span className="cine-counter" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>

        <div className="cine-arrows">
          <button type="button" className="cine-nav cine-nav--prev" aria-label={prevLabel} onClick={previous}>‹</button>
          <button type="button" className="cine-nav cine-nav--next" aria-label={nextLabel} onClick={next}>›</button>
        </div>
      </div>

      {caption}

      {/* Thumb strip: horizontally scrollable, active auto-centered */}
      <div className="cine-thumbs-scroll">
        <div className={`cine-thumbs ${thumbClass}`} ref={thumbsRef} aria-label={labels?.thumbStrip ?? 'Photo thumbnails'}>
          {itemList.map((item, i) => (
            <button
              key={getSource(item) ?? `item-${i}`}
              type="button"
              className={`cine-thumb ${i === index ? 'is-active' : ''}`}
              aria-label={labels?.viewPhoto ? `${labels.viewPhoto} ${i + 1}` : `View photo ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => selectIndex(i)}
              tabIndex={i === index ? 0 : -1}
            >
              {typeof item === 'object' && item?.type === 'component' ? (
                <span className="cine-thumb__placeholder">{item.thumbLabel ?? '•'}</span>
              ) : (
                <WebpImage src={getSource(item)} alt="" className={`cine-thumb__img ${thumbClass ? `${thumbClass}__img` : ''}`} />
              )}
            </button>
          ))}
          <span className="cine-thumb-indicator" ref={indicatorRef} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function CineImg({ src, alt }) {
  return (
    <WebpImage
      className="cine-img"
      src={src}
      alt={alt}
      loading={alt ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
