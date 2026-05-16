const projects = [
  { title: 'PET Filament Machine', desc: 'Transforms plastic bottles into 3D printer filament' },
  { title: 'NeuroFocus', desc: 'Wearable Stress Detection System for Children' },
  { title: 'Cartago', desc: 'AI robot for ocean cleaning using Computer Vision' },
  { title: 'Smart House', desc: 'IoT-based intelligent home automation system' },
  { title: 'All-Terrain Robot', desc: 'Adaptable mobile robot for rough terrain navigation' },
  { title: 'Fighter Robot', desc: 'Robotics competition combat robot' },
  { title: 'Line-Follower Robot', desc: 'Autonomous robot that follows a black path' },
]

export default function Projects() {
  return (
    <div className="container">
      <h2 className="section__title">Projects</h2>
      <div className="projects__grid">
        {projects.map(p => (
          <article className="project-card" key={p.title}>
            <h3 className="project-card__title">{p.title}</h3>
            <p className="project-card__description">{p.desc}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
