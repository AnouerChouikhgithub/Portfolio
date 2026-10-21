// Build-time render entry. Used only by `vite build --ssr` and
// scripts/prerender.mjs to produce the static HTML for each language. It is
// not a server: the site stays static.
import { renderToString } from 'react-dom/server';
import App from './App';
import { I18nProvider } from './i18n/I18nProvider';
import { ThemeProvider } from './theme/ThemeProvider';
import MotionProvider from './motion/MotionProvider';

export {
  PAGE_META,
  LANGUAGE_PATHS,
  OPEN_GRAPH_LOCALES,
  SITE_ORIGIN,
  SUPPORTED_LANGUAGES,
} from './i18n/languageRoutes';

export function renderApp(language) {
  return renderToString(
    <ThemeProvider>
      <I18nProvider initialLanguage={language}>
        <MotionProvider>
          <App />
        </MotionProvider>
      </I18nProvider>
    </ThemeProvider>,
  );
}
