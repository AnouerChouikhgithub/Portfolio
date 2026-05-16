const techSkills = 
[
    "Arduino",
    "ESP32",
    "Raspberry Pi",
    "Sensors",
    "Relays",
    "3D Printing",
    "SolidWorks",
    "CNC Machine",
    "Fritzing",

    "Python",
    "NumPy",
    "Pandas",
    "C/C++",
    "Java",
    "Git",
    "GitHub",
    "JS",
    "React",
    "PHP",
    "HTML",
    "CSS",
    "SQL",
    "Cloud",
]


const softSkills = [
  'Teamwork',
  'problem-solving',
  'project management',
  'adaptability',
  'communication',
  "leadership",
  "time management",
  "critical thinking",
  "analytical thinking",
  "initiative",
  "creativity",
  "self-learning",
  "decision-making",
  "resilience",
  "autonomy",
  "attention to detail"
]

const languages = [
  'Arabic (Native)',
  'English (Fluent)',
  'French (Fluent)',
  "German (Basic)"
]


export default function Skills() {
  return (
    <div className="container">
      <h2 className="section__title">Skills & Expertise</h2>

      <div className="skills__section">
        <h3 className="skills__subtitle">Technical Skills</h3>
        <div className="skills__tags">
          {techSkills.map((t) => (
            <span key={t} className="skill-tag">{t}</span>
          ))}
        </div>
      </div>

      <div className="skills__section">
        <h3 className="skills__subtitle">Soft Skills</h3>
        <div className="skills__tags">
          {softSkills.map((s) => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
        </div>
      </div>

      <div className="skills__section">
        <h3 className="skills__subtitle">Languages</h3>
        <ul className="skills__tags">
          {languages.map((l) => (
            <li key={l} className="skills__item"><i>•</i> {l}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
