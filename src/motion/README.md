# Motion architecture

One rule: **one library owns a given property on a given element.** There is
no Framer Motion / `motion` package dependency — every animation is GSAP,
Lenis, anime.js or plain CSS.

## Ownership

| Owner | Scope | Entry points |
|---|---|---|
| **GSAP + ScrollTrigger** | All scroll-linked work: section reveals (play **once**), hero entrance timeline, card reveal batches, section-background parallax/scrub/wipes, constellation draw-on | `scrollReveal.js`, `ScrollProgress.jsx`, `Hero.jsx` |
| **Lenis** | Smooth scrolling — exactly ONE instance for the whole app, plus programmatic `scrollTo` helpers and the modal scroll lock | `MotionProvider.jsx`, `lenisStore.js`, `useScrollLock.js` |
| **anime.js (lazy)** | SVG/icon micro-motion only: hero background draw-on, theme-icon morph. Loaded on demand (`loadAnime`) so it stays out of the initial bundle; never scroll-linked work | `anime.js` (`microAnimate` wrapper), `HeroBackground*.jsx`, `Header.jsx` |
| **CSS** | Hover/press transitions, focus states, the status-chip keyframes, the View Transitions theme reveal, every `prefers-reduced-motion` collapse | `src/styles/*.css` |
| **Delegated JS listeners** | Card pointer spotlight + tilt (one rAF-throttled `pointermove`, fine pointers only) | `cardSpotlight.js` |
| **React component state** | Split-text entrance and magnetism (ported reactbits, reimplemented on GSAP — no motion library) | `reactbits/SplitText.jsx`, `reactbits/Magnet.jsx` |

## Rules

1. **Never two libraries on one property.** GSAP writes inline transforms on
   the parallax wrappers while CSS drift animates the inner layer; cards get
   their tilt from CSS custom properties (`--rx/--ry`), not from a tween.
2. **`prefers-reduced-motion` is checked at every entry point** (GSAP
   contexts bail, `microAnimate` no-ops, the spotlight listener never
   attaches, CSS collapses durations to ~0 in the global block in
   `tokens.css`).
3. **Reveals play once.** All scroll reveals use `once: true` — content
   never re-hides on scroll-back and finished triggers `kill()` themselves.
4. **Budget:** the initial JS bundle must stay ≤ 175 kB gzip. Static
   `motion/react` imports cost ~28.5 kB gzip on their own, which is why the
   stack above never reaches for them; `vite.config.js` `manualChunks`
   additionally quarantines anime.js/motion leftovers in async chunks.
