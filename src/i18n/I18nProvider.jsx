import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';

const dictionaries = { en, fr, ar };
const storageKey = 'portfolio-language';
const supportedLanguages = Object.keys(dictionaries);

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  const queryLanguage = new URLSearchParams(window.location.search).get('lang');
  if (supportedLanguages.includes(queryLanguage)) return queryLanguage;
  const storedLanguage = window.localStorage.getItem(storageKey);
  return supportedLanguages.includes(storedLanguage) ? storedLanguage : 'en';
};

const getValue = (dictionary, key) => key.split('.').reduce((value, part) => value?.[part], dictionary);

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);
  const dictionary = dictionaries[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = language === 'fr'
      ? 'Anouer — Portfolio d\'ingénierie et d\'innovation'
      : language === 'ar'
        ? 'أنور — معرض هندسة وابتكار'
        : 'Anouer — Engineering & Innovation Portfolio';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      language === 'fr'
        ? 'Anouer Chouikh — Portfolio d\'ingénierie et d\'innovation'
        : language === 'ar'
          ? 'أنور الشيخ — معرض هندسة وابتكار'
          : 'Anouer Chouikh — Engineering & Innovation Portfolio'
    );
    window.localStorage.setItem(storageKey, language);
  }, [language]);

  const value = useMemo(() => ({
    language,
    languages: supportedLanguages,
    setLanguage,
    t: (key, fallback = key) => getValue(dictionary, key) ?? getValue(en, key) ?? fallback,
  }), [dictionary, language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}
