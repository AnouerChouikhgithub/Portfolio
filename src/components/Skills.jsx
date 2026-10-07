import { lazy, Suspense, useRef, useState, useMemo, useEffect, useCallback } from 'react';
import SubScreen from './overlay/SubScreen';
import WebpImage from './WebpImage';
import {
  Eye,
  Cpu,
  Wrench,
  Globe,
  Code,
  GitBranch,
  Cloud,
  ArrowLeft,
  Box,
} from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import MixedText from './MixedText';
import ProjectModal from './ProjectModal';
import ModalErrorBoundary from './ModalErrorBoundary';
import useModalReveals from '../hooks/useModalReveals';
import {
  GROUPS,
  getSkillsForGroup,
  getProjectsForGroup,
  getProjectsForSkill,
  getSkillById,
} from '../data/portfolio-data';

// Lazy-loaded: pdfjs-dist is only fetched when the certificate is opened.
const PdfModal = lazy(() => import('./PdfModal'));

// ─── Group Icon Map ─────────────────────────────────────────────────────────────
const GROUP_ICONS = {
  Cpu,
  Wrench,
  Globe,
  Code,
  GitBranch,
  Cloud,
};

// ─── Static Experience Data ───────────────────────────────────────────────────
const staticExperiences = [
  {
    id: 'andalusoft',
    company: 'AndaluSoft Engineering',
    tags: ['React', 'React Native', 'Symfony', 'Doctrine', 'Docker', 'Postman'],
  },
];

