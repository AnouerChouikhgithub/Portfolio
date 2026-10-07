# Design system

## Tokens

All colour, spacing, radius, elevation, z-index and motion values live in
`src/styles.css` under `:root` (dark — the default theme) and
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

## Motion ownership

See `src/motion/README.md` — GSAP owns scroll-linked work, Motion owns
React presence/layout, anime.js owns SVG and micro-motion. One library per
property per element.
