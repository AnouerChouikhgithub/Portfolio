export default function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-heading">
      <div className="hero__content">
        <h1 id="hero-heading" className="hero__name">Anouer Chouikh</h1>
        <p className="hero__title">2nd year student in  Computer Engneering & Internet of Things (ISITCom)</p>
        <p className="hero__tagline">Robotics • IoT</p>
        <div className="hero__buttons">
          <a className="btn btn--primary" href="#projects">View Projects</a>
          <a className="btn btn--secondary" href="#goals">Contact</a>
        </div>
      </div>
    </section>
  )
}
