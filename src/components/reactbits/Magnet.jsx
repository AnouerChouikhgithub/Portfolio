import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Magnet({ children, className = '', range = 18 }) {
  const ref = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion || !supportsPointer || !ref.current) {
      return undefined;
    }

    const node = ref.current;
    const xTo = gsap.quickTo(node, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.25)' });
    const yTo = gsap.quickTo(node, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.25)' });

    const handlePointerMove = (event) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - (rect.left + rect.width / 2)) / rect.width) * range * 2;
      const y = ((event.clientY - (rect.top + rect.height / 2)) / rect.height) * range * 2;
      xTo(x);
      yTo(y);
    };

    const handlePointerLeave = () => {
      xTo(0);
      yTo(0);
    };

    node.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [range]);

  return (
    <span ref={ref} className={`magnet ${className}`.trim()}>
      {children}
    </span>
  );
}
