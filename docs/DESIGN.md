# Design system

## Tokens

All colour, spacing, radius, elevation, z-index and motion values live in
`src/styles/tokens.css` under `:root` (dark — the default theme) and
`html[data-theme="light"]`. Components should reference tokens, not raw hex
values.

### Naming

| Group | Tokens |
| --- | --- |
| Surfaces | `--bg`, `--bg-elevated`, `--surface`, `--surface-2`, `--surface-alt` |
| Text | `--text`, `--muted`, `--text-faint`, `--accent-contrast` (text *on* accent) |
| Accents | `--accent` (cyan), `--accent-2` (emerald), `--accent-warm` (amber — highlights/badges only) |
| Lines & chrome | `--border`, `--border-strong`, `--border-hover`, `--header-bg`, `--overlay`, `--glow`, `--ring` |
| Gradients | `--grad-accent`, `--grad-hero`, `--grad-brand-warm` |
| Radii | `--radius-sm` 8px, `--radius-md` 12px, `--radius-lg` 18px, `--radius-pill` 999px |
| Spacing | `--space-1` … `--space-8` (0.25rem → 4rem, 4px base) |
| Elevation | `--shadow-1` … `--shadow-3`, plus aliases `--shadow`, `--shadow-lg`, `--card-shadow` |
| Layout | `--max-width`, `--scroll-offset` |
| Motion | `--dur-fast` 180ms, `--dur-base` 500ms, `--dur-slow` 900ms, `--ease-out`, `--ease-in-out`, `--ease-std` |
| Z-index | `--z-background` … `--z-cursor` |
| Type | `--font-body` (Inter), `--font-display` (Space Grotesk), `--font-mono`, `--text-xs` … `--text-h1` (fluid `clamp()`) |

Identity is unchanged: **cyan + emerald "circuit"**, with **amber** added as a
single warm accent used sparingly (badges, highlights, the events ruler).

Light mode uses **layered tinted shadows** (`rgba(15,27,38,.06/.10/.16)`) and
never neon glows — `--glow` resolves to a soft tinted halo there.

## Typography

- Body: **Inter** (`--font-body`) with `font-feature-settings: 'cv11' 1, 'ss01' 1`.
- Display: **Space Grotesk** (`--font-display`) on `h1`–`h6`, loaded from the
  existing Google Fonts request with `display=swap`.
- Arabic: **Cairo**, still injected by `I18nProvider`; `index.html` preloads it
  from the inline script when the visitor is Arabic-first so the swap does not
  shift layout.
- Stats/counters/dates: `font-variant-numeric: tabular-nums`.

## Contrast table (WCAG 2.1)

Targets: **body text ≥ 4.5:1**, **UI/large text ≥ 3:1**, in *both* themes.
Ratios computed with the sRGB relative-luminance formula.

### Dark (`:root`)

| Token pair | Foreground | Background | Ratio | Target | |
| --- | --- | --- | ---: | ---: | --- |
| `--text` on `--bg` | `#E6EAF0` | `#070A0F` | 16.42 | 4.5 | ✅ |
| `--text` on `--surface` | `#E6EAF0` | `#0F1620` | 15.05 | 4.5 | ✅ |
| `--text` on `--surface-2` | `#E6EAF0` | `#151E2B` | 13.89 | 4.5 | ✅ |
| `--muted` on `--bg` | `#94A3B8` | `#070A0F` | 7.73 | 4.5 | ✅ |
| `--muted` on `--surface` | `#94A3B8` | `#0F1620` | 7.09 | 4.5 | ✅ |
| `--muted` on `--surface-2` | `#94A3B8` | `#151E2B` | 6.54 | 4.5 | ✅ |
| `--accent` on `--surface` | `#22D3EE` | `#0F1620` | 10.05 | 4.5 | ✅ |
| `--accent` on `--bg` | `#22D3EE` | `#070A0F` | 10.97 | 4.5 | ✅ |
| `--accent-2` on `--surface` | `#34D399` | `#0F1620` | 9.45 | 4.5 | ✅ |
| `--accent-2` on `--bg` | `#34D399` | `#070A0F` | 10.31 | 4.5 | ✅ |
| `--accent-warm` on `--surface` | `#FBBF24` | `#0F1620` | 10.88 | 4.5 | ✅ |
| `--accent-warm` on `--bg` | `#FBBF24` | `#070A0F` | 11.87 | 4.5 | ✅ |
| `--accent-contrast` on `--accent` (primary button) | `#061018` | `#22D3EE` | 10.61 | 4.5 | ✅ |
| `--grad-hero` lightest stop on hero wash | `#5fe8ff` | `#050b10` | 13.63 | 3.0 (display) | ✅ |
| `--muted` on `--bg-elevated` | `#94A3B8` | `#0C121A` | 7.33 | 4.5 | ✅ |

