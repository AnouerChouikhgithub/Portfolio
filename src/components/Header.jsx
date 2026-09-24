import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

export default function Header() {
  const { language, languages, setLanguage, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageSwitcherRef = useRef(null);
  const languageOptionRefs = useRef([]);
  const navigation = [
    ['about', '#about'], ['skills', '#skills'], ['projects', '#projects'],
    ['community', '#community'], ['events', '#events'], ['contact', '#contact'],
  ];
  const availableLanguages = languages.filter((locale) => locale !== language);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!languageSwitcherRef.current?.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const selectLanguage = (locale) => {
    setLanguage(locale);
    setIsLanguageOpen(false);
  };

  const handleLanguageKeyDown = (event, optionIndex) => {
    const lastOptionIndex = availableLanguages.length - 1;
    let nextOptionIndex = optionIndex;

    if (event.key === 'ArrowDown') nextOptionIndex = Math.min(optionIndex + 1, lastOptionIndex);
    else if (event.key === 'ArrowUp') nextOptionIndex = Math.max(optionIndex - 1, 0);
    else if (event.key === 'Home') nextOptionIndex = 0;
    else if (event.key === 'End') nextOptionIndex = lastOptionIndex;
    else if (event.key === 'Escape') {
      setIsLanguageOpen(false);
      return;
    } else {
      return;
    }

    event.preventDefault();
    languageOptionRefs.current[nextOptionIndex]?.focus();
  };

  const handleLanguageTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setIsLanguageOpen(true);
      window.setTimeout(() => {
        const optionIndex = event.key === 'ArrowDown' ? 0 : availableLanguages.length - 1;
        languageOptionRefs.current[optionIndex]?.focus();
      }, 0);
    }
  };

  return (
    <header className="header">
      <nav className="nav__container container" aria-label={t('nav.primary')}>
        <a href="#home" className="nav__logo" aria-label={t('nav.home')}>
          <img src="/me2.jpg" alt="Anouer Chouikh" className="nav__logo-image" />
          <span className="nav__logo-name" aria-hidden="true">Anouer</span>
        </a>
        <ul className="nav__list">
          {navigation.map(([key, href]) => (
            <li key={href}><a className="nav__link" href={href}>{t(`nav.${key}`)}</a></li>
          ))}
        </ul>
        <div className="nav__controls">
          <div
            ref={languageSwitcherRef}
            className={`language-switcher ${isLanguageOpen ? 'is-open' : ''}`}
          >
            <button
              type="button"
              className="language-switcher__trigger"
              aria-label={t('nav.language')}
              aria-haspopup="listbox"
              aria-expanded={isLanguageOpen}
              onFocus={() => setIsLanguageOpen(true)}
              onClick={() => setIsLanguageOpen(true)}
              onKeyDown={handleLanguageTriggerKeyDown}
            >
              {t(`languages.${language}`)}
            </button>
            {isLanguageOpen && (
              <div className="language-switcher__menu" role="listbox" aria-label={t('nav.language')}>
                {availableLanguages.map((locale, index) => (
                  <button
                    key={locale}
                    ref={(element) => { languageOptionRefs.current[index] = element; }}
                    type="button"
                    role="option"
                    aria-selected={false}
                    className="language-switcher__option"
                    onClick={() => selectLanguage(locale)}
                    onKeyDown={(event) => handleLanguageKeyDown(event, index)}
                  >
                    {t(`languages.${locale}`)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="theme-toggle"
            aria-label={theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
            title={theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </header>
  )
}
