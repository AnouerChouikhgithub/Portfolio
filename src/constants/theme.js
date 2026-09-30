/**
 * All localStorage keys in one place. Never scatter string literals —
 * the inline FOUC script in index.html reads PORTFOLIO_THEME, keep in sync.
 */
export const STORAGE_KEYS = {
  theme: 'portfolio-theme',
  language: 'portfolio-language',
}

/** Theme values (dark is the default; index.html FOUC script matches). */
export const THEMES = {
  dark: 'dark',
  light: 'light',
}

export const DEFAULT_THEME = THEMES.dark
