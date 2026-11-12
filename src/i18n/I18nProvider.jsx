import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';
import { readStorage, writeStorage } from '../utils/storage';
import { LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE, RTL_LANGUAGES } from '../constants/i18nConfig';

const dictionaries = { en, fr, ar };
const supportedLanguages = Object.keys(dictionaries);

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const queryLanguage = new URLSearchParams(window.location.search).get('lang');
    if (supportedLanguages.includes(queryLanguage)) return queryLanguage;
    const storedLanguage = readStorage(LANGUAGE_STORAGE_KEY);
    if (supportedLanguages.includes(storedLanguage)) return storedLanguage;
    const browserLang = window.navigator.language?.slice(0, 2);
    if (supportedLanguages.includes(browserLang)) return browserLang;
  } catch {
    // Ignore storage/navigator access errors
  }
  return DEFAULT_LANGUAGE;
};

const getValue = (dictionary, key) => key.split('.').reduce((value, part) => value?.[part], dictionary);

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);
  const dictionary = dictionaries[language] || dictionaries.en;
  const isRtl = RTL_LANGUAGES.has(language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.title = language === 'fr'
      ? 'Anouer — Portfolio d\'ingénierie et d\'innovation'
      : language === 'ar'
        ? 'أنور شويخ — معرض هندسة وابتكار'
        : 'Anouer — Engineering & Innovation Portfolio';

    document.querySelector('meta[name="description"]')?.setAttribute('content',
      language === 'fr'
        ? 'Anouer Chouikh — Portfolio d\'ingénierie et d\'innovation'
        : language === 'ar'
          ? 'أنور شويخ — معرض هندسة وابتكار'
          : 'Anouer Chouikh — Engineering & Innovation Portfolio'
    );

    // Dynamic Arabic font stylesheet loading
    if (isRtl) {
      if (!document.getElementById('arabic-font')) {
        const link = document.createElement('link');
        link.id = 'arabic-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap';
        document.head.appendChild(link);
      }
    }

    writeStorage(LANGUAGE_STORAGE_KEY, language);
  }, [language, isRtl]);

  const value = useMemo(() => ({
    language,
    languages: supportedLanguages,
    isRtl,
    setLanguage,
    t: (key, fallback = key) => getValue(dictionary, key) ?? getValue(en, key) ?? fallback,
  }), [dictionary, language, isRtl]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}
