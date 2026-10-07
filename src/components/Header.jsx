import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { microAnimate } from '../motion/anime';
import WebpImage from './WebpImage';

const NAVIGATION_ITEMS = [
  ['about', '#about'], ['skills', '#skills'], ['projects', '#projects'],
  ['community', '#community'], ['events', '#events'], ['contact', '#contact'],
];

export default function Header() {
  const { language, languages, setLanguage, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const languageSwitcherRef = useRef(null);
  const languageOptionRefs = useRef([]);
  const mobileMenuRef = useRef(null);
  const themeIconRef = useRef(null);
  const isFirstThemePaint = useRef(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Floating pill: solidify after a few px of scroll; tuck the bar away while
  // scrolling down and bring it back on scroll-up. Whether the bar is actually
  // hidden is resolved at render time so an open menu always wins.
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;
        setIsScrolled(y > 24);
        if (reducedMotion) return;
        if (y < 80 || delta < -4) setIsHidden(false);
        else if (delta > 4) setIsHidden(true);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Scrollspy: whichever section crosses the viewport's reading band owns the
  // active nav pill. IntersectionObserver, no scroll-handler polling.
  useEffect(() => {
    const ids = ['home', ...NAVIGATION_ITEMS.map(([key]) => key)];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id === 'home' ? '' : entry.target.id);
          }
        }
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Sun <-> moon micro-morph (anime.js owns icon micro-motion; skipped for
  // reduced motion and on the initial render where there is nothing to morph).
  useEffect(() => {
    if (isFirstThemePaint.current) {
      isFirstThemePaint.current = false;
      return undefined;
    }
    const icon = themeIconRef.current;
    if (!icon) return undefined;
    const animation = microAnimate(icon, {
      rotate: ['-25deg', '0deg'],
      scale: [0.6, 1],
      opacity: [0, 1],
      duration: 420,
      ease: 'out(3)',
    });
    return () => {
      animation?.then?.((a) => a?.pause?.());
    };
  }, [theme]);

  const navigation = useMemo(() => NAVIGATION_ITEMS, []);
  const availableLanguages = useMemo(
    () => languages.filter((locale) => locale !== language),
    [languages, language],
  );

  // Close the language dropdown on outside click / Escape
  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!languageSwitcherRef.current?.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsLanguageOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  // Close the mobile menu when a nav link is chosen or when leaving mobile layout
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const closeOnDesktop = (event) => {
      if (event.matches) setIsMobileMenuOpen(false);
    };
    mq.addEventListener('change', closeOnDesktop);
    return () => mq.removeEventListener('change', closeOnDesktop);
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

  const handleMobileMenuKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      setIsMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const headerHidden = isHidden && !isMobileMenuOpen && !isLanguageOpen;

  return (
    <header
      className={`header${isScrolled ? ' header--scrolled' : ''}${headerHidden ? ' header--hidden' : ''}`}
      onFocus={() => setIsHidden(false)}
    >
      <nav
        className="nav__container container"
        aria-label={t('nav.primary')}
        ref={mobileMenuRef}
        onKeyDown={handleMobileMenuKeyDown}
      >
        <a href="#home" className="nav__logo" aria-label={t('nav.home')}>
          <WebpImage src="/me2.jpg" alt={t('common.name')} className="nav__logo-image" />
          <span className="nav__logo-name" aria-hidden="true">{t('common.firstName')}</span>
        </a>

        <ul className={`nav__list ${isMobileMenuOpen ? 'is-open' : ''}`} id="primary-navigation">
          {navigation.map(([key, href], index) => {
            const isActive = activeSection === key;
            return (
              <li key={href} style={{ '--i': index }}>
                <a
                  className={`nav__link${isActive ? ' is-active' : ''}`}
                  href={href}
                  onClick={closeMobileMenu}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {t(`nav.${key}`)}
                </a>
              </li>
            );
          })}
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
            <span ref={themeIconRef} className="theme-toggle__icon" key={theme}>
              {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            </span>
          </button>

          <button
            type="button"
            className="nav__menu-toggle"
            aria-expanded={isMobileMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
