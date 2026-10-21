import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { I18nProvider, resolveBrowserLanguage } from './i18n/I18nProvider'
import { ThemeProvider } from './theme/ThemeProvider'
import MotionProvider from './motion/MotionProvider'

const rootElement = document.getElementById('root')
const route = resolveBrowserLanguage()

// Legacy ?lang= links and non-English visitors on "/" are sent to their
// language path first, so the URL and the displayed language always agree.
if (route.redirect) {
  window.location.replace(route.redirect)
} else {
  const app = (
    <React.StrictMode>
      <ThemeProvider>
        <I18nProvider>
          <MotionProvider>
            <App />
          </MotionProvider>
        </I18nProvider>
      </ThemeProvider>
    </React.StrictMode>
  )

  // Hydrate only when the prerendered markup was built for the language this
  // page shows. Otherwise render from scratch, which replaces the static markup
  // instead of duplicating it.
  if (rootElement.dataset.ssrLang === route.language) {
    hydrateRoot(rootElement, app)
  } else {
    createRoot(rootElement).render(app)
  }
}
