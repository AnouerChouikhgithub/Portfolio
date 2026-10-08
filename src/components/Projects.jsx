import React, { useCallback, useEffect, memo, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import MixedText from './MixedText';
import ProjectModal from './ProjectModal';
import ModalErrorBoundary from './ModalErrorBoundary';
import { PROJECTS } from '../data/portfolio-data';
import { scrollToId } from '../motion/lenisStore';
import WebpImage from './WebpImage';

/**
 * Memoized project card — only re-renders when its project data, the active
 * selection, or translations change (not on every parent state update).
 */
const ProjectCard = memo(function ProjectCard({ project, meta, preview, description, isActive, isRtl, onSelect, dateTbdLabel, logoAltPrefix }) {
  return (
    <button
      type="button"
      className="project-card"
      aria-haspopup="dialog"
      aria-expanded={isActive}
      onClick={onSelect}
    >
      {project.logo && (
        <WebpImage
          className="project-card__logo"
          src={project.logo}
          alt={`${project.title} ${logoAltPrefix}`}
          loading="lazy"
          decoding="async"
        />
      )}
      <span className="project-card__meta">{meta || dateTbdLabel}</span>
      <h3 className="project-card__title" style={project.accent ? { '--project-accent': project.accent } : undefined}>{project.title}</h3>
      <p className="project-card__description">
        <MixedText text={preview || description} isRtl={isRtl} />
      </p>
    </button>
  );
});

export default function Projects() {
  const { t, isRtl } = useI18n();
  const [activeProject, setActiveProject] = useState(null);
  const closeProject = useCallback(() => setActiveProject(null), []);

  useEffect(() => {
    const syncProjectFromHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith('#project-')) {
        return;
      }

      const slug = hash.replace('#project-', '');
      const matchedProject = PROJECTS.find((project) => project.slug === slug);

      if (matchedProject) {
        setActiveProject(matchedProject);
        scrollToId('projects');
      }
    };

    syncProjectFromHash();
    window.addEventListener('hashchange', syncProjectFromHash);

    return () => window.removeEventListener('hashchange', syncProjectFromHash);
  }, []);

  const handleOpenSkillGroup = (groupId, skillId) => {
    closeProject();
    const hash = skillId ? `#skills/${groupId}?skill=${skillId}` : `#skills/${groupId}`;
    window.location.hash = hash;
    scrollToId('skills');
  };

  return (
    <div className="container projects">
      <h2 className="section__title">{t('sections.projects')}</h2>

      <div className="projects__grid">
        {PROJECTS.map((project) => {
          const meta = t(`projects.items.${project.slug}.meta`, '');
          const preview = t(`projects.items.${project.slug}.preview`, '');
          const description = t(`projects.items.${project.slug}.description`, '');

          return (
            <ProjectCard
              key={project.slug}
              project={project}
              meta={meta}
              preview={preview}
              description={description}
              isActive={activeProject?.slug === project.slug}
              isRtl={isRtl}
              onSelect={() => setActiveProject(project)}
              dateTbdLabel={t('common.dateTbd')}
              logoAltPrefix={t('common.logo')}
            />
          );
        })}
      </div>

      {activeProject && (
        <ModalErrorBoundary
          onClose={closeProject}
          message={t('common.viewLoadError')}
          closeLabel={t('common.close')}
        >
          <ProjectModal
            project={activeProject}
            onClose={closeProject}
            onOpenSkillGroup={handleOpenSkillGroup}
          />
        </ModalErrorBoundary>
      )}
    </div>
  );
}