### Light (`html[data-theme="light"]`)

| Token pair | Foreground | Background | Ratio | Target | |
| --- | --- | --- | ---: | ---: | --- |
| `--text` on `--bg` | `#0F1B26` | `#F6F8FB` | 16.38 | 4.5 | ✅ |
| `--text` on `--surface` | `#0F1B26` | `#FFFFFF` | 17.43 | 4.5 | ✅ |
| `--text` on `--surface-2` | `#0F1B26` | `#EEF3F8` | 15.61 | 4.5 | ✅ |
| `--muted` on `--bg` | `#475569` | `#F6F8FB` | 7.12 | 4.5 | ✅ |
| `--muted` on `--surface` | `#475569` | `#FFFFFF` | 7.58 | 4.5 | ✅ |
| `--muted` on `--surface-2` | `#475569` | `#EEF3F8` | 6.79 | 4.5 | ✅ |
| `--accent` on `--surface` | `#0E7490` | `#FFFFFF` | 5.36 | 4.5 | ✅ |
| `--accent` on `--bg` | `#0E7490` | `#F6F8FB` | 5.04 | 4.5 | ✅ |
| `--accent` on `--surface-2` | `#0E7490` | `#EEF3F8` | 4.80 | 4.5 | ✅ |
| `--accent-2` on `--surface` | `#047857` | `#FFFFFF` | 5.48 | 4.5 | ✅ |
| `--accent-2` on `--surface-2` | `#047857` | `#EEF3F8` | 4.91 | 4.5 | ✅ |
| `--accent-warm` on `--surface` | `#92400E` | `#FFFFFF` | 7.09 | 4.5 | ✅ |
| `--accent-warm` on `--surface-2` | `#92400E` | `#EEF3F8` | 6.35 | 4.5 | ✅ |
| `--accent-contrast` on `--accent` (primary button) | `#FFFFFF` | `#0E7490` | 5.36 | 4.5 | ✅ |
| `--grad-hero` darkest stop on hero wash | `#0A5666` | `#d3ecf4` | 6.73 | 3.0 (display) | ✅ |
| `--muted` on hero wash | `#475569` | `#d3ecf4` | 6.16 | 4.5 | ✅ |

### Fixed from the audit

| Was | Was ratio | Now | Now ratio |
| --- | ---: | --- | ---: |
| `--accent #0891b2` on `#f4f8fb` | 3.45 ❌ | `#0E7490` on `#F6F8FB` | 5.04 ✅ |
| white on `#0891b2` button | 3.68 ❌ | `#FFFFFF` on `#0E7490` | 5.36 ✅ |
| `--accent-2 #0f9f83` on `#f4f8fb` | 3.12 ❌ | `#047857` on `#F6F8FB` | 5.15 ✅ |
| hero name `#087f9e` on `#bfe8f2` | 3.53 ❌ | `#0A5666` on `#d3ecf4` | 6.73 ✅ |
| hardcoded light-mode hero buttons `#087f9e`/`#076b7d` | 4.63 / 4.71 | merged `.btn` → `--accent` tokens | 5.36 ✅ |

## Theme switching

`ThemeProvider.toggleTheme` uses the **View Transitions API** when supported and
motion is allowed: the new paint is revealed through a circular `clip-path`
expanding from the toggle button (`--theme-reveal-x/y`). Without support, or
under `prefers-reduced-motion`, it falls back to the explicit `background-color`
/ `color` transitions on `body` and cards. `transition: all` is never used on
`body` or `section`.

## Card pointer spotlight (Phase 3c)

Four card selectors (`.project-card`, `.events-card`, `.community-card`,
`.skills-group-card`) declare a radial `--glow` gradient positioned by
`--mx/--my`; `.project-card` additionally consumes `--rx/--ry` for a subtle
3D tilt. `src/motion/cardSpotlight.js` feeds them from **one** delegated,
rAF-throttled `pointermove` listener mounted once in `App.jsx`.

- Fine pointers only (`pointer: fine`): touch devices keep the resting state
  (glow parked at `-999px`, tilt `0deg`), so nothing is lost but nothing
  flickers on tap either.
- Fully disabled under `prefers-reduced-motion` (listener never attaches).
- Vars reset on pointer-leave and on any scroll/resize — the card's own hover
  lift shifts its box, so the rect is re-read inside each frame instead of
  being cached.
- CSS: the cards paint `background-color`, not the `background` shorthand —
  a shorthand later in the cascade would reset `background-image` and kill
  the spotlight (this was the original reason the gradient never rendered).
