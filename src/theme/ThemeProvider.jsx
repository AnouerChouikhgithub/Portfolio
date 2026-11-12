import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';
import { STORAGE_KEYS, THEMES, DEFAULT_THEME } from '../constants/theme';

const ThemeContext = createContext(null);

const getInitialTheme = () => {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  return document.documentElement.dataset.theme === THEMES.light ? THEMES.light : DEFAULT_THEME;
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme((current) => (current === THEMES.dark ? THEMES.light : THEMES.dark)),
  }), [theme]);

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
