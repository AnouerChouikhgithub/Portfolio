import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../../i18n/I18nProvider';

gsap.registerPlugin(ScrollTrigger);

const buildSegments = (text, type) => {
  if (type === 'words') {
    return text.split(/(\s+)/).map((part, index) => {
      if (/\s+/.test(part)) {
        return <span key={`space-${index}`} className="split-space">{part}</span>;
      }
      return <span key={`word-${index}`} className="split-word">{part}</span>;
    });
  }

  if (type === 'lines') {
    return text.split(/\n|<br\s*\/>/).map((part, index) => (
      <span key={`line-${index}`} className="split-line">{part}</span>
    ));
  }

  return Array.from(text).map((char, index) => (
    <span key={`char-${index}`} className="split-char">{char === ' ' ? '\u00A0' : char}</span>
  ));
};

export default function SplitText({
  text = '',
  tag: Tag = 'span',
  className = '',
  splitType = 'chars',
  delay = 0,
  duration = 0.8,
  stagger = 0.025,
  ease = 'power3.out',
  from = { opacity: 0, y: 18 },
  trigger = 'mount',
  start = 'top 85%',
}) {
  const ref = useRef(null);
  const { isRtl } = useI18n();
  const [ready, setReady] = useState(false);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const effectiveSplitType = isRtl && splitType === 'chars' ? 'words' : splitType;

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion || !text) {
      setReady(true);
      return undefined;
    }

    const targets = Array.from(node.querySelectorAll('.split-char, .split-word, .split-line, .split-space'));
    if (!targets.length) {
      setReady(true);
      return undefined;
    }

    const tweenConfig = {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration,
      ease,
      delay,
      stagger,
      onComplete: () => {
        node.style.visibility = 'visible';
        setReady(true);
      },
    };

    if (trigger === 'scroll') {
      gsap.fromTo(targets, { ...from, filter: 'blur(8px)' }, {
        ...tweenConfig,
        scrollTrigger: {
          trigger: node,
          start,
          once: true,
        },
      });
      return undefined;
    }

    gsap.fromTo(targets, { ...from, filter: 'blur(8px)' }, tweenConfig);

    return () => {
      gsap.killTweensOf(targets);
    };
  }, [delay, duration, ease, from, prefersReducedMotion, splitType, start, text, trigger, isRtl]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ visibility: ready || prefersReducedMotion ? 'visible' : 'hidden' }}
    >
      {buildSegments(text, effectiveSplitType)}
    </Tag>
  );
}
