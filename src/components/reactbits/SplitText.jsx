import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../../i18n/I18nProvider';

gsap.registerPlugin(ScrollTrigger);

// Module-level identity so the effect does not re-run (and re-animate) on
// every parent re-render — theme toggles re-render the whole tree.
const DEFAULT_FROM = { opacity: 0, y: 18 };

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
  from = DEFAULT_FROM,
  trigger = 'mount',
  start = 'top 85%',
}) {
  const ref = useRef(null);
  const { isRtl } = useI18n();
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const effectiveSplitType = isRtl && splitType === 'chars' ? 'words' : splitType;

  // useLayoutEffect: fromTo applies the from-state synchronously
  // (immediateRender) BEFORE the first paint of these segments, so there is
  // no flash of fully-visible text and no visibility gate to hide the
  // animation itself (the old bug: the node stayed hidden until onComplete).
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion || !text) {
      return undefined;
    }

    const targets = Array.from(node.querySelectorAll('.split-char, .split-word, .split-line, .split-space'));
    if (!targets.length) {
      return undefined;
    }

    const vars = {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration,
      ease,
      delay,
      stagger,
    };

    if (trigger === 'scroll') {
      vars.scrollTrigger = { trigger: node, start, once: true };
    }

    const tween = gsap.fromTo(targets, { ...from, filter: 'blur(8px)' }, vars);

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, duration, ease, from, prefersReducedMotion, splitType, start, text, trigger, stagger, isRtl]);

  return (
    <Tag ref={ref} className={className}>
      {/* Segments are decorative for assistive tech: char-split spans are
          announced letter-by-letter by some screen readers. The clean
          string ships in a visually-hidden sibling instead. */}
      <span className="split-segments" aria-hidden="true">
        {buildSegments(text, effectiveSplitType)}
      </span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
