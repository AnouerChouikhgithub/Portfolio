# Anouer Chouikh — Engineering & Innovation Portfolio

![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite&logoColor=white)
![Languages](https://img.shields.io/badge/languages-3-blue)
![Responsive](https://img.shields.io/badge/responsive-mobile%20%7C%20tablet%20%7C%20desktop-10b981)
![License](https://img.shields.io/badge/license-MIT-green)

🔗 **Live site:** [anouer-chouikh.netlify.app](https://anouer-chouikh.netlify.app)

A single-page portfolio for **Anouer Chouikh** — Computer Engineering & IoT student (ISITCom) — showcasing robotics projects, IEEE community leadership, and a multilingual, fully responsive experience with a built-in PDF résumé viewer.

**Highlights:** dark/light theme · EN/FR/AR with full RTL · cinematic motion system (GSAP + Lenis + anime.js) · lazy-loaded PDF viewer with pinch-to-zoom · project, event & community galleries with stacked accessible modals · contact form with server-side validation & anti-spam · Lighthouse-friendly performance budget.

---

## Table of Contents

1. [Features](#1-features)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Installation & Setup](#4-installation--setup)
5. [NPM Scripts](#5-npm-scripts)
6. [Responsive Design](#6-responsive-design)
7. [Multi-Language & i18n](#7-multi-language--i18n)
8. [Theme System](#8-theme-system)
9. [Motion System](#9-motion-system)
10. [Galleries & Modals](#10-galleries--modals)
11. [Environment Variables](#11-environment-variables)
12. [Deployment](#12-deployment)
13. [PDF Résumé Viewer](#13-pdf-résumé-viewer)
14. [Contact Form](#14-contact-form)
15. [Code Structure & Best Practices](#15-code-structure--best-practices)
16. [Performance](#16-performance)
17. [SEO & Accessibility](#17-seo--accessibility)
18. [Testing](#18-testing)
19. [Contributing](#19-contributing)
20. [Known Issues & Limitations](#20-known-issues--limitations)
21. [License](#21-license)
22. [Author & Contact](#22-author--contact)
23. [Acknowledgments](#23-acknowledgments)
24. [FAQ](#24-faq)

---

## 1. Features

- **Single-page application** — React 18 + Vite, hash-based deep links (`#projects`, `#event-{slug}`, `#community-{slug}?chapter=RAS`, `#project-{slug}`) that open the right modal directly on load.
- **Fully responsive** — one codebase for mobile (320 px+), tablet, and desktop, with a dedicated mobile hamburger menu and 44 px minimum touch targets.
- **Dark / light theme** — toggle with no flash of wrong theme (FOUC-safe inline script in `index.html`).
- **Multi-language** — English, French, Arabic with complete RTL layout mirroring and BiDi-safe mixed text (`MixedText`).
- **PDF résumé viewer** — lazy-loaded pdf.js with zoom (0.5×–4×), Ctrl+wheel, keyboard shortcuts, and touch pinch-to-zoom.
- **Project, event & community galleries** — auto-advancing photo carousels, WebP-first images with crossfade, Ken Burns drift on community photos, keyboard-accessible stacked modals.
- **Interactive PET Recycling architecture diagram** — lazy-loaded SVG overview of the 4-repo system (hardware, backend, web, mobile) inside the project modal.
- **Community constellation** — canvas-drawn chapter network behind the community modal; nodes are clickable and hover-aware, pausing under reduced motion.
- **Contact form** — validated client- and server-side, honeypot anti-spam, delivered via EmailJS through a Netlify Function.
- **SEO** — per-language `<title>`/meta description, hreflang alternates, canonical URL, semantic HTML.
- **Accessibility** — focus traps in every modal (with correct behavior when modals stack), ARIA roles, keyboard navigation (Tab/Escape/Arrows), reduced-motion support everywhere.
- **Motion design** — staged hero entrance (SplitText + magnet buttons), floating glass-pill header with scrollspy and hide-on-scroll, pointer spotlight/tilt on cards, once-only scroll reveals, section parallax, and a site-wide scroll progress bar. Every layer bails under `prefers-reduced-motion` (see [src/motion/README.md](src/motion/README.md)).

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.3, Vite 5.4 |
| Styling | Vanilla CSS (custom properties, BEM, mobile-first media queries) |
| Motion | GSAP 3 + ScrollTrigger, Lenis smooth scroll, anime.js 4 (lazy), CSS transitions/keyframes — no Framer Motion |
| Icons | Lucide React, React Icons |
| i18n | Custom React Context provider + JSON dictionaries (en/fr/ar) |
| PDF | pdfjs-dist 5.x (Web Worker, DPR-aware canvas rendering) |
| Theme | React Context + `localStorage` (`data-theme` on `<html>`) |
| Backend | Netlify Functions (Deno-compatible), EmailJS REST API |
| Hosting | Netlify (CDN + serverless functions) |
| Image tooling | sharp (WebP conversion + gallery asset generation scripts) |
| Tooling | Node.js ≥ 18, npm ≥ 9, netlify-cli |

## 3. Project Structure

```
├── index.html                  # FOUC-prevention script, fonts, SEO tags, Arabic font preload
├── vite.config.js              # Build config + vendor chunk splitting (react-vendor / vendor / pdfjs)
├── netlify.toml                # Build command, functions dir, dev proxy
├── netlify/functions/
│   └── contact.mjs             # /api/contact — validation + honeypot + EmailJS relay
├── scripts/
│   ├── check-i18n.mjs          # Cross-validates en/fr/ar keys (runs on every build)
│   ├── convert-images.mjs      # Converts public/ photos to WebP siblings
│   └── gallery-assets.mjs      # Generates gallery/og image variants
├── docs/
│   ├── DEPLOYMENT.md           # Step-by-step Netlify deployment guide
│   ├── DESIGN.md               # Design system & motion trade-off notes
│   ├── ROADMAP.md              # Planned improvements
│   └── TESTING.md              # Full QA checklists
├── public/                     # Static assets (images, PDFs, logo)
└── src/
    ├── main.jsx                # Entry — mounts providers + App
    ├── App.jsx                 # Section composition
    ├── styles/                 # Design tokens + per-section styles (tokens.css, responsive.css, …)
    ├── components/
    │   ├── Header / Hero / About / Skills / Projects / Community / Events / Contact / Footer
    │   ├── PdfModal.jsx        # Lazy PDF résumé viewer
    │   ├── ProjectModal.jsx    # Project detail dialog (stacks over galleries)
    │   ├── PetArchDiagram.jsx  # Lazy SVG diagram of the PET recycling system
    │   ├── WebpImage.jsx       # <picture> with WebP + jpg fallback
    │   ├── CrossfadeImage.jsx  # Fade-in image transitions
    │   ├── MixedText.jsx       # BiDi-safe mixed Latin/Arabic text
    │   ├── AnimatedCountText.jsx / ModalWordReveal.jsx / ModalErrorBoundary.jsx
    │   ├── SectionBackground.jsx / HeroBackground.jsx / HeroBackgroundBlueprint.jsx
    │   ├── gallery/            # CinematicGallery (photo carousel) + ChapterConstellation (canvas)
    │   ├── effects/            # DotGrid canvas background
    │   └── reactbits/          # Magnet + SplitText micro-interactions
    ├── hooks/                  # useModalAccessibility, useFormValidation, useAutoCarousel,
    │                           # usePhotoCycle, useModalReveals, useScrollLock
    ├── constants/              # formValidation, theme, i18nConfig
    ├── data/                   # portfolio-data.js (projects/skills/communities) + pet-repos.js
    ├── motion/                 # MotionProvider, ScrollProgress, anime.js loader,
    │                           # cardSpotlight, scrollReveal, lenisStore (+ README)
    ├── i18n/                   # I18nProvider + en/fr/ar.json + glossary.md
    ├── theme/                  # ThemeProvider
    ├── lib/                    # sendContact (API client), photoSrc, webp helpers
    └── utils/                  # storage, debounce
```

**Component hierarchy:**

```
App
├── MotionProvider ── ScrollProgress
├── Header (nav, language switcher, theme toggle, mobile menu)
├── main
│   ├── Hero ────────── PdfModal (lazy)
│   ├── About
│   ├── Skills ──────── PdfModal (lazy, certificate)
│   ├── Projects ────── ProjectModal ── PetArchDiagram (lazy)
│   ├── Community ───── CommunityModal ── ChapterDetailModal + ChapterConstellation (canvas)
│   ├── Events ──────── EventModal
│   └── Contact
└── Footer
```

## 4. Installation & Setup

**Prerequisites:** Node.js ≥ 18, npm ≥ 9. Optional: Netlify CLI for local function testing.

```bash
# 1. Clone
git clone https://github.com/AnouerChouikhgithub/Portfolio.git
cd Portfolio

# 2. Install dependencies
npm install

# 3. Configure environment (see section 11)
cp .env.example .env
# …edit .env with your EmailJS credentials

# 4. Start the dev server (Vite only)
npm run dev            # → http://localhost:5173

# 4b. Or run with Netlify Functions locally
npx netlify dev        # → http://localhost:8888 (proxies /api/contact)

# 5. Production build (also validates i18n keys)
npm run build

# 6. Preview the production build locally
npm run preview
```

> The contact form only works when variables are set. Without them, `/api/contact` returns `500 Server misconfigured` — the UI shows the failure message gracefully.

## 5. NPM Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | i18n key validation + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run check:i18n` | Verify all 319 keys exist in en/fr/ar (fails the build on mismatch) |
| `npm run images:convert` | Convert `public/` photos to WebP siblings (sharp) |
| `npm run images:gallery` | Generate gallery/OG image variants |

## 6. Responsive Design

| Range | Target | Layout |
|---|---|---|
| ≤ 480 px | Phones | 1-column grids, hamburger nav, full-width buttons (min 44 px tall) |
| 481–767 px | Large phones / small tablets | Same as mobile with relaxed padding |
| 768–1023 px | Tablets | Auto-fit grids, 2-column where applicable |
| ≥ 1024 px | Desktop | Full nav bar, 3-column project grid, 5-column community grid |

**Breakpoints live in [src/styles/responsive.css](src/styles/responsive.css)** (768 px is the mobile/desktop boundary). JS code keys off `matchMedia` only for media *features* (reduced motion, pointer type, visibility) — never re-implements the layout breakpoints.

Testing tools: Chrome DevTools device toolbar, [Responsively App](https://responsively.app/), real iOS/Android devices.

## 7. Multi-Language & i18n

- **Supported:** `en` (default), `fr`, `ar` (RTL) — 319 translation keys per language.
- **Detection order:** URL `?lang=` → `localStorage` (`portfolio-language`) → `navigator.language` → `en`.
- **Persistence:** chosen language saved to `localStorage`.
- **RTL:** `<html dir="rtl">` + `lang="ar"` set automatically; Cairo font preloaded when the visitor is Arabic-first (inline script in `index.html` avoids post-hydration layout shift); [MixedText](src/components/MixedText.jsx) wraps Latin tokens in `<bdi dir="ltr">` so words like "Arduino" or "PID" don't scramble inside Arabic sentences. A [glossary](src/i18n/glossary.md) keeps technical terms consistent across translations.

**Add a new language:**

1. Create `src/i18n/<code>.json` — copy `en.json` and translate all keys (the build fails if keys don't match — `check-i18n` runs automatically).
2. Register it in `dictionaries` in [src/i18n/I18nProvider.jsx](src/i18n/I18nProvider.jsx).
3. If RTL, add its code to `RTL_LANGUAGES` in [src/constants/i18nConfig.js](src/constants/i18nConfig.js) and add a font rule in `src/styles/tokens.css` if needed.
4. Add an hreflang link in `index.html`.

Validate anytime with `npm run check:i18n`.

## 8. Theme System

- Toggle in the header; stored in `localStorage` under `portfolio-theme`.
- Applied via `data-theme` on `<html>`; colors come from CSS custom properties (`--bg`, `--surface`, `--text`, `--accent`, …).
- **No FOUC:** an inline script in `index.html` applies the saved theme before React boots.

**Customize colors:** edit the token blocks at the top of [src/styles/tokens.css](src/styles/tokens.css) — `:root` (dark defaults) and `html[data-theme="light"]`.

## 9. Motion System

All motion is owned by [src/motion/](src/motion/) — see its [README](src/motion/README.md) for the full contract. Key points:

- **MotionProvider** bootstraps GSAP + ScrollTrigger, Lenis smooth scroll, and the scroll progress bar in one place; components never touch them directly.
- **Layered ownership** — each effect (scroll reveals, card spotlight, hero entrance, carousel) has a single owner file; no two systems animate the same property.
- **Reduced motion is a first-class mode** — `prefers-reduced-motion` swaps every animation for static styling, including the canvas backgrounds (DotGrid, ChapterConstellation) which render a single paint instead of a rAF loop.
- **Performance rules** — rAF loops pause when tabs are hidden or overlays cover them; transforms/opacity only; `will-change` is scoped and short-lived.

| Effect | File |
|---|---|
| Hero staged entrance (SplitText + magnet CTA) | [Hero.jsx](src/components/Hero.jsx) + [SplitText.jsx](src/components/reactbits/SplitText.jsx) |
| Pointer spotlight / tilt on cards | [cardSpotlight.js](src/motion/cardSpotlight.js) |
| Once-only scroll reveals | [scrollReveal.js](src/motion/scrollReveal.js) |
| Scroll progress bar | [ScrollProgress.jsx](src/motion/ScrollProgress.jsx) |
| anime.js draw-on (lazy chunk) | [anime.js](src/motion/anime.js) |
| Smooth scrolling | [lenisStore.js](src/motion/lenisStore.js) |

## 10. Galleries & Modals

- **[CinematicGallery](src/components/gallery/CinematicGallery.jsx)** — auto-advancing photo carousel (`useAutoCarousel` + `usePhotoCycle`) with crossfading WebP images, dots, arrows, keyboard arrows, and pause-on-hover/focus.
- **Stacked modals** — modals mount through a portal and can stack (e.g. community modal → chapter detail). The shared [useModalAccessibility](src/hooks/useModalAccessibility.js) hook provides the focus trap, Escape handling, scroll lock, and focus restoration; a stacked modal disables the trap of the one underneath so `Escape`/`Tab` always act on the top layer. [ModalErrorBoundary](src/components/ModalErrorBoundary.jsx) contains any render crash inside a dialog.
- **[ChapterConstellation](src/components/gallery/ChapterConstellation.jsx)** — a canvas network of IEEE chapter nodes behind the community modal: hover highlights, click opens the chapter, drift pauses under reduced motion.
- **Ken Burns drift** — community card photos drift slowly (18 s) and pause while hovered/focused; disabled under reduced motion.
- **Deep links** — hash URLs open the corresponding modal directly (`#project-<slug>`, `#event-<slug>`, `#community-<slug>?chapter=RAS`).

## 11. Environment Variables

Copy `.env.example` → `.env` and fill in:

| Variable | Purpose |
|---|---|
| `EMAILJS_SERVICE_ID` | EmailJS service (e.g. Gmail SMTP connection) |
| `EMAILJS_TEMPLATE_ID` | Template that formats the outgoing email |
| `EMAILJS_PUBLIC_KEY` | EmailJS account public key |
| `EMAILJS_PRIVATE_KEY` | EmailJS access token — **server-only, never expose client-side** |

These are read **only** by the Netlify Function — nothing secret ships in the client bundle. On Netlify, set them under **Site settings → Environment variables** (see [DEPLOYMENT.md](docs/DEPLOYMENT.md)).

## 12. Deployment

The site deploys to Netlify:

- **Build command:** `npm run build` (validates translations, then `vite build`)
- **Publish directory:** `dist/`
- **Functions:** `netlify/functions/` — `contact.mjs` exposed at `/api/contact`

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step instructions (Git-based deploys, environment variables, custom domains).

## 13. PDF Résumé Viewer

- pdfjs-dist is **dynamically imported** only when a viewer opens — it never touches the initial bundle ([PdfModal.jsx](src/components/PdfModal.jsx)).
- Parsing runs in a **Web Worker**; pages render to DPR-aware canvases (sharp on retina).
- **Zoom:** 0.5×–4×. Controls: toolbar buttons, `+`/`-`/`0` keys, Ctrl/Cmd + mouse wheel, double-click toggle, pinch-to-zoom on touch.
- Re-renders are debounced (150 ms zoom, 200 ms resize) with instant CSS-scale feedback while rendering.
- **Keyboard:** `Escape` closes, `Tab` is trapped inside, focus returns to the trigger on close.

**Swap the résumé PDFs:** replace `public/Anouer_Chouikh_CV_EN.pdf` / `_FR.pdf` (keep the filenames, or update `resumePaths` in [Hero.jsx](src/components/Hero.jsx)).

## 14. Contact Form

```
Browser form ──POST /api/contact──▶ Netlify Function ──▶ EmailJS API ──▶ inbox
```

- **Validation (both sides):** name required (letters/spaces/apostrophes/hyphens), valid email, 8-digit phone optional, message required ≤ 5,000 chars. Rules shared via [src/constants/formValidation.js](src/constants/formValidation.js).
- **Anti-spam:** hidden `website` honeypot — bots that fill it get a fake success response.
- **Status codes:** `400` invalid input · `405` wrong method · `500` server misconfigured · `502` EmailJS failure.
- **Errors** surface under each field (`role="alert"`, `aria-invalid`) and via a status line; success resets the form.

**Not receiving email?** See the FAQ below.

## 15. Code Structure & Best Practices

- **Context + custom hooks** — `useTheme()`, `useI18n()`; provider values memoized so consumers re-render only on real changes.
- **Shared modal behavior** — focus trap, Escape handling, scroll lock, and focus restoration live in [useModalAccessibility](src/hooks/useModalAccessibility.js), reused by all modals, with correct stacking semantics.
- **Form logic** — [useFormValidation](src/hooks/useFormValidation.js) returns i18n-key errors; rules are constants shared with the server.
- **CSS** — BEM naming, single source of design tokens, consolidated media queries (no duplicate breakpoint blocks).
- **Data-driven UI** — projects/communities/events are plain data arrays in [src/data/](src/data/) mapped to components; add an entry + translations and the UI follows.
- **Error containment** — modals render inside [ModalErrorBoundary](src/components/ModalErrorBoundary.jsx) so a crash never takes down the page.

## 16. Performance

| Technique | Detail |
|---|---|
| Route-less code splitting | `PdfModal` + `PetArchDiagram` lazy-loaded via `React.lazy` — pdf.js (~445 kB raw) stays off the critical path |
| Vendor chunking | `react-vendor` + `vendor` chunks in [vite.config.js](vite.config.js) — deploys don't invalidate cached framework code |
| Tree-shaking | Only used Lucide/React-Icons symbols are imported (per-icon tree-shaking works out of the box) |
| Memoization | `ProjectCard` memoized; `useMemo` for filtered skill lists; `useCallback` for stable modal close handlers |
| Fonts | Inter/Space Grotesk with `preconnect` + `display=swap`; Cairo preloaded only when Arabic is active |
| Images | WebP-first via `<WebpImage>` (`<picture>` + automatic jpg fallback) — `npm run images:convert` turns `public/` photos into WebP siblings (37.8 MB → 10.2 MB, −73%); plus `loading="lazy"` + `decoding="async"` below the fold |
| Rendering | Debounced PDF re-render (150/200 ms), `matchMedia` instead of resize listeners, rAF loops pause when hidden/covered, `prefers-reduced-motion` respected |
| Build output | Initial JS **≈ 168.4 kB gzip** (index 65.3 + vendor 52.4 + react 50.6) ≤ 175 kB budget; CSS **18.4 kB gzip** ≤ 22 kB budget; anime.js (43.2 kB gz) stays an async chunk |

**Budgets & monitoring:** run Lighthouse (target ≥ 90 across the board) and check Core Web Vitals (LCP < 2.5 s, CLS < 0.1, INP < 200 ms). The biggest remaining lever is image weight — `public/` is ~77 MB, dominated by event photos (see roadmap in [docs/ROADMAP.md](docs/ROADMAP.md)).

**Measured before/after the motion & design upgrade** (Lighthouse 12, mobile simulated throttling, median of 3 runs against `vite preview`, same machine):

| Metric | Before (`93ec880`) | After | Notes |
|---|---|---|---|
| Performance | 76 | 73 | richer load-time motion (anime draw-on + SplitText entrance) costs ~176 ms TBT; deliberate trade-off documented in [docs/DESIGN.md](docs/DESIGN.md) |
| Accessibility | 98 | 98 | |
| Best Practices | 100 | 100 | |
| SEO | 92 | 92 | |
| FCP | 2.7 s | 3.3 s | +15 KB render-blocking CSS, throttled-run noise |
| LCP | 4.8 s | 4.5 s | hero portrait through `<picture>` |
| CLS | 0.000 | 0.000 | `display: contents` on `<picture>` is layout-neutral |
| TBT | 0 ms | 176 ms | hero entrance timeline + anime.js draw-on (async chunk) |
| Initial JS (gzip) | 161.1 kB | 168.4 kB | budget ≤ 175 kB |
| CSS (gzip) | 14.8 kB | 18.4 kB | budget ≤ 22 kB |
| Photo payload | 37.8 MB jpg | **10.2 MB webp** | −73%, `npm run images:convert` |

## 17. SEO & Accessibility

**SEO**
- Per-language `<title>` and meta description (updated by the i18n provider)
- `hreflang` alternates for en/fr/ar + `x-default`, canonical URL
- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`; one `<h1>`
- Descriptive alt text; hash URLs are shareable (`#project-neurofocus` opens the modal directly)

**Accessibility**
- All interactive elements are real `<button>`/`<a>` elements with visible focus outlines
- Skip-to-content link (`Tab` on load) with focus routed to `<main>`
- Modals: `role="dialog"`, `aria-modal`, focus trap, `Escape` to close, focus restored to trigger — with correct stacking when a second dialog opens on top
- Tabs implement the ARIA tabs pattern (Arrow/Home/End keys)
- Form errors announced via `role="alert"`; inputs flagged with `aria-invalid`
- `prefers-reduced-motion` disables animations globally (including canvas backgrounds)
- Touch targets ≥ 44 px on mobile controls

## 18. Testing

Full checklists: [docs/TESTING.md](docs/TESTING.md). Quick smoke test:

```bash
npm run dev
```

- [ ] Mobile 320/375/425 px — hamburger menu opens/closes, touch targets ≥ 44 px (header toggles, footer links, event rows)
- [ ] Skip link — `Tab` from load shows “Skip to content”; activating it focuses `<main>`
- [ ] Tablet 768 px, desktop 1024/1440/1920 px — grids reflow, no horizontal scroll
- [ ] Theme toggle — persists across reload, no FOUC
- [ ] Languages — EN/FR/AR; Arabic mirrors layout; `?lang=fr` / `?lang=ar` deep links
- [ ] PDF viewer — open from Hero and Skills; zoom via buttons/keys/wheel/pinch; Escape closes
- [ ] Modals — open a project/event/community modal, then a stacked detail modal; Tab stays in the top dialog; closing restores focus to the trigger
- [ ] Contact form — empty submit shows errors; honeypot silently accepts; valid submit delivers (needs env vars)
- [ ] `npm run build` — i18n check passes, no build errors

## 19. Contributing

1. Fork / branch from `main` — naming: `feat/…`, `fix/…`, `docs/…`.
2. Keep changes minimal and typed consistently with the existing style (ESM, function components, hooks).
3. Run `npm run build` before opening a PR — it validates translations and the production bundle.
4. Commits: short imperative subject (`Add X`, `Fix Y`), body explaining *why* when non-obvious.

## 20. Known Issues & Limitations

- **Image payload** — `public/` holds ~77 MB of event/community photos (WebP variants are generated for the main views, but full `srcset` responsiveness is still planned).
- **Contact form in dev** — requires `netlify dev` (or deployed env vars); plain `npm run dev` returns 500 from `/api/contact`.
- **pdfjs-dist worker** — the worker chunk is ~1.2 MB but loads only inside the PDF modal.
- **Safari < 15** — `color-mix()` in the mobile menu background falls back to a solid surface; cosmetic only.

**Roadmap:** responsive `srcset`/image CDN, PWA/service worker, per-language CV for Arabic, analytics. Details in [docs/ROADMAP.md](docs/ROADMAP.md).

## 21. License

MIT © Anouer Chouikh. See [LICENSE](LICENSE).

## 22. Author & Contact

**Anouer Chouikh** — Computer Engineering & IoT student (ISITCom)

- 🌐 Portfolio: [anouer-chouikh.netlify.app](https://anouer-chouikh.netlify.app)
- ✉️ Email: [anouer.chouikh2005@gmail.com](mailto:anouer.chouikh2005@gmail.com)
- 💼 LinkedIn: [anouer-chouikh-303306220](https://www.linkedin.com/in/anouer-chouikh-303306220)
- 🐙 GitHub: [AnouerChouikhgithub](https://github.com/AnouerChouikhgithub)
- 📸 Instagram: [anouerchouikhh](https://www.instagram.com/anouerchouikhh)

## 23. Acknowledgments

- [React](https://react.dev) & [Vite](https://vitejs.dev) teams
- [GSAP](https://gsap.com), [Lenis](https://lenis.darkroom.engineering) & [anime.js](https://animejs.com) for the motion layer
- [Mozilla pdf.js](https://mozilla.github.io/pdf.js/) for in-browser PDF rendering
- [Lucide](https://lucide.dev) & [React Icons](https://react-icons.github.io/react-icons) for iconography
- [EmailJS](https://www.emailjs.com/) + [Netlify](https://www.netlify.com) for serverless email & hosting
- The IEEE ESSTHS SB, AJST, and Tunisian Red Crescent communities featured in this portfolio

## 24. FAQ

**How do I replace the résumé PDF?**
Overwrite `public/Anouer_Chouikh_CV_EN.pdf` and/or `_FR.pdf` keeping the same names, or edit `resumePaths` in [Hero.jsx](src/components/Hero.jsx).

**How do I add a project?**
Append an entry to the data arrays in [src/data/portfolio-data.js](src/data/portfolio-data.js) (slug, title, tech, photos, accent color, logo path), then add matching `projects.items.<slug>` translations in all three language files. Link to it anywhere with `#project-<slug>`.

**How do I change colors/theme?**
Edit the CSS custom properties at the top of [src/styles/tokens.css](src/styles/tokens.css) (`:root` = dark, `html[data-theme="light"]` = light).

**How do I add a language?**
Section 7 above — new JSON file, register in the provider, keep keys aligned (build enforces it).

**Why isn't the contact form sending email?**
Check, in order: (1) `.env`/Netlify env vars are set and non-empty; (2) you're testing through `netlify dev` or the deployed site — plain `vite` has no function runtime; (3) EmailJS dashboard shows no errors / quota issues; (4) check the recipient's spam folder. The function logs provider errors to the Netlify function log — never to the browser.

**Where is the motion logic?**
Everything animation-related is centralized in [src/motion/](src/motion/) — see its README for the ownership rules before adding new effects.