- Tilt is composed into the same `transform` as the hover lift
  (`translateY(-8px) perspective(900px) rotateX(var(--rx)) rotateY(var(--ry))`)
  so hover and tilt never clobber each other. Tilt is intentionally limited
  to `.project-card` (the marquee cards); the other cards keep their existing
  hover transforms untouched.

`AnimatedCountText` (project-modal chips) counts up by writing `textContent`
through refs — no React state per animation frame — while keeping the
`aria-label` full string on the wrapper for screen readers.

## Reveals, contact & footer (Phase 3d)

- Scroll reveals play **once** (`once: true` at all 7 reveal sites instead
  of `toggleActions: 'play none play reverse'`): content no longer re-hides
  when scrolling back up, and finished triggers `kill()` themselves — the
  page runs with ~16 fewer live ScrollTriggers after a full scroll-through.
- **Bug fixed:** `.footer__content`'s reveal start (`top 88%`) resolved past
  the maximum scroll position (footer top sits at 960/1000px even at the
  bottom), so the trigger could never fire and the footer stayed
  `visibility: hidden`. It now reveals on `top bottom` — reachable by
  definition, and it reveals the moment the footer peeks in.
- Contact: `.contact__field` gives keyboard focus (`:focus-within`) the same
  lift + accent bar as hover; input focus rings use an accent tint at 22%
  instead of the near-invisible `--border` ring; the submit button gets an
  explicit `:disabled` (sending) state; the status message is a styled chip
  (`contact__status`, accent = success / red = failure, entrance keyframes,
  still `role="status"`).
- Footer: social links get `:focus-visible` parity with hover (accent fill,
  lifted, icon scales 1.12) and an explicit transition list instead of
  `transition: all`.

## Colour token pass (Phase 4b)

- New tokens in `:root` + `html[data-theme="light"]`: `--danger` and the
  `--link-*` family (blue/red/orange/yellow/teal/violet + hover variants).
  Event-modal link hues and every error/danger colour now resolve from
  tokens; the nine `html[data-theme="light"]` override rules for link hues
  were deleted because the light token block re-inks them (same values as
  before — asserted by the colour QA in both themes).
- **Two AA fixes fell out of tokenising:** light-theme `.contact__error` is
  now `#B91C1C` (≈6.9:1 on white) instead of `#ff4d4f` (≈3.1:1, fail), and
  accent-filled buttons (`.project-modal__link`, `.pet-modal__primary-cta`)
  use `var(--accent-contrast)` — in light mode that flips their text to
  white (≈5.3:1) where the old hardcoded `#061018` on `#0E7490` was ≈3.2:1
  (fail).
- All 33 `rgba(34, 211, 238, α)` hairlines became
  `color-mix(in srgb, var(--accent) α%, transparent)` — pixel-identical in
  dark (`--accent` *is* `#22d3ee`) and now tinted by the light accent
  instead of staying bright cyan on white.
- The light project-modal's grey ink scale is now a scoped token set
  (`--text`…`--text-4` on `.project-modal__panel`).

**Intentionally kept as literals** (artwork/chrome, not theme semantics):
`color-mix` darken/lighten mixers (`#000`/`#fff`), white logo/PDF-paper
plates (stay white in *both* themes by design), black/white shadow and
overlay pigments (`rgba(0,0,0,·)`, `rgba(255,255,255,·)`), the PDF link
focus ring `#087f9e` (AA on white paper in both themes), and the background
files' palette constants — those are declared as custom properties
(`--hero-bg-start`, `--section-base`, …) in their own theme-scoped blocks.

## CSS file structure (Phase 4c)

The 4,600-line `src/styles.css` was split into `src/styles/*.css` — 18
contiguous slices imported in order by `src/styles/index.css` (what
`main.jsx` imports). Vite inlines `@import`s in order, so the cascade is
byte-identical to the original: the split script asserts byte-exact
reconstitution of the source and balanced braces per chunk, and the built
dist CSS hash did not change across the split.

Order matters — do not reorder `index.css`:
tokens → typography → utilities → header → hero → about → skills →
projects → project-modal → pet-modal → community → events → pdf-modal →
contact → footer → theme-overrides (light) → responsive → skills-subscreen.

## Images (Phase 5b)

`npm run images:convert` (sharp, devDependency) writes WebP siblings for
every `public/**` photo — 109 files, **37.8 MB → 10.2 MB (−73%)**, capped at
1920 px (retina-safe for full-screen galleries), q80, idempotent. Content
images render through `<WebpImage>`: a `<picture>` whose `<source>` is the
WebP and whose `<img src>` stays the original. `<picture>` gets
`display: contents` (utilities.css) so wrapping is layout-neutral.

