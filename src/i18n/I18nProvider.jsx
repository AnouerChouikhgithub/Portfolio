import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';
import { readStorage, writeStorage } from '../utils/storage';
import { LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE, RTL_LANGUAGES } from '../constants/i18nConfig';
import {
  SITE_ORIGIN,
  SUPPORTED_LANGUAGES,
  LANGUAGE_PATHS,
  OPEN_GRAPH_LOCALES,
  PAGE_META,
  buildLanguageUrl,
  isSupportedLanguage,
  languageFromPathname,
  languageFromSearch,
  resolveRouteLanguage,
} from './languageRoutes';

const dictionaries = { en, fr, ar };

/**
 * Language for the current browser location, plus the canonical URL to
 * replace it with when the current URL is not canonical (legacy ?lang=,
 * or the root URL for a non-English visitor). Browser-only.
 */
export function resolveBrowserLanguage() {
  const { pathname, search, hash } = window.location;
  let browserLanguage = null;
  try {
    browserLanguage = window.navigator.language?.slice(0, 2) ?? null;
  } catch {
    // navigator access can be denied; fall back to English
  }
  return resolveRouteLanguage({
    pathname,
    search,
    hash,
    storedLanguage: readStorage(LANGUAGE_STORAGE_KEY),
    browserLanguage,
  });
}

const getValue = (dictionary, key) => key.split('.').reduce((value, part) => value?.[part], dictionary);

/** Keeps the document's language, direction, title and metadata in step with the language. */
function applyDocumentLanguage(language, isRtl) {
  const meta = PAGE_META[language];
  const canonical = SITE_ORIGIN + LANGUAGE_PATHS[language];

  document.documentElement.lang = language;
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', OPEN_GRAPH_LOCALES[language]);

  const alternateLocales = SUPPORTED_LANGUAGES
    .filter((code) => code !== language)
    .map((code) => OPEN_GRAPH_LOCALES[code]);
  document.querySelectorAll('meta[property="og:locale:alternate"]').forEach((element, index) => {
    element.setAttribute('content', alternateLocales[index] ?? '');
  });

  // Dynamic Arabic font stylesheet loading (the prerendered Arabic page already
  // includes a static link with this id, so this only runs for client-side switches).
  if (isRtl && !document.getElementById('arabic-font')) {
    const link = document.createElement('link');
    link.id = 'arabic-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap';
    document.head.appendChild(link);
  }
}

const I18nContext = createContext(null);

export function I18nProvider({ children, initialLanguage }) {
  // The server render passes its language explicitly. In the browser the
  // language comes from the URL, so the markup can hydrate.
  const [language, setLanguageState] = useState(
    () => initialLanguage ?? resolveBrowserLanguage().language,
  );
  const dictionary = dictionaries[language] || dictionaries.en;
  const isRtl = RTL_LANGUAGES.has(language);

  // A language switch is a real URL change (no page reload). The URL and the
  // displayed language stay in step, and the back/forward buttons work.
  const setLanguage = useCallback((nextLanguage) => {
    if (!isSupportedLanguage(nextLanguage)) return;
    const { search, hash } = window.location;
    const target = buildLanguageUrl(nextLanguage, { search, hash });
    const current = window.location.pathname + search + hash;
    if (target !== current) {
      window.history.pushState({ language: nextLanguage }, '', target);
    }
    setLanguageState(nextLanguage);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const { pathname, search } = window.location;
      setLanguageState(
        languageFromPathname(pathname) ?? languageFromSearch(search) ?? DEFAULT_LANGUAGE,
      );
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    applyDocumentLanguage(language, isRtl);
    window.dispatchEvent(new Event('localechange'));
    writeStorage(LANGUAGE_STORAGE_KEY, language);
  }, [language, isRtl]);

  const value = useMemo(() => ({
    language,
    languages: SUPPORTED_LANGUAGES,
    isRtl,
    setLanguage,
    t: (key, fallback = key) => getValue(dictionary, key) ?? getValue(en, key) ?? fallback,
  }), [dictionary, language, isRtl, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}
