# Anouer Chouikh — Engineering & Innovation Portfolio

![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite&logoColor=white)
![Languages](https://img.shields.io/badge/languages-3-blue)
![Responsive](https://img.shields.io/badge/responsive-mobile%20%7C%20tablet%20%7C%20desktop-10b981)
![License](https://img.shields.io/badge/license-MIT-green)

🔗 **Live site:** [anouer-chouikh.netlify.app](https://anouer-chouikh.netlify.app)

A single-page portfolio for **Anouer Chouikh** — Computer Engineering & IoT student — showcasing robotics projects, community leadership, and a multilingual, fully responsive experience with a built-in PDF résumé viewer.

**Highlights:** dark/light theme · EN/FR/AR with full RTL · lazy-loaded PDF viewer with pinch-to-zoom · contact form with server-side validation & anti-spam · Lighthouse-friendly performance budget.

---

## Table of Contents

1. [Features](#1-features)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Installation & Setup](#4-installation--setup)
5. [Responsive Design](#5-responsive-design)
6. [Multi-Language & i18n](#6-multi-language--i18n)
7. [Theme System](#7-theme-system)
8. [Environment Variables](#8-environment-variables)
9. [Deployment](#9-deployment)
10. [PDF Résumé Viewer](#10-pdf-résumé-viewer)
11. [Contact Form](#11-contact-form)
12. [Code Structure & Best Practices](#12-code-structure--best-practices)
13. [Performance](#13-performance)
14. [SEO & Accessibility](#14-seo--accessibility)
15. [Testing](#15-testing)
16. [Contributing](#16-contributing)
17. [Known Issues & Limitations](#17-known-issues--limitations)
18. [License](#18-license)
19. [Author & Contact](#19-author--contact)
20. [Acknowledgments](#20-acknowledgments)
21. [FAQ](#21-faq)

---

## 1. Features

- **Single-page application** — React 18 + Vite, hash-based navigation (`#projects`, `#event-{slug}`, `#community-{slug}?chapter=RAS`).
- **Fully responsive** — one codebase for mobile (320 px+), tablet, and desktop, with a dedicated mobile hamburger menu.
- **Dark / light theme** — toggle with no flash of wrong theme (FOUC-safe inline script).
- **Multi-language** — English, French, Arabic with complete RTL layout mirroring and BiDi-safe mixed text.
- **PDF résumé viewer** — lazy-loaded pdf.js with zoom (0.5×–4×), Ctrl+wheel, keyboard shortcuts, and touch pinch-to-zoom.
- **Project & event galleries** — auto-advancing photo carousels with keyboard-accessible modals.
- **Contact form** — validated client- and server-side, honeypot anti-spam, delivered via EmailJS through a Netlify Function.
- **SEO** — per-language `<title>`/meta description, hreflang alternates, canonical URL, semantic HTML.
- **Accessibility** — focus traps in modals, ARIA roles, keyboard navigation (Tab/Escape/Arrows), reduced-motion support.
- **Motion design** — staged hero entrance (SplitText + magnet buttons), floating glass-pill header with scrollspy and hide-on-scroll, pointer spotlight/tilt on cards, once-only scroll reveals and section parallax. Every layer bails under `prefers-reduced-motion` (see [src/motion/README.md](src/motion/README.md)).

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.3, Vite 5.4 |
| Styling | Vanilla CSS (custom properties, BEM, mobile-first media queries) |
| Motion | GSAP 3 + ScrollTrigger, Lenis smooth scroll, anime.js (lazy), CSS transitions/keyframes — no Framer Motion |
| Icons | Lucide React, React Icons |
| i18n | Custom React Context provider + JSON dictionaries |
| PDF | pdfjs-dist 5.x (Web Worker, canvas rendering) |
| Theme | React Context + `localStorage` |
| Backend | Netlify Functions (Deno-compatible), EmailJS API |
| Hosting | Netlify (CDN + serverless) |
| Tooling | Node.js ≥ 18, npm, netlify-cli |

## 3. Project Structure

```
├── index.html                  # FOUC-prevention script, fonts, SEO tags
├── vite.config.js              # Build config + vendor chunk splitting
├── netlify.toml                # Build command, functions dir, dev proxy
├── netlify/functions/
│   └── contact.mjs             # /api/contact — validation + EmailJS relay
├── scripts/
│   └── check-i18n.mjs          # Cross-validates en/fr/ar keys (runs on build)
├── public/                     # Static assets (images, PDFs, logos)
└── src/
    ├── main.jsx                # Entry — mounts providers + App
    ├── App.jsx                 # Section composition
    ├── styles/                 # Design tokens + component styles, split by section
    ├── components/             # Header, Hero, About, Skills, Projects,
    │                           # Community, Events, Contact, Footer,
    │                           # PdfModal, MixedText
    ├── hooks/                  # useResponsive, useModalAccessibility,
    │                           # useFormValidation
    ├── constants/              # breakpoints, formValidation, theme, i18nConfig
    ├── utils/                  # debounce, storage helpers
    ├── i18n/                   # I18nProvider + en/fr/ar.json
    ├── theme/                  # ThemeProvider
    └── lib/                    # sendContact (API client)
```

**Component hierarchy:**

```
App
├── Header (nav, language switcher, theme toggle, mobile menu)
├── main
│   ├── Hero ────────── PdfModal (lazy)
│   ├── About
│   ├── Skills ──────── PdfModal (lazy, certificate)
│   ├── Projects ────── ProjectModal
│   ├── Community ───── CommunityModal ── ChapterDetailModal
│   ├── Events ──────── EventModal
│   └── Contact
└── Footer
```

## 4. Installation & Setup

**Prerequisites:** Node.js ≥ 18, npm ≥ 9. Optional: Netlify CLI for function testing.

```bash
# 1. Clone
git clone https://github.com/AnouerChouikhgithub/Portfolio.git
cd Portfolio

# 2. Install dependencies
npm install

# 3. Configure environment (see section 8)
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

## 5. Responsive Design

| Range | Target | Layout |
|---|---|---|
| ≤ 480 px | Phones | 1-column grids, hamburger nav, full-width buttons (min 44 px tall) |
| 481–767 px | Large phones / small tablets | Same as mobile with relaxed padding |
| 768–1023 px | Tablets | Auto-fit grids, 2-column where applicable |
| ≥ 1024 px | Desktop | Full nav bar, 3-column project grid, 5-column community grid |

**Breakpoints live in two synced places** — keep them consistent when changing:

- CSS: media queries in [src/styles/responsive.css](src/styles/responsive.css) (768 px is the mobile/desktop boundary)
- JS: [src/constants/breakpoints.js](src/constants/breakpoints.js) consumed by the `useResponsive()` hook via `matchMedia`

Testing tools: Chrome DevTools device toolbar, [Responsively App](https://responsively.app/), real iOS/Android devices.

## 6. Multi-Language & i18n

- **Supported:** `en` (default), `fr`, `ar` (RTL).
- **Detection order:** URL `?lang=` → `localStorage` (`portfolio-language`) → `navigator.language` → `en`.
- **Persistence:** chosen language saved to `localStorage`.
- **RTL:** `<html dir="rtl">` + `lang="ar"` set automatically; Cairo font loaded on demand; [MixedText](src/components/MixedText.jsx) wraps Latin tokens in `<bdi dir="ltr">` so words like "Arduino" or "PID" don't scramble inside Arabic sentences.

**Add a new language:**

1. Create `src/i18n/<code>.json` — copy `en.json` and translate all keys (the build fails if keys don't match — `check-i18n` runs automatically).
2. Register it in `dictionaries` in [src/i18n/I18nProvider.jsx](src/i18n/I18nProvider.jsx).
3. If RTL, add its code to `RTL_LANGUAGES` in [src/constants/i18nConfig.js](src/constants/i18nConfig.js) and add a font rule in `src/styles/tokens.css` if needed.
4. Add an hreflang link in `index.html`.

Validate anytime with `npm run check:i18n`.

## 7. Theme System

- Toggle in the header; stored in `localStorage` under `portfolio-theme`.
- Applied via `data-theme` on `<html>`; colors come from CSS custom properties (`--bg`, `--surface`, `--text`, `--accent`, …).
- **No FOUC:** an inline script in `index.html` applies the saved theme before React boots.

**Customize colors:** edit the token blocks at the top of [src/styles/tokens.css](src/styles/tokens.css) — `:root` (dark defaults) and `html[data-theme="light"]`.

## 8. Environment Variables

Copy `.env.example` → `.env` and fill in:

| Variable | Purpose |
|---|---|
| `EMAILJS_SERVICE_ID` | EmailJS service (e.g. Gmail SMTP connection) |
| `EMAILJS_TEMPLATE_ID` | Template that formats the outgoing email |
| `EMAILJS_PUBLIC_KEY` | EmailJS account public key |
| `EMAILJS_PRIVATE_KEY` | EmailJS access token — **server-only, never expose client-side** |

These are read **only** by the Netlify Function — nothing secret ships in the client bundle. On Netlify, set them under **Site settings → Environment variables** (see [DEPLOYMENT.md](docs/DEPLOYMENT.md)).

## 9. Deployment

The site deploys to Netlify:

- **Build command:** `npm run build` (validates translations, then `vite build`)
- **Publish directory:** `dist/`
- **Functions:** `netlify/functions/` — `contact.mjs` exposed at `/api/contact`

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step instructions (Git-based deploys, environment variables, custom domains).

## 10. PDF Résumé Viewer

- pdfjs-dist is **dynamically imported** only when a viewer opens — it never touches the initial bundle ([PdfModal.jsx](src/components/PdfModal.jsx)).
- Parsing runs in a **Web Worker**; pages render to DPR-aware canvases (sharp on retina).
- **Zoom:** 0.5×–4×. Controls: toolbar buttons, `+`/`-`/`0` keys, Ctrl/Cmd + mouse wheel, double-click toggle, pinch-to-zoom on touch.
- Re-renders are debounced (150 ms zoom, 200 ms resize) with instant CSS-scale feedback while rendering.
- **Keyboard:** `Escape` closes, `Tab` is trapped inside, focus returns to the trigger on close.

**Swap the résumé PDFs:** replace `public/Anouer_Chouikh_CV_EN.pdf` / `_FR.pdf` (keep the filenames, or update `resumePaths` in [Hero.jsx](src/components/Hero.jsx)).

## 11. Contact Form

```
Browser form ──POST /api/contact──▶ Netlify Function ──▶ EmailJS API ──▶ inbox
```

- **Validation (both sides):** name required (letters/spaces/apostrophes/hyphens), valid email, 8-digit phone optional, message required ≤ 5,000 chars. Rules shared via [src/constants/formValidation.js](src/constants/formValidation.js).
- **Anti-spam:** hidden `website` honeypot — bots that fill it get a fake success response.
- **Status codes:** `400` invalid input · `405` wrong method · `500` server misconfigured · `502` EmailJS failure.
- **Errors** surface under each field (`role="alert"`, `aria-invalid`) and via a status line; success resets the form.

**Not receiving email?** See the FAQ below.

## 12. Code Structure & Best Practices

- **Context + custom hooks** — `useTheme()`, `useI18n()`; provider values memoized so consumers re-render only on real changes.
- **Shared modal behavior** — focus trap, Escape handling, scroll lock, and focus restoration live in [useModalAccessibility](src/hooks/useModalAccessibility.js), reused by all four modals.
- **Form logic** — [useFormValidation](src/hooks/useFormValidation.js) returns i18n-key errors; rules are constants shared with the server.
- **Responsive JS** — [useResponsive](src/hooks/useResponsive.js) uses `matchMedia` listeners (no resize-thrash); pure CSS handles layout wherever possible.
- **CSS** — BEM naming, single source of design tokens, consolidated media queries (no duplicate breakpoint blocks).
- **Data-driven UI** — projects/communities/events are plain data arrays mapped to components; add an entry + translations and the UI follows.

## 13. Performance

| Technique | Detail |
|---|---|
| Route-less code splitting | `PdfModal` lazy-loaded via `React.lazy` — pdf.js (~450 KB) is off the critical path |
| Vendor chunking | `react-vendor` + `vendor` chunks in [vite.config.js](vite.config.js) — deploys don't invalidate cached framework code |
| Tree-shaking | Only used Lucide/React-Icons symbols are imported (per-icon tree-shaking works out of the box) |
| Memoization | `ProjectCard` memoized; `useMemo` for filtered skill lists; `useCallback` for stable modal close handlers |
| Fonts | Inter loaded with `preconnect` + `display=swap`; Cairo fetched only when Arabic is active |
| Images | WebP-first via `<WebpImage>` (`<picture>` + automatic jpg fallback) — `npm run images:convert` turns `public/` photos into WebP siblings (37.8 MB → 10.2 MB, −73%); plus `loading="lazy"` + `decoding="async"` below the fold |
| Rendering | Debounced PDF re-render (150/200 ms), `matchMedia` instead of resize listeners, `prefers-reduced-motion` respected |
| Build output | Initial JS **165.1 kB gzip** (index 62.7 + vendor 52.4 + react 50.0) ≤ 175 kB budget; CSS **17.1 kB gzip** ≤ 22 kB budget; anime.js (43.2 kB gz) stays an async chunk |

**Budgets & monitoring:** run Lighthouse (target ≥ 90 across the board) and check Core Web Vitals (LCP < 2.5 s, CLS < 0.1, INP < 200 ms). The biggest remaining lever is image weight — `public/` is ~56 MB, dominated by event photos (see roadmap in [docs/ROADMAP.md](docs/ROADMAP.md)).

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
| Initial JS (gzip) | 161.1 kB | 165.1 kB | budget ≤ 175 kB |
| CSS (gzip) | 14.8 kB | 17.1 kB | budget ≤ 22 kB |
| Photo payload | 37.8 MB jpg | **10.2 MB webp** | −73%, `npm run images:convert` |

## 14. SEO & Accessibility

**SEO**
- Per-language `<title>` and meta description (updated by the i18n provider)
- `hreflang` alternates for en/fr/ar + `x-default`, canonical URL
- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`; one `<h1>`
- Descriptive alt text; hash URLs are shareable (`#project-neurofocus` opens the modal directly)

**Accessibility**
- All interactive elements are real `<button>`/`<a>` elements with visible focus outlines
- Modals: `role="dialog"`, `aria-modal`, focus trap, `Escape` to close, focus restored to trigger
- Tabs implement the ARIA tabs pattern (Arrow/Home/End keys)
- Form errors announced via `role="alert"`; inputs flagged with `aria-invalid`
- `prefers-reduced-motion` disables animations globally
- Touch targets ≥ 44 px on mobile controls

## 15. Testing

Full checklists: [docs/TESTING.md](docs/TESTING.md). Quick smoke test:

```bash
npm run dev
```

- [ ] Mobile 320/375/425 px — hamburger menu opens/closes, buttons ≥ 44 px
- [ ] Tablet 768 px, desktop 1024/1440/1920 px — grids reflow, no horizontal scroll
- [ ] Theme toggle — persists across reload, no FOUC
- [ ] Languages — EN/FR/AR; Arabic mirrors layout; `?lang=fr` / `?lang=ar` deep links
- [ ] PDF viewer — open from Hero and Skills; zoom via buttons/keys/wheel/pinch; Escape closes
- [ ] Contact form — empty submit shows errors; honeypot silently accepts; valid submit delivers (needs env vars)
- [ ] `npm run build` — i18n check passes, no build errors

## 16. Contributing

1. Fork / branch from `main` — naming: `feat/…`, `fix/…`, `docs/…`.
2. Keep changes minimal and typed consistently with the existing style (ESM, function components, hooks).
3. Run `npm run build` before opening a PR — it validates translations and the production bundle.
4. Commits: short imperative subject (`Add X`, `Fix Y`), body explaining *why* when non-obvious.

## 17. Known Issues & Limitations

- **Image payload** — `public/` holds ~56 MB of event/community photos served as-is; responsive `srcset`/WebP conversion is planned.
- **Contact form in dev** — requires `netlify dev` (or deployed env vars); plain `npm run dev` returns 500 from `/api/contact`.
- **pdfjs-dist worker** — the worker chunk is ~1.2 MB but loads only inside the PDF modal.
- **Safari < 15** — `color-mix()` in the mobile menu background falls back to a solid surface; cosmetic only.

**Roadmap:** WebP/srcset image pipeline, image CDN, PWA/service worker, per-language CV for Arabic, analytics. Details in [docs/ROADMAP.md](docs/ROADMAP.md).

## 18. License

MIT © Anouer Chouikh. See [LICENSE](LICENSE).

## 19. Author & Contact

**Anouer Chouikh** — Computer Engineering & IoT student (ISITCom)

- 🌐 Portfolio: [anouer-chouikh.netlify.app](https://anouer-chouikh.netlify.app)
- ✉️ Email: [anouer.chouikh2005@gmail.com](mailto:anouer.chouikh2005@gmail.com)
- 💼 LinkedIn: [anouer-chouikh-303306220](https://www.linkedin.com/in/anouer-chouikh-303306220)
- 🐙 GitHub: [AnouerChouikhgithub](https://github.com/AnouerChouikhgithub)
- 📸 Instagram: [anouerchouikhh](https://www.instagram.com/anouerchouikhh)

## 20. Acknowledgments

- [React](https://react.dev) & [Vite](https://vitejs.dev) teams
- [Mozilla pdf.js](https://mozilla.github.io/pdf.js/) for in-browser PDF rendering
- [Lucide](https://lucide.dev) & [React Icons](https://react-icons.github.io/react-icons) for iconography
- [EmailJS](https://www.emailjs.com/) + [Netlify](https://www.netlify.com) for serverless email & hosting
- The IEEE ESSTHS SB, AJST, and Tunisian Red Crescent communities featured in this portfolio

## 21. FAQ

**How do I replace the résumé PDF?**
Overwrite `public/Anouer_Chouikh_CV_EN.pdf` and/or `_FR.pdf` keeping the same names, or edit `resumePaths` in [Hero.jsx](src/components/Hero.jsx).

**How do I add a project?**
Append an entry to `projects` in [Projects.jsx](src/components/Projects.jsx) (slug, title, tech, photos, accent color, logo path), then add matching `projects.items.<slug>` translations in all three language files. Link to it anywhere with `#project-<slug>`.

**How do I change colors/theme?**
Edit the CSS custom properties at the top of [src/styles/tokens.css](src/styles/tokens.css) (`:root` = dark, `html[data-theme="light"]` = light).

**How do I add a language?**
Section 6 above — new JSON file, register in the provider, keep keys aligned (build enforces it).

**Why isn't the contact form sending email?**
Check, in order: (1) `.env`/Netlify env vars are set and non-empty; (2) you're testing through `netlify dev` or the deployed site — plain `vite` has no function runtime; (3) EmailJS dashboard shows no errors / quota issues; (4) check the recipient's spam folder. The function logs provider errors to the Netlify function log — never to the browser.
