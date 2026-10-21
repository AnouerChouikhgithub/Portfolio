// Language URL structure and route resolution.
//
// Pure functions and constants only: this module is bundled for the browser
// and imported by the build-time prerender, so it must not touch `window` or
// `document` at import time.
//
// URL structure:
//   /en/  English   (also served at "/", whose canonical is /en/)
//   /fr/  French
//   /ar/  Arabic (RTL)
// Legacy ?lang=xx links are redirected to the matching language path, keeping
// every other query parameter and the hash.

import { DEFAULT_LANGUAGE } from '../constants/i18nConfig';

export const SITE_ORIGIN = 'https://anouer-chouikh.netlify.app';

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'ar'];

export const LANGUAGE_PATHS = {
  en: '/en/',
  fr: '/fr/',
  ar: '/ar/',
};

export const OPEN_GRAPH_LOCALES = {
  en: 'en_US',
  fr: 'fr_FR',
  ar: 'ar_AR',
};

export const PAGE_META = {
  en: {
    title: 'Anouer — Engineering & Innovation Portfolio',
    description: 'Anouer Chouikh — Engineering & Innovation Portfolio',
  },
  fr: {
    title: "Anouer — Portfolio d'ingénierie et d'innovation",
    description: "Anouer Chouikh — Portfolio d'ingénierie et d'innovation",
  },
  ar: {
    title: 'أنور شويخ — معرض هندسة وابتكار',
    description: 'أنور شويخ — معرض هندسة وابتكار',
  },
};

export function isSupportedLanguage(value) {
  return SUPPORTED_LANGUAGES.includes(value);
}

/** Language encoded in a path such as /fr/ or /fr/x, or null. */
export function languageFromPathname(pathname) {
  const match = /^\/(en|fr|ar)(?:\/|$)/.exec(pathname);
  return match ? match[1] : null;
}

/** Valid language from the legacy ?lang= parameter, or null. */
export function languageFromSearch(search) {
  const value = new URLSearchParams(search).get('lang');
  return isSupportedLanguage(value) ? value : null;
}

/**
 * Canonical URL for a language. Keeps every query parameter except `lang`
 * and keeps the hash.
 */
export function buildLanguageUrl(language, { search = '', hash = '' } = {}) {
  const params = new URLSearchParams(search);
  params.delete('lang');
  const query = params.toString();
  return `${LANGUAGE_PATHS[language]}${query ? `?${query}` : ''}${hash}`;
}

/**
 * Decides which language a location shows.
 *
 * Returns `{ language, redirect }`. `redirect` is the URL the page should
 * replace itself with, or null when the current URL is already canonical.
 *
 * Precedence:
 *   1. Valid ?lang= parameter (legacy links): always redirected to its path.
 *   2. Language path (/fr/, /ar/, /en/): shown as-is.
 *   3. Root "/": the stored choice, then the browser language, otherwise
 *      English. Non-English choices redirect to their language path. English
 *      stays on "/" (its canonical is /en/).
 *   4. Any other path: English, no redirect.
 */
export function resolveRouteLanguage({
  pathname,
  search = '',
  hash = '',
  storedLanguage = null,
  browserLanguage = null,
}) {
  const queryLanguage = languageFromSearch(search);
  if (queryLanguage) {
    return {
      language: queryLanguage,
      redirect: buildLanguageUrl(queryLanguage, { search, hash }),
    };
  }

  const pathLanguage = languageFromPathname(pathname);
  if (pathLanguage) {
    return { language: pathLanguage, redirect: null };
  }

  if (pathname === '/') {
    const preferred = [storedLanguage, browserLanguage].find(isSupportedLanguage) ?? DEFAULT_LANGUAGE;
    if (preferred !== DEFAULT_LANGUAGE) {
      return {
        language: preferred,
        redirect: buildLanguageUrl(preferred, { search, hash }),
      };
    }
  }

  return { language: DEFAULT_LANGUAGE, redirect: null };
}
