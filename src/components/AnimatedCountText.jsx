import { useEffect, useMemo, useRef, useState } from 'react';

const numberPattern = /\d+/g;

export default function AnimatedCountText({ text }) {
  const ref = useRef(null);
  const targets = useMemo(
    () => [...text.matchAll(numberPattern)].map((match) => Number(match[0])),
    [text],
  );
  const [values, setValues] = useState(() => targets.map(() => 0));

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    setValues(targets.map(() => 0));
    const finish = () => setValues(targets);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return undefined;
    }
    if (!('IntersectionObserver' in window)) {
      finish();
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
        setValues(targets.map((target) => Math.round(target * easedProgress)));
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
          {index < values.length ? (
            <span
              className="modal-countup__number"
              style={{ minWidth: `${targets[index].toString().length}ch` }}
            >
              {values[index]}
            </span>
          ) : ''}
        </span>
      ))}
    </span>
  );
}
