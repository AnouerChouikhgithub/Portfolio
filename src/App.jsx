import { useEffect } from 'react';
import { useI18n } from './i18n/I18nProvider';
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Community from './components/Community'
import Events from './components/Events'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './motion/ScrollProgress'
import SectionBackground from './components/SectionBackground'
import { initCardSpotlight } from './motion/cardSpotlight'

export default function App() {
  const { t } = useI18n();
  // Single delegated pointer listener feeding the card spotlight/tilt CSS vars.
  useEffect(() => initCardSpotlight(), [])

  return (
    <>
      {/* Fixed grain/vignette: hides the seams between section bands with a
          very low-contrast texture (paper grain in light, fine grain +
          vignette in dark). Purely decorative. */}
      <div className="page-grain" aria-hidden="true" />
      {/* Keyboard users can jump straight past the header into the content. */}
      <a className="skip-link" href="#main">{t('a11y.skipToContent')}</a>
      <ScrollProgress />
      <Header />
      <main id="main" tabIndex={-1}>
        {/* Home is a plain wrapper: Hero renders its own labelled <section>.
            Wrapping it in another <section> made it a nested landmark. */}
        <div id="home"><Hero /></div>
        <section id="about" className="about"><SectionBackground variant="about" /><About /></section>
        <section id="skills" className="skills"><SectionBackground variant="skills" /><Skills /></section>
        <section id="projects" className="projects"><SectionBackground variant="projects" /><Projects /></section>
        <section id="community" className="community"><SectionBackground variant="community" /><Community /></section>
        <section id="events" className="events"><SectionBackground variant="events" /><Events /></section>
        <section id="contact" className="contact"><SectionBackground variant="contact" /><Contact /></section>
      </main>
      <Footer />
    </>
  )
}
