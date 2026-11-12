/**
 * i18n configuration: supported locales, detection order, RTL rules.
 * Keep in sync with src/i18n/ dictionary files.
 */
export const LANGUAGES = {
  en: { code: 'en', dir: 'ltr', label: 'English' },
  fr: { code: 'fr', dir: 'ltr', label: 'Français' },
  ar: { code: 'ar', dir: 'rtl', label: 'العربية' },
}

export const DEFAULT_LANGUAGE = 'en'

/** Languages rendered right-to-left. */
export const RTL_LANGUAGES = new Set(['ar'])

/** localStorage key used by I18nProvider. */
export const LANGUAGE_STORAGE_KEY = 'portfolio-language'
