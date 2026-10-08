import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Shared cinematic-gallery autoplay engine.
 *
 * Timing contract (single source of truth — see also src/components/gallery/CinematicGallery.jsx):
 *  - Every slide dwells GALLERY_INTERVAL_MS (1500 ms) unless an item overrides `dwellMs`
 *    (e.g. the dense PET architecture diagram gets 4500 ms).
 *  - After a manual action (arrow / thumb / keyboard / swipe) the timer restarts and
 *    playing continues after a GALLERY_GRACE_MS (4000 ms) look-at-the-photo grace period.
 *  - The engine NEVER advances until the incoming photo is decoded (img.decode()),
 *    so there is no blank frame; a photo that fails to decode is skipped.
 *  - Playback pauses ONLY for: tab hidden, modal covered by another modal layer
 *    (`options.isObscured`), gallery scrolled out of view (IntersectionObserver on
 *    `options.viewportRef`), or the user pressing Pause. Hover and focus never pause it.
 *  - `progress` is exposed as a ref: the hook writes a `--gallery-progress` CSS variable
 *    (0 → 1) onto that element every frame — no React state per frame.
 */

export const GALLERY_INTERVAL_MS = 1500;
export const GALLERY_GRACE_MS = 4000;
const DECODE_TIMEOUT_MS = 8000;

const getSource = (item) => (typeof item === 'string' ? item : item?.src);
const getDwell = (item) => {
  const override = typeof item === 'object' && item ? Number(item.dwellMs) : NaN;
  return Number.isFinite(override) && override > 0 ? override : GALLERY_INTERVAL_MS;
};

