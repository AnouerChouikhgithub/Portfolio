import { useEffect, useMemo, useRef } from 'react';

const numberPattern = /\d+/g;

// Counts numbers inside `text` up from 0 when scrolled into view.
// Phase 3c: animation frames write textContent through refs instead of
// calling setState per frame (no React re-render per rAF while visible).
// The wrapper keeps `aria-label={text}` so screen readers always get the
// final string; individual number spans stay aria-hidden.
export default function AnimatedCountText({ text }) {
  const ref = useRef(null);
  const numberRefs = useRef([]);
  const targets = useMemo(
    () => [...text.matchAll(numberPattern)].map((match) => Number(match[0])),
    [text],
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const nodes = numberRefs.current.slice(0, targets.length).filter(Boolean);
    const writeAll = (values) => {
      for (let index = 0; index < nodes.length; index += 1) {
        nodes[index].textContent = String(values[index]);
      }
    };

    const showFinal = () => writeAll(targets);
    writeAll(targets.map(() => 0));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showFinal();
      return undefined;
    }
    if (!('IntersectionObserver' in window)) {
      showFinal();
      return undefined;
    }

    let frameId;
    let startedAt;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      observer.disconnect();
      const animate = (timestamp) => {
        startedAt ??= timestamp;
        const progress = Math.min((timestamp - startedAt) / 850, 1);
        const easedProgress = 1 - ((1 - progress) ** 3);
        writeAll(targets.map((target) => Math.round(target * easedProgress)));
        if (progress < 1) frameId = window.requestAnimationFrame(animate);
      };
      frameId = window.requestAnimationFrame(animate);
    }, { threshold: 0.6 });

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [text]);

  const parts = text.split(numberPattern);
  return (
    <span ref={ref} aria-label={text}>
      {parts.map((part, index) => (
        <span key={`part-${index}`} aria-hidden="true">
          {part}
          {index < targets.length ? (
            <span
              ref={(node) => {
                numberRefs.current[index] = node;
              }}
              className="modal-countup__number"
              style={{ minWidth: `${targets[index].toString().length}ch` }}
            >
              0
            </span>
          ) : ''}
        </span>
      ))}
    </span>
  );
}
