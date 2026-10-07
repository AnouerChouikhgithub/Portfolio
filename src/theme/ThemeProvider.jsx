import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';
import { STORAGE_KEYS, THEMES, DEFAULT_THEME } from '../constants/theme';

const ThemeContext = createContext(null);

const getInitialTheme = () => {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  return document.documentElement.dataset.theme === THEMES.light ? THEMES.light : DEFAULT_THEME;
};

const prefersReducedMotion = () => (
  typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

/**
 * Theme switching.
 *
 * When the View Transitions API is available and motion is allowed, the new
 * paint is revealed with a circular clip-path expanding from the toggle button.
 * Otherwise we fall back to the 300ms colour transition already declared on
 * body / cards. Never `transition: all`.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const originRef = useRef({ x: '90%', y: '40px' });

  // Keep the DOM attribute in sync even if the theme came from the initial state.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const commit = useCallback((next) => {
    document.documentElement.dataset.theme = next;
    writeStorage(STORAGE_KEYS.theme, next);
    setTheme(next);
  }, []);

  const toggleTheme = useCallback((event) => {
    const next = theme === THEMES.dark ? THEMES.light : THEMES.dark;

    const button = event?.currentTarget;
    if (button?.getBoundingClientRect) {
      const rect = button.getBoundingClientRect();
      originRef.current = {
        x: `${Math.round(rect.left + rect.width / 2)}px`,
        y: `${Math.round(rect.top + rect.height / 2)}px`,
      };
    }

    const root = document.documentElement;
    root.style.setProperty('--theme-reveal-x', originRef.current.x);
    root.style.setProperty('--theme-reveal-y', originRef.current.y);

    const canMorph = typeof document.startViewTransition === 'function'
      && !prefersReducedMotion();

    if (!canMorph) {
      commit(next);
      return;
    }

    // The attribute flip must happen *inside* the transition callback so the
    // captured "old" frame is the previous palette.
    document.startViewTransition(() => {
      commit(next);
    });
  }, [commit, theme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
