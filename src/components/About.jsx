export default function About() {
  return (
    <div className="container about__content">
      <div className="about__image-wrapper">
        <img className="about__image" src="/me.jpg" alt="Portrait of Anouer Chouikh" />
      </div>
      <div>
        <h2 className="section__title">About Me</h2>
        <p className="about__intro">
          I am Anouer, a passionate Computer Engineering student at ISITCom, specializing in Robotics, and IoT. I design intelligent machines and innovative solutions
           that solve real-world problems, with a strong focus on sustainable technology and automation.
        </p>
        <div className="about__mission">
          <h3 className="about__mission-title">Mission & Vision</h3>
          <p>
            To build intelligent systems that create environmental and social impact, and to evolve into a tech startup founder in eco-innovation and robotics.
          </p>
        </div>
      </div>
    </div>
  )
}
