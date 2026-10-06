import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return undefined;
    }

    const progressNode = document.getElementById('scroll-progress');
    if (!progressNode) {
      return undefined;
    }

    const trigger = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      scrub: false,
      onUpdate: (self) => {
        progressNode.style.transform = `scaleX(${self.progress})`;
      },
    });

    return () => trigger.kill();
  }, []);

  return <div id="scroll-progress" className="scroll-progress" aria-hidden="true" />;
}
