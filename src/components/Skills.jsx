import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';

const experiences = [
  {
    title: 'Software Engineering Intern',
    company: 'AndaluSoft Engineering',
    dates: 'June 2026 – August 2026',
    bullets: [
      'Designed and implemented an end-to-end product rating feature for a mobile app across UI, backend, and frontend.',
      'Built account management and UI features for a full-stack ERP system using React and React Native.',
      'Developed and tested Symfony REST APIs with Doctrine ORM using Docker and Postman.',
    ],
    tags: ['React', 'React Native', 'Symfony', 'Doctrine', 'Docker', 'Postman'],
    subtext: 'Collaborated within a 5-person team (1 senior developer/team lead, 3 interns) using Git, Yarn, Composer, and Expo.',
  },
];

const techSkillGroups = [
  {
    title: 'Embedded/IoT',
    skills: ['Arduino', 'ESP32', 'Raspberry Pi', 'Sensors', 'Relays', 'I2C', 'BLE (HC-05/HC-06)'],
  },
  {
    title: 'Hardware',
    skills: ['3D Printing', 'SolidWorks', 'CNC Machine', 'Fritzing'],
  },
  {
    title: 'Web/Mobile',
    skills: ['React', 'React Native', 'PHP', 'Symfony', 'Doctrine', 'REST APIs', 'HTML', 'CSS', 'JS'],
  },
  {
    title: 'Programming',
    skills: ['Python', 'Java', 'C/C++', 'SQL'],
  },
  {
    title: 'Tools/DevOps',
    skills: ['Git', 'GitHub', 'Docker', 'Postman'],
  },
  {
    title: 'Data/Cloud',
    skills: ['NumPy', 'Pandas', 'Firebase', 'Cloud'],
  },
]

const allTechSkills = techSkillGroups.flatMap((group) => group.skills);


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
  'French (Fluent)'
]


export default function Skills() {
  const { t } = useI18n();
  const [activeTechnicalCategory, setActiveTechnicalCategory] = useState('All');
  const activeSkills = activeTechnicalCategory === 'All'
    ? allTechSkills
    : techSkillGroups.find((group) => group.title === activeTechnicalCategory)?.skills || [];

  const technicalTabs = ['All', ...techSkillGroups.map((group) => group.title)];

  const handleTechnicalTabKeyDown = (event, tabIndex) => {
    let nextTabIndex = tabIndex;

    if (event.key === 'ArrowRight') {
      nextTabIndex = (tabIndex + 1) % technicalTabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextTabIndex = (tabIndex - 1 + technicalTabs.length) % technicalTabs.length;
    } else if (event.key === 'Home') {
      nextTabIndex = 0;
    } else if (event.key === 'End') {
      nextTabIndex = technicalTabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveTechnicalCategory(technicalTabs[nextTabIndex]);
    event.currentTarget.parentElement?.children[nextTabIndex]?.focus();
  };

  return (
    <div className="container">
      <h2 className="section__title">{t('sections.skills')}</h2>

      <div className="skills__section">
        <h3 className="skills__subtitle">{t('sections.experience')}</h3>
        <div className="skills__experience-grid">
          {experiences.map((experience) => (
            <article key={`${experience.company}-${experience.dates}`} className="events-card skills__experience-card">
              <span className="events-card__meta">{experience.dates}</span>
              <h4 className="events-card__title">{experience.title}</h4>
              <p className="skills__experience-company">{experience.company}</p>
              <ul className="skills__experience-bullets">
                {experience.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="skills__tags skills__experience-tags" aria-label={`${experience.title} technologies`}>
                {experience.tags.map((tag) => (
                  <span key={tag} className="skill-tag">{tag}</span>
                ))}
              </div>
              <p className="skills__experience-subtext">{experience.subtext}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="skills__section">
        <h3 className="skills__subtitle">{t('sections.technical')}</h3>
        <div className="skills__tabs" role="tablist" aria-label="Technical skill categories">
          {technicalTabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`skills-tab-${index}`}
              aria-selected={activeTechnicalCategory === tab}
              aria-controls="technical-skills-panel"
              tabIndex={activeTechnicalCategory === tab ? 0 : -1}
              className={`skills__tab ${activeTechnicalCategory === tab ? 'is-active' : ''}`}
              onClick={() => setActiveTechnicalCategory(tab)}
              onKeyDown={(event) => handleTechnicalTabKeyDown(event, index)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div
          key={activeTechnicalCategory}
          id="technical-skills-panel"
          role="tabpanel"
          aria-labelledby={`skills-tab-${technicalTabs.indexOf(activeTechnicalCategory)}`}
          className="skills__tags skills__tags--filtered"
        >
          {activeSkills.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>

      <div className="skills__section">
        <h3 className="skills__subtitle">{t('sections.soft')}</h3>
        <div className="skills__tags">
          {softSkills.map((s) => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
        </div>
      </div>

      <div className="skills__section">
        <h3 className="skills__subtitle">{t('sections.languages')}</h3>
        <ul className="skills__tags">
          {languages.map((l) => (
            <li key={l} className="skills__item"><i>•</i> {l}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
