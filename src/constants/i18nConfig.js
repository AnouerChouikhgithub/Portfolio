/**
 * i18n configuration: detection order, RTL rules.
 * Keep in sync with src/i18n/ dictionary files.
 */
export const DEFAULT_LANGUAGE = 'en'

/** Languages rendered right-to-left. */
export const RTL_LANGUAGES = new Set(['ar'])

/** localStorage key used by I18nProvider. */
export const LANGUAGE_STORAGE_KEY = 'portfolio-language'