export default function Skills() {
  const { t, isRtl } = useI18n();
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const certTriggerRef = useRef(null);
  const groupCardRefs = useRef({});
  const subscreenRef = useRef(null);
  const subscreenScrollPosRef = useRef(0);

  // Active group data & all its skills
  const activeGroup = useMemo(
    () => GROUPS.find((g) => g.id === activeGroupId) ?? null,
    [activeGroupId],
  );
  // Scroll lock is owned by SubScreen now.
  useModalReveals(subscreenRef, activeGroupId);

  const groupSkills = useMemo(
    () => {
      const skills = activeGroupId ? getSkillsForGroup(activeGroupId) : [];
      return Array.isArray(skills) ? skills.filter(Boolean) : [];
    },
    [activeGroupId],
  );

  // Filtered projects: if a skill is selected, filter by that skill; otherwise show all group projects
  const filteredProjects = useMemo(() => {
    if (!activeGroupId) return [];
    if (selectedSkillId) {
      const projects = getProjectsForSkill(selectedSkillId);
      return Array.isArray(projects) ? projects.filter(Boolean) : [];
    }
    const projects = getProjectsForGroup(activeGroupId);
    return Array.isArray(projects) ? projects.filter(Boolean) : [];
  }, [activeGroupId, selectedSkillId]);

  // Total projects in this group (to know if the whole group has zero projects)
  const totalGroupProjectsCount = useMemo(
    () => (activeGroupId ? getProjectsForGroup(activeGroupId).length : 0),
    [activeGroupId],
  );

  const selectedSkillObj = useMemo(
    () => (selectedSkillId ? getSkillById(selectedSkillId) : null),
    [selectedSkillId],
  );

  // Synchronize with URL hash (e.g. #skills/embedded-iot?skill=arduino)
  const syncFromHash = useCallback(() => {
    const fullHash = window.location.hash;
    if (!fullHash.toLowerCase().startsWith('#skills')) return;

    const [pathPart, queryPart] = fullHash.split('?');
    const rawId = pathPart.replace(/^#skills[\/-]?/, '').toLowerCase();
    const foundGroup = GROUPS.find((g) => g.id === rawId);

    if (foundGroup) {
      setActiveGroupId(foundGroup.id);
      if (queryPart) {
        const params = new URLSearchParams(queryPart);
        const skillParam = params.get('skill');
        if (skillParam && getSkillById(skillParam)) {
          setSelectedSkillId(skillParam);
        } else {
          setSelectedSkillId(null);
        }
      } else {
        setSelectedSkillId(null);
      }
    }
  }, []);

  useEffect(() => {
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [syncFromHash]);

  // ESC is owned by SubScreen (top-layer only), no window listener here.

  const handleOpenGroup = (groupId, skillId = null) => {
    setActiveGroupId(groupId);
    setSelectedSkillId(skillId);
    setActiveProject(null);

    const hashString = skillId ? `#skills/${groupId}?skill=${skillId}` : `#skills/${groupId}`;
    window.history.pushState(null, '', hashString);
  };

  const handleCloseSubscreen = () => {
    const prevGroupId = activeGroupId;
    setActiveGroupId(null);
    setSelectedSkillId(null);
    setActiveProject(null);
    window.history.pushState(null, '', '#skills');

    // Return focus to the group card
    if (prevGroupId && groupCardRefs.current[prevGroupId]) {
      groupCardRefs.current[prevGroupId].focus();
    }
  };

  const handleSkillChipClick = (skillId) => {
    setSelectedSkillId((prev) => {
      const next = prev === skillId ? null : skillId;
      const hashString = next
        ? `#skills/${activeGroupId}?skill=${next}`
        : `#skills/${activeGroupId}`;
      window.history.replaceState(null, '', hashString);
      return next;
    });
  };

  const handleSelectProject = (project) => {
    // Preserve subscreen scroll position before opening project modal
    if (subscreenRef.current) {
      subscreenScrollPosRef.current = subscreenRef.current.scrollTop;
    }
    setActiveProject(project);
  };

  const handleCloseProjectModal = () => {
    setActiveProject(null);
    // Restore subscreen scroll position
    setTimeout(() => {
      if (subscreenRef.current) {
        subscreenRef.current.scrollTop = subscreenScrollPosRef.current;
      }
    }, 0);
  };

  // ── Translations ──
  const experienceTranslation = t('skills.experience');
  const softSkillsTranslation = t('skills.soft');
  const languagesTranslation = t('skills.languages');
  const translatedExperiences = Array.isArray(experienceTranslation) ? experienceTranslation : [];
  const softSkillsList = Array.isArray(softSkillsTranslation) ? softSkillsTranslation : [];
  const languagesList = Array.isArray(languagesTranslation) ? languagesTranslation : [];

  return (
    <>
      <div className="container">
        <h2 className="section__title">{t('sections.skills')}</h2>

        {/* ── Experience ──────────────────────────────────────────── */}
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

        {/* ── Technical Skills (6 Group Cards) ────────────────────── */}
        <div className="skills__section">
          <h3 className="skills__subtitle">{t('sections.technical')}</h3>

          <div className="skills-groups-grid" role="list">
            {GROUPS.filter(Boolean).map((group) => {
                const Icon = GROUP_ICONS[group?.icon] || Cpu;
                const groupTitle = t(`skills.categories.${group?.title || ''}`, group?.title || '');

              return (
                <button
                  key={group?.id}
                  ref={(el) => { if (group?.id) groupCardRefs.current[group.id] = el; }}
                  type="button"
                  role="listitem"
                  className="skills-group-card"
                  onClick={() => group?.id && handleOpenGroup(group.id)}
                  aria-haspopup="dialog"
                  aria-label={groupTitle}
                  style={{ '--group-accent': group?.color || 'var(--accent)' }}
                >
                  <div className="skills-group-card__icon-wrapper" aria-hidden="true">
                    <Icon size={28} strokeWidth={1.8} />
                  </div>
                  <span className="skills-group-card__title">{groupTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Soft Skills ─────────────────────────────────────────── */}
        <div className="skills__section">
          <h3 className="skills__subtitle">{t('sections.soft')}</h3>
          <div className="skills__tags">
            {softSkillsList.map((s, idx) => (
              <span key={idx} className="skill-tag skill-tag--soft">{s}</span>
            ))}
          </div>
        </div>

        {/* ── Languages ───────────────────────────────────────────── */}
        <div className="skills__section">
          <h3 className="skills__subtitle">{t('sections.languages')}</h3>
          <ul className="skills__tags">
            {languagesList.map((l, idx) => (
              <li key={idx} className="skills__item"><i>•</i> {l}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Group Subscreen Overlay ─────────────────────────────────── */}
      <SubScreen
        open={Boolean(activeGroup)}
        onClose={handleCloseSubscreen}
        labelledBy="skills-subscreen-title"
        variant="skills"
        accent={activeGroup?.color}
      >
        {activeGroup && (
          <ModalErrorBoundary
            onClose={handleCloseSubscreen}
            message={t('common.viewLoadError')}
            closeLabel={t('common.close')}
          >
        <div
          className="skills-subscreen modal-scroll-region"
          ref={subscreenRef}
        >
          <div className="skills-subscreen__container">
            {/* Header */}
            <div className="skills-subscreen__header modal-reveal">
              <button
                type="button"
                className="skills-subscreen__back-btn"
                onClick={handleCloseSubscreen}
                aria-label={t('skills.backToSkills', 'Back to Technical Skills')}
              >
                <ArrowLeft size={18} className="skills-subscreen__back-icon" aria-hidden="true" />
                <span>{t('skills.backToSkills', 'Back to Technical Skills')}</span>
              </button>

              <div className="skills-subscreen__title-wrapper">
                <h3 id="skills-subscreen-title" className="skills-subscreen__title modal-reveal">
                {t(`skills.categories.${activeGroup?.title || ''}`, activeGroup?.title || '')}
                </h3>
              </div>
            </div>

            {/* Skills Filter Chips */}
            <div className="skills-subscreen__skills-section modal-reveal">
              <div className="skills__tags" aria-label="Skills filter">
                {groupSkills.map((skill) => {
                  const isSelected = selectedSkillId === skill.id;
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      className={`skill-tag skill-tag--filter ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => handleSkillChipClick(skill.id)}
                      aria-pressed={isSelected}
                    >
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Related Projects Section (hidden entirely if whole group has zero projects) */}
            {totalGroupProjectsCount > 0 && (
              <div className="skills-subscreen__projects-section modal-reveal">
                <div className="skills-subscreen__projects-header">
                  <h4 className="skills-subscreen__subtitle">
                    {selectedSkillObj
                      ? `${t('skills.projectsUsingSkill', 'Projects using')} ${selectedSkillObj.name} (${filteredProjects.length})`
                      : `${t('skills.relatedProjects', 'Related Projects')} (${filteredProjects.length})`}
                  </h4>
                </div>

                {filteredProjects.length > 0 ? (
                  <ul className="skills-subscreen__projects-list" role="list">
                    {filteredProjects.map((project) => {
                      const projectTitle = t(`projects.items.${project?.slug || ''}.title`, project?.title || project?.name || '');
                      const accentColor = project?.accent || 'var(--accent)';

                      return (
                        <li key={project?.id || project?.slug || projectTitle} role="listitem" className="modal-reveal modal-reveal--scale">
                          <button
                            type="button"
                            className="skills-project-item-btn"
                            onClick={() => handleSelectProject(project)}
                            aria-label={projectTitle}
                            style={{ '--item-accent': accentColor }}
                          >
                            <div className="skills-project-item__icon-wrapper">
                              {project?.logo ? (
                                <WebpImage
                                  src={project.logo}
                                  alt=""
                                  className="skills-project-item__logo"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                      e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              <div
                                className="skills-project-item__placeholder"
                                style={{ display: project?.logo ? 'none' : 'flex' }}
                                aria-hidden="true"
                              >
                                <Box size={22} />
                              </div>
                            </div>

                            <span className="skills-project-item__title" style={{ '--project-accent': accentColor }}>
                              {projectTitle}
                            </span>

                            <span className="skills-project-item__view-more">
                              {t('skills.viewMore', 'View more')}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="skills-subscreen__empty">
                    <p>{t('skills.noProjectsYet', 'No projects yet')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
          </ModalErrorBoundary>
        )}
      </SubScreen>

      {/* ── Project Detail Modal (stacked layer over the Skills subscreen) ── */}
      <SubScreen
        open={Boolean(activeProject)}
        onClose={handleCloseProjectModal}
        accent={activeProject?.accent}
        labelledBy="project-modal-title"
        variant="project"
        className="subscreen--project"
      >
        {activeProject && (
          <ModalErrorBoundary
            onClose={handleCloseProjectModal}
            message={t('common.viewLoadError')}
            closeLabel={t('common.close')}
          >
            <ProjectModal
              project={activeProject}
              onClose={handleCloseProjectModal}
              onOpenSkillGroup={(groupId, skillId) => {
                handleCloseProjectModal();
                handleOpenGroup(groupId, skillId);
              }}
            />
          </ModalErrorBoundary>
        )}
      </SubScreen>

      {/* ── Internship Certificate Modal ───────────────────────────── */}
      {isCertOpen && (
        createPortal(
          <Suspense fallback={null}>
            <ModalErrorBoundary
              onClose={() => setIsCertOpen(false)}
              message={t('common.viewLoadError')}
              closeLabel={t('common.close')}
            >
              <PdfModal
                src="/internship-certificate.pdf"
                title={t('certificate.dialogTitle')}
                showDownload={false}
                onClose={() => setIsCertOpen(false)}
                triggerRef={certTriggerRef}
              />
            </ModalErrorBoundary>
          </Suspense>,
          document.body,
        )
      )}
    </>
  );
}
