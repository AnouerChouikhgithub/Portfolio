import DeviceDetector from "./DeviceDetector";
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Community from './components/Community'
import Events from './components/Events'
import Goals from './components/Goals'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <section id="home"><Hero /></section>
        <section id="about" className="about"><About /></section>
        <section id="skills" className="skills"><Skills /></section>
        <section id="projects" className="projects"><Projects /></section>
        <section id="community" className="community"><Community /></section>
        <section id="events" className="events"><Events /></section>
        <section id="goals" className="goals"><Goals /></section>
        <section id="contact" className="contact"><Contact /></section>
        <DeviceDetector />
      </main>
      <Footer />
    </>
  )
}