export default function useAutoCarousel(items, options = {}) {
  const { isObscured = false, viewportRef = null } = options;

  const itemList = Array.isArray(items) ? items : [];
  const sourceKey = useMemo(
    () => itemList.map(getSource).filter(Boolean).join('\u0000'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items],
  );
  const sources = useMemo(
    () => (sourceKey ? sourceKey.split('\u0000') : []),
    [sourceKey],
  );
  const dwells = useMemo(
    () => itemList.map(getDwell),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items],
  );
  const count = sources.length;

  const [index, setIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(null);
  const [direction, setDirection] = useState(1);
  const [slotKey, setSlotKey] = useState(0);
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState !== 'hidden',
  );
  const [inView, setInView] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [isPlaying, setIsPlaying] = useState(() => !reducedMotion);

  const indexRef = useRef(index);
  indexRef.current = index;

  const progressRef = useRef(null);
  const advancingRef = useRef(false);
  const slotDwellRef = useRef(GALLERY_INTERVAL_MS);
  const decodeCacheRef = useRef(new Map());

  // Reset to the first slide whenever the photo list changes.
  useEffect(() => {
    setIndex(0);
    setPreviousIndex(null);
    setDirection(1);
    slotDwellRef.current = GALLERY_INTERVAL_MS;
    setSlotKey((key) => key + 1);
  }, [sourceKey]);

  // Tab visibility suspension.
  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  // Reduced-motion listeners start PAUSED and stay paused if the preference flips on.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) setIsPlaying(false);
    };
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  // Off-screen suspension: observe only the gallery viewport, never the page (no Lenis interference).
  useEffect(() => {
    const element = viewportRef?.current;
    if (!element || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [viewportRef]);

  const ensureDecoded = useCallback((src) => {
    if (!src) return Promise.resolve(false);
    const cache = decodeCacheRef.current;
    if (cache.has(src)) return cache.get(src);

    const promise = new Promise((resolve) => {
      if (typeof Image === 'undefined') {
        resolve(false);
        return;
      }
      const image = new Image();
      let settled = false;
      const finish = (ok) => {
        if (!settled) {
          settled = true;
          resolve(ok);
        }
      };
      const timeoutId = window.setTimeout(() => finish(false), DECODE_TIMEOUT_MS);
      image.onload = () => {
        const decodeResult = typeof image.decode === 'function'
          ? image.decode().then(() => true, () => true) // decoded to bitmap — render is safe
          : Promise.resolve(true);
        decodeResult.then((ok) => {
          window.clearTimeout(timeoutId);
          finish(ok);
        }, () => {
          window.clearTimeout(timeoutId);
          finish(true);
        });
      };
      image.onerror = () => {
        window.clearTimeout(timeoutId);
        finish(false);
      };
      image.decoding = 'async';
      image.src = src;
    });

    cache.set(src, promise);
    if (cache.size > 6) {
      // Keep the decode window small (current + preload of index+1/index+2).
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    return promise;
  }, []);

  // Preload window: only index+1 and index+2 (spec — no deep preloading).
  useEffect(() => {
    if (!count) return undefined;
    const next1 = sources[(index + 1) % count];
    const next2 = sources[(index + 2) % count];
    let cancelled = false;
    const run = async () => {
      await ensureDecoded(next1);
      if (!cancelled) await ensureDecoded(next2);
    };
    run();
    return () => { cancelled = true; };
  }, [count, index, sources, ensureDecoded]);

  const beginSlot = useCallback((dwellMs) => {
    slotDwellRef.current = dwellMs;
    setSlotKey((key) => key + 1);
  }, []);

  const goTo = useCallback((nextIndex, dir, { grace = false } = {}) => {
    if (!count) return;
    const bounded = ((nextIndex % count) + count) % count;
    setPreviousIndex(indexRef.current);
    setDirection(dir);
    setIndex(bounded);
    // A manual action buys a 4 s look before auto-advance resumes (only while playing).
    slotDwellRef.current = grace ? GALLERY_GRACE_MS : getDwell(itemList[bounded]);
    setSlotKey((key) => key + 1);
  }, [count, itemList]);

  const selectIndex = useCallback((nextIndex) => {
    if (!count) return;
    const bounded = ((nextIndex % count) + count) % count;
    const delta = bounded - indexRef.current;
    const dir = delta === 0 ? direction : (delta > 0 || delta < -count / 2 ? 1 : -1);
    goTo(bounded, dir, { grace: true });
  }, [count, direction, goTo]);

  const next = useCallback(() => goTo(indexRef.current + 1, 1, { grace: true }), [goTo]);
  const previous = useCallback(() => goTo(indexRef.current - 1, -1, { grace: true }), [goTo]);

  const togglePlay = useCallback(() => {
    setIsPlaying((playing) => {
      if (!playing) {
        // Resuming starts a fresh slot.
        slotDwellRef.current = getDwell(itemList[indexRef.current]);
        setSlotKey((key) => key + 1);
      }
      return !playing;
    });
  }, [itemList]);

  // The advance itself is async (decode-gated); kept in a ref so the rAF loop stays current.
  const advanceRef = useRef(() => {});
  advanceRef.current = async () => {
    if (count < 2) return;
    let candidate = (indexRef.current + 1) % count;
    for (let attempts = 0; attempts < count; attempts += 1) {
      // eslint-disable-next-line no-await-in-loop
      const ok = await ensureDecoded(sources[candidate]);
      if (ok) {
        goTo(candidate, 1);
        return;
      }
      candidate = (candidate + 1) % count; // undecodable photo → skip it
    }
    // Every source failed: retry the same slot later rather than freezing.
    beginSlot(GALLERY_INTERVAL_MS);
  };

  // Playback clock: one rAF loop per slot writes the progress CSS variable and advances.
  const suspended = !documentVisible || !inView || isObscured;
  const running = isPlaying && !suspended && count > 1;

  useEffect(() => {
    if (!running) return undefined;

    let rafId = 0;
    const slotStart = performance.now();
    const dwell = slotDwellRef.current || GALLERY_INTERVAL_MS;

    const tick = (now) => {
      const progress = Math.min((now - slotStart) / dwell, 1);
      const element = progressRef.current;
      if (element) {
        element.style.setProperty('--gallery-progress', progress.toFixed(4));
      }
      if (progress >= 1) {
        if (!advancingRef.current) {
          advancingRef.current = true;
          Promise.resolve(advanceRef.current()).finally(() => {
            advancingRef.current = false;
          });
        }
        return; // freeze at 1 until the decode-gated advance opens the next slot
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      // Leaving a slot mid-way (pause/cover) restarts that slot's progress on resume.
      const element = progressRef.current;
      if (element) element.style.setProperty('--gallery-progress', '0');
    };
  }, [running, slotKey]);

  return {
    index,
    previousIndex,
    direction,
    slotKey,
    count,
    suspended,
    isPlaying,
    togglePlay,
    selectIndex,
    next,
    previous,
    progressRef,
  };
}