Failure behaviour: if a WebP is missing or 404s, the `img` reverts to the
original source once (then runs the consumer's `onError`) — a photo that
hasn't been converted yet can never render broken. Originals are kept in
the repo as the fallback (trade-off: deploy weight rises by ~10 MB while
visitor transfer drops by ~27 MB; originals could be dropped later if the
`onError` path is ever removed deliberately).

## Performance trade-off (Phase 5c)

Lighthouse (12.x, mobile simulated throttling, median of 3 runs against
`vite preview`, before = `93ec880`, after = this branch):

| | Before | After |
|---|---|---|
| Performance / A11y / BP / SEO | 76 / 98 / 100 / 92 | 73 / 98 / 100 / 92 |
| FCP · LCP · CLS | 2.7 s · 4.8 s · 0 | 3.3 s · 4.5 s · 0 |
| TBT · Speed Index | 0 ms · 4.2 s | 176 ms · 4.7 s |
| Initial JS / CSS (gzip) | 161.1 / 14.8 kB | 165.1 / 17.1 kB (budgets 175 / 22) |
| Photo payload | 37.8 MB | 10.2 MB webp (−73%) |

The ~3-point performance drop is the load-time motion itself: the anime.js
hero draw-on (async chunk, ~43 kB gzip + scripting) and the SplitText/blur
entrance timeline add TBT, and +15 kB render-blocking CSS nudges FCP —
while LCP *improved* through the `<picture>` portrait and CLS stayed 0.
All of it is inside the hard budgets, every layer bails under
`prefers-reduced-motion` (the entrance/draw-on work then never runs), and
the brief's primary goal is the motion design — so this is accepted and
documented rather than reverted. The remaining gap to the aspirational ≥90
is dominated by simulated-throttle FCP/Speed-Index on a baseline that
already scored 76.

## Motion ownership

See `src/motion/README.md` — GSAP owns scroll-linked work, Lenis owns smooth
scrolling (one instance), anime.js owns SVG/icon micro-motion, CSS owns
hover/press/keyframes, and one delegated listener owns the card spotlight.
There is no Framer Motion/`motion` dependency. One library per property per
element.

## Gallery engine (shared)

All three modals render `src/components/gallery/CinematicGallery.jsx` — one
16/10 stage, one autoplay engine (`useAutoCarousel`), variant-specific chrome:

- **event → "Director's Cut"** — letterbox bars, vignette, film grain,
  anamorphic accent streak; Ken Burns drift (scale 1→1.07, alternating pans,
  2.6 s ease so it never snaps); REC/timecode/frame-counter HUD + crop marks;
  35 mm sprocket-masked thumb strip with an accent-lit active frame; projector
  cone behind the panel.
- **community → "Network Deck"** — photos as polaroid cards (10 px frame,
  caption strip with the community name + year) over an IEEE blue→violet mesh;
  a canvas constellation draws one node per chapter badge (gold, green,
  burgundy, orange, purple), brightens on hover and opens ChapterDetailModal
  on click; round avatar thumbs.
- **project → "Blueprint HUD"** — corner brackets + accent scanline sweep with
  scan-reveal per slide, tabular-nums counter, everything tinted from the
  project's `--accent`/bg pair via color-mix (never a hardcoded hue); PET keeps
  its architecture-diagram slide.

### Timing decisions

- `GALLERY_INTERVAL_MS` = 1500 ms everywhere; the PET architecture diagram
  overrides `dwellMs: 4500` because a dense diagram cannot be read in 1.5 s.
- After a manual action (arrow / thumb / keyboard / swipe) the next
  auto-advance waits a 4000 ms grace period.
- The incoming photo must resolve `img.decode()` before the slot advances —
  no blank frames; undecodable photos are skipped.
- Pause only for: hidden tab, modal covered (ChapterDetailModal), gallery
  out of view, or user pause. Hover/focus never pause.
- `prefers-reduced-motion`: starts PAUSED with the play button visible and
  uses a plain crossfade — no Ken Burns, wipes, constellation drift or
  projector animation.
- WCAG 2.2.2: the Play/Pause button carries an SVG progress ring driven by a
  rAF-written `--gallery-progress` variable; `aria-live="off"` on the stage.

### Assets

`node scripts/gallery-assets.mjs` (npm run `images:gallery`) writes
`-main.webp` (1600 px, q78) and `-thumb.webp` (240 px, q70) siblings for every
photo and `-poster.webp` for every video. `src/lib/photoSrc.js` maps a logical
path to a variant. 37.85 MB of source photos → 8.61 MB mains + 0.82 MB thumbs.
Originals are untouched and remain the fallback chain.

### QA helpers

`.gallerycheck.mjs` (autoplay contract, 9 checks), `.modalsweep.mjs`
(structure × 3 modals × 2 themes, 37 checks), `.rtlcheck.mjs` (AR/390 +
reduced-motion, 14 checks) — git-ignored, re-runnable against `vite preview`.
