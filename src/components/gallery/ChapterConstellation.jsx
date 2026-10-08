/**
 * ChapterConstellation — the "Network Deck" background for the community modal.
 *
 * A single <canvas> draws a slowly drifting constellation: one node per IEEE
 * chapter, tinted with the chapter badge colors, joined by thin lines to the
 * modal's center node. Hovering a chapter badge (or its floating card) brightens
 * its node; clicking a node opens the same ChapterDetailModal as the badge.
 *
 * Canvas (not SVG) keeps this to one paint layer; the rAF loop pauses when the
 * tab is hidden, when the modal is covered by the chapter detail modal, and
 * under reduced motion (static single paint instead).
 */

import { useEffect, useRef } from 'react';

const CHAPTER_NODE_COLORS = {
  CS: '#FACC15',     // gold
  IIP: '#22C55E',    // green
  RAS: '#B91C1C',    // burgundy
  SIGHT: '#F97316',  // orange
  WIE: '#A855F7',    // purple
  DEFAULT: '#60A5FA', // IEEE blue fallback
};

const NODE_COUNT_EXTRA = 26; // anonymous constellation stars besides chapter nodes

export default function ChapterConstellation({ chapterLogos = [], onOpenChapter }) {
  const canvasRef = useRef(null);
  const hoverIndexRef = useRef(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let running = true;
    let covered = false;

    const chapterNames = chapterLogos.map((logo) => logo.name);
    const namedNodes = chapterNames.map((name, i) => ({
      name,
      color: CHAPTER_NODE_COLORS[name] ?? CHAPTER_NODE_COLORS.DEFAULT,
      baseX: 0.18 + ((i + 1) / (chapterNames.length + 1)) * 0.64,
      baseY: 0.22 + ((i % 2) * 0.56),
      phase: i * 1.7,
    }));
    const stars = Array.from({ length: NODE_COUNT_EXTRA }, (_, i) => ({
      baseX: ((i * 0.618) % 1),
      baseY: ((i * 0.382) % 0.8) + 0.1,
      phase: i * 2.3,
      dim: true,
    }));
    const nodes = [...namedNodes, ...stars];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width, 1) * (window.devicePixelRatio || 1);
      height = Math.max(rect.height, 1) * (window.devicePixelRatio || 1);
      canvas.width = width;
      canvas.height = height;
    };
    resize();

    const draw = (timeMs) => {
      context.clearRect(0, 0, width, height);
      const time = timeMs / 1000;

      const positions = nodes.map((node) => ({
        x: (node.baseX + Math.sin(time * 0.12 + node.phase) * 0.035) * width,
        y: (node.baseY + Math.cos(time * 0.09 + node.phase) * 0.045) * height,
        node,
      }));

      // Thin lines from the modal center node to each named chapter node.
      const centerX = width / 2;
      const centerY = height / 2;
      context.lineWidth = Math.max(1, window.devicePixelRatio);
      positions.forEach((position) => {
        if (!position.node.name) return;
        const hovering = positions.indexOf(position) === hoverIndexRef.current;
        context.strokeStyle = hovering
          ? position.node.color
          : withAlpha(position.node.color, 0.32);
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.lineTo(position.x, position.y);
        context.stroke();
      });

      positions.forEach((position, i) => {
        const radius = position.node.name ? (i === hoverIndexRef.current ? 7 : 5.5) : 1.6;
        context.fillStyle = position.node.name
          ? position.node.color
          : withAlpha('#94A3B8', 0.5);
        context.beginPath();
        context.arc(position.x, position.y, radius, 0, Math.PI * 2);
        context.fill();
        if (position.node.name) {
          context.font = `${11 * (window.devicePixelRatio || 1)}px system-ui, sans-serif`;
          context.fillStyle = 'rgba(230, 234, 240, 0.75)';
          context.textAlign = 'center';
          context.fillText(position.node.name, position.x, position.y - 10);
        }
      });
    };

    const tick = (timeMs) => {
      if (running && !covered) draw(timeMs);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const handleVisibility = () => { covered = document.visibilityState === 'hidden'; };
    document.addEventListener('visibilitychange', handleVisibility);

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * (window.devicePixelRatio || 1);
      const y = (event.clientY - rect.top) * (window.devicePixelRatio || 1);
      let hovered = -1;
      positionsAt(x, y);
      function positionsAt(px, py) {
        for (let i = 0; i < namedNodes.length; i += 1) {
          const node = namedNodes[i];
          const nx = (node.baseX + Math.sin((performance.now() / 1000) * 0.12 + node.phase) * 0.035) * rect.width * (window.devicePixelRatio || 1);
          const ny = (node.baseY + Math.cos((performance.now() / 1000) * 0.09 + node.phase) * 0.045) * rect.height * (window.devicePixelRatio || 1);
          if (((px - nx) ** 2 + (py - ny) ** 2) < 400) { hovered = i; break; }
        }
      }
      hoverIndexRef.current = hovered;
      canvas.style.cursor = hovered >= 0 ? 'pointer' : '';
    };

    const handleClick = (event) => {
      handlePointerMove(event);
      const hovered = hoverIndexRef.current;
      if (hovered >= 0) onOpenChapter?.(chapterLogos[hovered]);
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('click', handleClick);
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(canvas);

    if (reducedMotion) {
      running = false;
      draw(performance.now()); // one static paint
    }

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', handleVisibility);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('click', handleClick);
      resizeObserver?.disconnect();
    };
  }, [chapterLogos, onOpenChapter]);

  return (
    <canvas
      ref={canvasRef}
      className="cine-constellation"
      aria-hidden="true"
    />
  );
}

function withAlpha(hex, alpha) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
