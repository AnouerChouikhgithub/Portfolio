import { useEffect, useRef } from 'react';
import './section-background.css';
import DotGrid from './effects/DotGrid';

// Constellation nodes for the community section (viewBox 0 0 1200 600).
const nodes = [
  [140, 120], [340, 90], [520, 210], [760, 120], [1030, 170],
  [220, 380], [430, 470], [640, 360], [880, 430], [1080, 330],
];
const edges = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [2, 7],
  [5, 6], [6, 7], [7, 8], [8, 9], [4, 9], [2, 6], [1, 7], [6, 8],
];

export default function SectionBackground({ variant = 'about' }) {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const background = backgroundRef.current;
    const section = background?.parentElement;
    if (!background || !section) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = section.getBoundingClientRect().bottom > 0
      && section.getBoundingClientRect().top < window.innerHeight;
    let documentVisible = document.visibilityState !== 'hidden';

    const updateActivity = () => {
      background.classList.toggle('is-active', inView && documentVisible && !reducedMotion.matches);
    };
    const updateVisibility = () => {
      documentVisible = document.visibilityState !== 'hidden';
      updateActivity();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateActivity();
    }, { rootMargin: '120px 0px', threshold: 0.01 });

    observer.observe(section);
    document.addEventListener('visibilitychange', updateVisibility);
    reducedMotion.addEventListener('change', updateActivity);
    updateActivity();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
      reducedMotion.removeEventListener('change', updateActivity);
    };
  }, []);

  return (
    <div ref={backgroundRef} className={`section-background section-background--${variant}`} aria-hidden="true">
      <div className="section-background__base" />
      <div className="section-background__grid" />
      <div className="section-background__parallax">
        <div className="section-background__motion" />
      </div>
      {variant === 'about' && <div className="section-background__wipe" />}
      {variant === 'skills' && <DotGrid />}
      {variant === 'community' && (
        <svg className="section-background__constellation" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" focusable="false">
          {edges.map(([from, to]) => (
            <line
              key={`${from}-${to}`}
              className="section-background__constellation-line"
              x1={nodes[from][0]}
              y1={nodes[from][1]}
              x2={nodes[to][0]}
              y2={nodes[to][1]}
            />
          ))}
          {nodes.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} className="section-background__constellation-node" cx={cx} cy={cy} r="3.5" />
          ))}
        </svg>
      )}
    </div>
  );
}
