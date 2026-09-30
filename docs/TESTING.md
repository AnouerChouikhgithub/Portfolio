# Testing Checklist

Print-friendly checklist. Run through it before every significant release.

## Setup

- [ ] `npm run build` — passes, i18n check green
- [ ] `npx netlify dev` running for contact-form tests (needs `.env`)

## 1. Responsive layout

| Viewport | Widths | What to verify |
|---|---|---|
| Mobile | 320, 375, 425 px | Hamburger opens/closes; menu panel opaque; buttons ≥ 44 px tall; no horizontal scroll; grids 1-column |
| Tablet | 768, 820 px | No hamburger; auto-fit grids; modals stay within viewport |
| Desktop | 1024, 1440, 1920 px | Full nav bar; project grid multi-column; community grid 5-wide on wide screens |

Per-section (repeat at mobile + desktop):

- [ ] Header: logo, language switcher, theme toggle, menu all reachable and legible
- [ ] Hero: text scales, buttons stack full-width on mobile
- [ ] About: image + text layout holds
- [ ] Skills: tabs scroll/wrap, tags don't overflow
- [ ] Projects: cards fit, modal readable, gallery nav buttons tappable
- [ ] Community: card grid reflows; chapter modal fits
- [ ] Events: organized cards + participated list wrap correctly
- [ ] Contact: inputs full-width, error messages visible
- [ ] Footer: links wrap, social icons spaced

## 2. Browsers

- [ ] Chrome / Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari macOS + iOS (latest)
- [ ] Android Chrome

## 3. PDF viewer

- [ ] Opens from Hero (résumé) and Skills (certificate)
- [ ] Zoom: toolbar +/−, reset pill, `+`/`-`/`0` keys, Ctrl+wheel, double-click, pinch on touch
- [ ] Sharp rendering at 100% and zoomed on a high-DPR screen
- [ ] Scroll/pan while zoomed stays centered
- [ ] `Escape` closes; focus returns to the button that opened it
- [ ] Download button works (résumé modal)

## 4. Theme

- [ ] Toggle dark ↔ light in header
- [ ] Persists across reload
- [ ] No flash of wrong theme on hard refresh
- [ ] Light theme contrast on cards, modals, PDF toolbar

## 5. Languages

- [ ] EN / FR render LTR correctly everywhere
- [ ] AR mirrors layout (nav, grids, modals, arrows flip)
- [ ] Cairo font loads for Arabic (check Network tab)
- [ ] Latin tokens (Arduino, PID, React…) read correctly inside Arabic text
- [ ] Language persists across reload
- [ ] Deep links: `/?lang=fr`, `/?lang=ar`

## 6. Forms

- [ ] Empty submit → all required-field errors visible
- [ ] Invalid email / 8-char-name / 9-digit phone → specific errors
- [ ] Valid submit through `netlify dev` → success message, form resets
- [ ] Honeypot: filling `website` field returns fake success, no email sent
- [ ] Error + success messages announced to screen readers (`role="alert"`/`role="status"`)

## 7. Performance

- [ ] Lighthouse (mobile emulation) ≥ 90 across categories
- [ ] `dist/assets` — app JS ≈ 124 KB (40 KB gzip); PdfModal chunk absent from initial load
- [ ] PDF chunk fetched only when a viewer opens
- [ ] No layout shift when theme/language apply (CLS ≈ 0)
- [ ] Interactions remain smooth while event galleries auto-advance

## 8. Accessibility

- [ ] Keyboard-only pass: tab through every section, open/close all modals
- [ ] Focus visible on every interactive element
- [ ] Focus trapped inside open modals; restored on close
- [ ] Screen reader (NVDA/VoiceOver): headings logical, images labeled, errors announced
- [ ] `prefers-reduced-motion` disables animations
- [ ] Color contrast spot-check in both themes (WCAG AA)
