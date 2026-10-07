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

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <section id="home"><Hero /></section>
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
