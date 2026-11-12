# Optimization Roadmap

Prioritized backlog. Time estimates assume one contributor.

## Immediate quick wins (done ✅)

- [x] Remove dead code (`ProjectsSection.jsx`, `DeviceDetector.jsx`, unused Tailwind dependency)
- [x] Consolidate breakpoints into `src/constants/breakpoints.js` + CSS media queries
- [x] Extract `useResponsive`, `useModalAccessibility`, `useFormValidation` hooks
- [x] Lazy-load `PdfModal` (React.lazy + Suspense)
- [x] Vendor chunk splitting (`react-vendor` / `vendor`) in vite.config.js
- [x] Memoize `ProjectCard`; `useMemo` for skill filtering; memoized provider values
- [x] Mobile hamburger menu with proper focus/aria wiring
- [x] Fix CSS regressions (h1 clamp bug, duplicate `.container`, conflicting breakpoints)
- [x] Touch targets ≥ 44 px (menu, buttons, PDF toolbar, form controls)
- [x] Load Inter via preconnect; keep Cairo Arabic-only on demand
- [x] Harden `/api/contact` (name length cap, try/catch, no stack traces to client)
- [x] Wire `check-i18n` into the build (`npm run build` fails on key mismatches)
- [x] A11y: `aria-invalid` + `role="alert"` on form errors, hidden honeypot class

## Next up (medium term)

1. **Image pipeline (highest impact).** `public/` is ~56 MB, mostly event photos.
   Convert to WebP (~30–70% smaller), generate responsive variants, add `srcset`/`sizes`
   to gallery images, and lazy-load everything below the fold. Consider Squoosh CLI or
   a Netlify image-delivery integration. *Est: 3–5 h*
2. **Memoize remaining card grids** (`CommunityCard`, `EventCard`) the same way as `ProjectCard`. *Est: 1 h*
3. **Split Projects.jsx data** — move the `projects` array to `src/data/projects.js`
   (and events/communities likewise) so components stay lean. *Est: 1–2 h*
4. **Contact-form feedback states** — per-field server error mapping (e.g. 502 → "try again later" hint). *Est: 1–2 h*
5. **Arabic résumé PDF** (`resumePaths.ar` currently falls back to EN). *Est: content task*

## Long-term bets

- **PWA / service worker** — offline shell + cache-first for static assets (vite-plugin-pwa). *Est: 4–6 h*
- **Image CDN** — Netlify Image API or Cloudinary for on-the-fly variants. *Est: 2–4 h*
- **Privacy-friendly analytics** — Plausible/Fathom snippet, no cookie banner needed. *Est: 1 h*
- **Unit tests** — Vitest + React Testing Library for hooks (`useFormValidation`, `useModalAccessibility`) and the contact function. *Est: 4–8 h*
- **E2E smoke test** — Playwright script covering theme/language toggles + modal open/close. *Est: 3–4 h*

## Explicitly not recommended (for this project)

- **Tailwind migration** — the vanilla-CSS token system + BEM is consistent and healthy; a rewrite would add churn without user-visible benefit. Revisit only if the codebase grows 3–4×.
- **CSS-in-JS** — runtime cost with no payoff at this scale; static CSS is fully minified by Vite.
