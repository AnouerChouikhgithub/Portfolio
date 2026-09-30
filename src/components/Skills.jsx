import { useRef, useState } from 'react';
import { Eye } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import PdfModal from './PdfModal';
import MixedText from './MixedText';

const staticExperiences = [
  {
    id: 'andalusoft',
    company: 'AndaluSoft Engineering',
    tags: ['React', 'React Native', 'Symfony', 'Doctrine', 'Docker', 'Postman'],
  },
];

const techSkillGroups = [
  {
    key: 'Embedded/IoT',
    skills: ['Arduino', 'ESP32', 'Raspberry Pi', 'Sensors', 'Relays', 'I2C', 'BLE (HC-05/HC-06)'],
  },
  {
    key: 'Hardware',
    skills: ['3D Printing', 'SolidWorks', 'CNC Machine', 'Fritzing'],
  },
  {
    key: 'Web/Mobile',
    skills: ['React', 'React Native', 'PHP', 'Symfony', 'Doctrine', 'REST APIs', 'HTML', 'CSS', 'JS'],
  },
  {
    key: 'Programming',
    skills: ['Python', 'Java', 'C/C++', 'SQL'],
  },
  {
    key: 'Tools/DevOps',
    skills: ['Git', 'GitHub', 'Docker', 'Postman'],
  },
  {
    key: 'Data/Cloud',
    skills: ['NumPy', 'Pandas', 'Firebase', 'Cloud'],
  },
];

const allTechSkills = techSkillGroups.flatMap((group) => group.skills);

export default function Skills() {
  const { t, isRtl } = useI18n();
  const [activeTechnicalCategory, setActiveTechnicalCategory] = useState('All');
  const [isCertOpen, setIsCertOpen] = useState(false);
  const certTriggerRef = useRef(null);

  const activeSkills = activeTechnicalCategory === 'All'
    ? allTechSkills
    : techSkillGroups.find((group) => group.key === activeTechnicalCategory)?.skills || [];

  const technicalTabKeys = ['All', ...techSkillGroups.map((group) => group.key)];

  const handleTechnicalTabKeyDown = (event, tabIndex) => {
    let nextTabIndex = tabIndex;

    if (event.key === 'ArrowRight') {
      nextTabIndex = (tabIndex + 1) % technicalTabKeys.length;
    } else if (event.key === 'ArrowLeft') {
      nextTabIndex = (tabIndex - 1 + technicalTabKeys.length) % technicalTabKeys.length;
    } else if (event.key === 'Home') {
      nextTabIndex = 0;
    } else if (event.key === 'End') {
      nextTabIndex = technicalTabKeys.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveTechnicalCategory(technicalTabKeys[nextTabIndex]);
    event.currentTarget.parentElement?.children[nextTabIndex]?.focus();
  };

  const translatedExperiences = t('skills.experience') || [];
  const softSkillsList = t('skills.soft') || [];
  const languagesList = t('skills.languages') || [];

  return (
    <>
      <div className="container">
        <h2 className="section__title">{t('sections.skills')}</h2>

        <div className="skills__section">
          <h3 className="skills__subtitle">{t('sections.experience')}</h3>
          <div className="skills__experience-grid">
            {staticExperiences.map((experience, idx) => {
              const trans = translatedExperiences[idx] || {};
              const expTitle = trans.title || 'Software Engineering Intern';
              const expDates = trans.dates || 'June 2026 – August 2026';
              const expBullets = trans.bullets || [];
              const expSubtext = trans.subtext || '';

              return (
                <article key={experience.id} className="events-card skills__experience-card">
                  <span className="events-card__meta">{expDates}</span>
                  <h4 className="events-card__title">{expTitle}</h4>
                  <p className="skills__experience-company">{experience.company}</p>
                  <ul className="skills__experience-bullets">
                    {expBullets.map((bullet, bIdx) => (
                      <li key={bIdx}>
                        <MixedText text={bullet} isRtl={isRtl} />
                      </li>
                    ))}
                  </ul>
                  <div className="skills__tags skills__experience-tags" aria-label={`${expTitle} technologies`}>
                    {experience.tags.map((tag) => (
                      <span key={tag} className="skill-tag">{tag}</span>
                    ))}
                  </div>
                  <p className="skills__experience-subtext">
                    <MixedText text={expSubtext} isRtl={isRtl} />
                  </p>
                  <div className="skills__experience-actions">
                    <button
                      ref={certTriggerRef}
                      type="button"
                      className="btn btn--outline-pill certificate-btn"
                      onClick={() => setIsCertOpen(true)}
                      aria-label={t('certificate.dialogTitle')}
                    >
                      <Eye size={15} aria-hidden="true" />
                      {t('certificate.viewButton')}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="skills__section">
          <h3 className="skills__subtitle">{t('sections.technical')}</h3>
          <div className="skills__tabs" role="tablist" aria-label="Technical skill categories">
            {technicalTabKeys.map((key, index) => (
              <button
                key={key}
                type="button"
                role="tab"
                id={`skills-tab-${index}`}
                aria-selected={activeTechnicalCategory === key}
                aria-controls="technical-skills-panel"
                tabIndex={activeTechnicalCategory === key ? 0 : -1}
                className={`skills__tab ${activeTechnicalCategory === key ? 'is-active' : ''}`}
                onClick={() => setActiveTechnicalCategory(key)}
                onKeyDown={(event) => handleTechnicalTabKeyDown(event, index)}
              >
                {t(`skills.categories.${key}`, key)}
              </button>
            ))}
          </div>
          <div
            key={activeTechnicalCategory}
            id="technical-skills-panel"
            role="tabpanel"
            aria-labelledby={`skills-tab-${technicalTabKeys.indexOf(activeTechnicalCategory)}`}
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
            {softSkillsList.map((s, idx) => (
              <span key={idx} className="skill-tag">{s}</span>
            ))}
          </div>
        </div>

        <div className="skills__section">
          <h3 className="skills__subtitle">{t('sections.languages')}</h3>
          <ul className="skills__tags">
            {languagesList.map((l, idx) => (
              <li key={idx} className="skills__item"><i>•</i> {l}</li>
            ))}
          </ul>
        </div>
      </div>

      {isCertOpen && (
        <PdfModal
          src="/internship-certificate.pdf"
          title={t('certificate.dialogTitle')}
          showDownload={false}
          onClose={() => setIsCertOpen(false)}
          triggerRef={certTriggerRef}
        />
      )}
    </>
  );
}

