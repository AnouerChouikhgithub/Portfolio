import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { useTheme } from '../theme/ThemeProvider';
import MixedText from './MixedText';
import useModalAccessibility from '../hooks/useModalAccessibility';
import { getSkillById, getGroupForSkill } from '../data/portfolio-data';

export default function ProjectModal({ project, onClose, onOpenSkillGroup }) {
  const { t, isRtl } = useI18n();
  const { theme } = useTheme();
  const modalRef = useRef(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const lastUserActionRef = useRef(0);
  const hasPhotos = Array.isArray(project.photos) && project.photos.length > 0;
  const hasGithubUrl = typeof project.githubUrl === 'string' && project.githubUrl.trim().length > 0;

  useModalAccessibility({ panelRef: modalRef, onClose });

  const projectMeta = t(`projects.items.${project.slug}.meta`, '');
  const projectTitle = t(`projects.items.${project.slug}.title`, project.title || project.name);
  const projectDescription = t(`projects.items.${project.slug}.description`, '');
  const projectRole = t(`projects.items.${project.slug}.role`, null);

  const activateManualSelection = (nextIndex) => {
    lastUserActionRef.current = Date.now();
    setSelectedPhotoIndex(nextIndex);
  };

  useEffect(() => {
    setSelectedPhotoIndex(0);
    lastUserActionRef.current = 0;
  }, [project.slug]);

  useEffect(() => {
    if (!hasPhotos || project.photos.length <= 1) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      const now = Date.now();
      if (now - lastUserActionRef.current >= 2000) {
        setSelectedPhotoIndex((currentIndex) => (currentIndex + 1) % project.photos.length);
      }
    }, 2000);

    return () => window.clearTimeout(timerId);
  }, [hasPhotos, project.photos, selectedPhotoIndex]);

  const isLight = theme === 'light';
  const bgDark = project.bgDark || (typeof project.bg === 'object' ? project.bg?.dark : project.bg);
  const bgLight = project.bgLight || (typeof project.bg === 'object' ? project.bg?.light : project.bg);
  const currentBg = isLight ? bgLight : bgDark;

  const accentStyle = {
    ...(project.accent ? { '--accent': project.accent } : {}),
    ...(bgDark ? { '--project-bg-dark': bgDark } : {}),
    ...(bgLight ? { '--project-bg-light': bgLight } : {}),
    ...(currentBg ? { background: currentBg, '--project-bg': currentBg } : {}),
  };

  // Resolved technical skills list with group info
  const technicalSkillsList = (project.technicalSkills || [])
    .map((skillId) => {
      const skillObj = getSkillById(skillId);
      const groupObj = getGroupForSkill(skillId);
      return skillObj ? { ...skillObj, groupObj } : null;
    })
    .filter(Boolean);

  const softSkillsList = project.softSkills || [];

  const handleTechSkillClick = (skill) => {
    if (typeof onOpenSkillGroup === 'function') {
      onOpenSkillGroup(skill.group, skill.id);
    } else {
      // Fallback hash navigation
      window.location.hash = `#skills/${skill.group}?skill=${skill.id}`;
      onClose();
    }
  };

  return (
    <div className="project-modal" onClick={onClose}>
      <div
        className="project-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onClick={(event) => event.stopPropagation()}
        ref={modalRef}
        style={accentStyle}
      >
        <button
          type="button"
          className="project-modal__close"
          aria-label={t('common.close')}
          onClick={onClose}
        >
          ×
        </button>

        <div className="project-modal__content">
          <div className="project-modal__details">
            <p className="project-card__meta">{projectMeta || t('common.dateTbd')}</p>
            {project.logo && (
              <div className="project-modal__logo-icon" aria-hidden="true">
                <img src={project.logo} alt="" />
              </div>
            )}
            <h3 id="project-modal-title" className="project-modal__title">
              {projectTitle}
            </h3>

            {projectRole && (
              <p className="project-modal__role">
                <MixedText text={projectRole} isRtl={isRtl} />
              </p>
            )}

            <p className="project-modal__description">
              <MixedText text={projectDescription} isRtl={isRtl} />
            </p>

            {/* ── Skills Used Block ── */}
            {(technicalSkillsList.length > 0 || softSkillsList.length > 0) && (
              <div className="project-modal__skills-block">
                <h4 className="project-modal__skills-title">
                  {t('projects.skillsUsed', 'Skills Used')}
                </h4>

                {/* Technical Skills Row */}
                {technicalSkillsList.length > 0 && (
                  <div className="project-modal__skills-row">
                    <span className="project-modal__skills-label">
                      {t('projects.technicalSkills', 'Technical skills')}:
                    </span>
                    <div className="project-modal__tags" aria-label="Technical skills used">
                      {technicalSkillsList.map((skill) => (
                        <button
                          key={skill.id}
                          type="button"
                          className="project-modal__tag project-modal__tag--tech"
                          onClick={() => handleTechSkillClick(skill)}
                          title={`View ${skill.name} in ${skill.groupObj?.title || 'Technical Skills'}`}
                          style={{
                            '--skill-accent': skill.groupObj?.color || 'var(--accent)',
                          }}
                        >
                          {skill.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Soft Skills Row */}
                {softSkillsList.length > 0 && (
                  <div className="project-modal__skills-row">
                    <span className="project-modal__skills-label">
                      {t('projects.softSkills', 'Soft skills')}:
                    </span>
                    <div className="project-modal__tags" aria-label="Soft skills used">
                      {softSkillsList.map((softSkill) => (
                        <span
                          key={softSkill}
                          className="project-modal__tag project-modal__tag--soft"
                        >
                          {softSkill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {hasGithubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-modal__link"
              >
                {t('common.viewGithub')}
              </a>
            ) : (
              <span className="project-modal__link project-modal__link--disabled" aria-disabled="true">
                {t('common.githubUnavailable')}
              </span>
            )}
          </div>

          <div className="project-modal__gallery">
            {hasPhotos ? (
              <>
                <div className="project-modal__gallery-main">
                  <button
                    type="button"
                    className="project-modal__nav project-modal__nav--prev"
                    aria-label={`${t('common.previousPhoto')} - ${projectTitle}`}
                    onClick={() => {
                      activateManualSelection((selectedPhotoIndex - 1 + project.photos.length) % project.photos.length);
                    }}
                  >
                    ‹
                  </button>

                  <img
                    src={project.photos[selectedPhotoIndex]}
                    alt={`${projectTitle} - ${t('common.photo')} ${selectedPhotoIndex + 1}`}
                  />

                  <button
                    type="button"
                    className="project-modal__nav project-modal__nav--next"
                    aria-label={`${t('common.nextPhoto')} - ${projectTitle}`}
                    onClick={() => {
                      activateManualSelection((selectedPhotoIndex + 1) % project.photos.length);
                    }}
                  >
                    ›
                  </button>
                </div>

                <div className="project-modal__thumbs" aria-label={`${projectTitle} photo gallery`}>
                  {project.photos.map((photo, index) => (
                    <button
                      key={`${project.slug}-${index}`}
                      type="button"
                      className={`project-modal__thumb ${index === selectedPhotoIndex ? 'is-active' : ''}`}
                      aria-label={`${t('common.photo')} ${index + 1} - ${projectTitle}`}
                      onClick={() => activateManualSelection(index)}
                    >
                      <img src={photo} alt={`${projectTitle} ${t('common.photo')} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="project-modal__empty">
                <span>{t('common.noPhotos')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
