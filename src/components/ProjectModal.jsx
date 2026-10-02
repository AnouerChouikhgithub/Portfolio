import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  Wrench,
  Server,
  Radio,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useI18n } from '../i18n/I18nProvider';
import { useTheme } from '../theme/ThemeProvider';
import MixedText from './MixedText';
import PetArchDiagram from './PetArchDiagram';
import useModalAccessibility from '../hooks/useModalAccessibility';
import { getSkillById, getGroupForSkill } from '../data/portfolio-data';
import { PET_REPOS, PET_HUB_URL } from '../data/pet-repos';

export default function ProjectModal({ project, onClose, onOpenSkillGroup }) {
  const { t, isRtl, language } = useI18n();
  const { theme } = useTheme();
  const modalRef = useRef(null);
  const scrollBodyRef = useRef(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [canScrollMore, setCanScrollMore] = useState(false);
  const lastUserActionRef = useRef(0);

  const isPet = project.slug === 'pet-filament-machine';

  useModalAccessibility({ panelRef: modalRef, onClose });

  const projectMeta = t(`projects.items.${project.slug}.meta`, '');
  const projectTitle = t(`projects.items.${project.slug}.title`, project.title || project.name);
  const projectDescription = t(`projects.items.${project.slug}.description`, '');
  const projectRole = t(`projects.items.${project.slug}.role`, null);

  // PET Gallery items (Hero photo, Architecture diagram, Wiring diagram)
  const petGalleryItems = useMemo(() => {
    if (!isPet) return [];
    return [
      {
        id: 'pet-hero',
        type: 'image',
        src: "/Projects/PET-Recycling-Filament-System/Capture%20d'%C3%A9cran%202026-09-28%20145437.png",
        caption: t('projects.pet.gallery.machine.caption'),
        alt: t('projects.pet.gallery.machine.alt'),
        thumbLabel: t('projects.pet.status.machine.title', 'Machine'),
      },
      {
        id: 'pet-arch',
        type: 'component',
        caption: t('projects.pet.gallery.arch.caption'),
        alt: t('projects.pet.gallery.arch.alt'),
        thumbLabel: t('projects.pet.arch.title', 'Architecture'),
      },
      {
        id: 'pet-wiring',
        type: 'image',
        src: '/Projects/PET-Recycling-Filament-System/Schematic%20Diagram.jpg',
        caption: t('projects.pet.gallery.wiring.caption'),
        alt: t('projects.pet.gallery.wiring.alt'),
        isPaperCard: true,
        thumbLabel: t('projects.pet.gallery.wiring.alt', 'Wiring Diagram'),
      },
    ];
  }, [isPet, t, isRtl]);

  const genericPhotos = Array.isArray(project.photos) ? project.photos : [];
  const galleryCount = isPet ? petGalleryItems.length : genericPhotos.length;
  const hasPhotos = galleryCount > 0;
  const hasGithubUrl = typeof project.githubUrl === 'string' && project.githubUrl.trim().length > 0;

  const activateManualSelection = (nextIndex) => {
    lastUserActionRef.current = Date.now();
    setSelectedGalleryIndex(nextIndex);
  };

  // Reset scroll and selection on project or language change
  useEffect(() => {
    setSelectedGalleryIndex(0);
    lastUserActionRef.current = 0;
    if (scrollBodyRef.current) {
      scrollBodyRef.current.scrollTop = 0;
    }
  }, [project.slug, language]);

  // Gallery keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!hasPhotos || galleryCount <= 1) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        activateManualSelection((selectedGalleryIndex + 1) % galleryCount);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        activateManualSelection((selectedGalleryIndex - 1 + galleryCount) % galleryCount);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPhotos, galleryCount, selectedGalleryIndex]);

  // Bottom scroll fade indicator calculation
  const updateScrollFade = useCallback(() => {
    const el = scrollBodyRef.current;
    if (!el) return;
    const hasMore = el.scrollHeight - el.scrollTop - el.clientHeight > 15;
    setCanScrollMore(hasMore);
  }, []);

  useEffect(() => {
    updateScrollFade();
    const el = scrollBodyRef.current;
    if (!el) return undefined;
    const resizeObserver = new ResizeObserver(() => {
      updateScrollFade();
    });
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [project.slug, language, updateScrollFade]);

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

  // Resolved technical skills list for non-PET projects
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
      window.location.hash = `#skills/${skill.group}?skill=${skill.id}`;
      onClose();
    }
  };

  const activePetItem = isPet ? petGalleryItems[selectedGalleryIndex] : null;

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
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Close button attached to the shell */}
        <button
          type="button"
          className="project-modal__close"
          aria-label={t('common.close')}
          onClick={onClose}
        >
          ×
        </button>

        {/* Body: the single scroll container */}
        <div
          ref={scrollBodyRef}
          className="project-modal__content"
          tabIndex={0}
          role="region"
          aria-label={t('projects.modalScrollLabel', 'Project details and media gallery')}
          onScroll={updateScrollFade}
        >
          {/* =========================================================
              TEXT COLUMN
             ========================================================= */}
          <div className="project-modal__details">
            {isPet ? (
              /* --- PET-SPECIFIC MODAL CONTENT --- */
              <div className="pet-modal">
                {/* 1. Eyebrow */}
                <p className="project-card__meta pet-modal__eyebrow">
                  {t('projects.pet.eyebrow', 'Solo project · 2024 – Present')}
                </p>

                {/* 2. Logo & Title */}
                {project.logo && (
                  <div className="project-modal__logo-icon" aria-hidden="true">
                    <img src={project.logo} alt="" />
                  </div>
                )}
                <h3 id="project-modal-title" className="project-modal__title pet-modal__title">
                  {projectTitle}
                </h3>

                {/* 3. Hook */}
                <p className="pet-modal__hook">
                  <MixedText
                    text={t(
                      'projects.pet.hook',
                      'A PET-bottle-to-filament machine with its own software platform, designed and built solo.'
                    )}
                    isRtl={isRtl}
                  />
                </p>

                {/* 4. Status Row */}
                <div className="pet-modal__status-row" aria-label="Project Status">
                  <div className="pet-modal__status-card">
                    <div className="pet-modal__status-header">
                      <Wrench size={15} className="pet-modal__status-icon" aria-hidden="true" />
                      <span>{t('projects.pet.status.machine.title', 'Machine')}</span>
                    </div>
                    <span className="pet-modal__status-val">
                      {t('projects.pet.status.machine.label', 'Working · 3rd iteration')}
                    </span>
                  </div>

                  <div className="pet-modal__status-card">
                    <div className="pet-modal__status-header">
                      <Server size={15} className="pet-modal__status-icon" aria-hidden="true" />
                      <span>{t('projects.pet.status.software.title', 'Software platform')}</span>
                    </div>
                    <span className="pet-modal__status-val">
                      {t('projects.pet.status.software.label', 'Built · runs on sample data')}
                    </span>
                  </div>

                  <div className="pet-modal__status-card pet-modal__status-card--planned">
                    <div className="pet-modal__status-header">
                      <Radio size={15} className="pet-modal__status-icon" aria-hidden="true" />
                      <span>{t('projects.pet.status.link.title', 'ESP32 + MQTT link')}</span>
                    </div>
                    <span className="pet-modal__status-val">
                      {t('projects.pet.status.link.label', 'Planned')}
                    </span>
                  </div>
                </div>

                {/* 5. Stat Chips */}
                <div className="pet-modal__chips" aria-label="Key specifications">
                  <span className="pet-modal__chip">
                    <bdi>{t('projects.pet.chips.temp', '245 °C PID target')}</bdi>
                  </span>
                  <span className="pet-modal__chip">
                    <bdi>{t('projects.pet.chips.micro', '1/16 microstepping, 3200 steps/rev')}</bdi>
                  </span>
                  <span className="pet-modal__chip">
                    {t('projects.pet.chips.iters', '3 hardware iterations')}
                  </span>
                  <span className="pet-modal__chip">
                    <bdi>{t('projects.pet.chips.endpoints', '13 REST endpoints')}</bdi>
                  </span>
                  <span className="pet-modal__chip">
                    {t('projects.pet.chips.repos', '4 repositories')}
                  </span>
                </div>

                {/* 6. Summary */}
                <p className="pet-modal__summary">
                  <MixedText
                    text={t(
                      'projects.pet.summary',
                      'An automated machine converting plastic bottles into 3D printer filament using PID-regulated heating (245 °C target) and microstepped extrusion with acceleration ramping, built with custom SolidWorks CAD and 3D-printed parts. Backed by a full software platform comprising a Symfony 7.4 (PHP 8.3) REST API with 13 endpoints and JWT authentication, alongside a React web dashboard and an Expo mobile app running on fixture data. An ESP32 bridge with MQTT telemetry and machine control is planned for the next development phase.'
                    )}
                    isRtl={isRtl}
                  />
                </p>

                {/* 7. Tech Stack Grouped by Layer */}
                <div className="pet-modal__stack-box">
                  <h4 className="pet-modal__section-title">
                    {t('projects.pet.stack.title', 'Tech Stack')}
                  </h4>
                  <div className="pet-modal__stack-list">
                    <div className="pet-modal__stack-layer">
                      <span className="pet-modal__stack-layer-name">
                        {t('projects.pet.stack.mechanical.label', 'Mechanical')}
                      </span>
                      <span className="pet-modal__stack-layer-val">
                        {t('projects.pet.stack.mechanical.value', 'SolidWorks, 3D printing')}
                      </span>
                    </div>

                    <div className="pet-modal__stack-layer">
                      <span className="pet-modal__stack-layer-name">
                        {t('projects.pet.stack.firmware.label', 'Firmware')}
                      </span>
                      <span className="pet-modal__stack-layer-val">
                        <bdi>
                          {t('projects.pet.stack.firmware.value', 'Arduino, C/C++, PID, stepper drivers')}
                        </bdi>
                      </span>
                    </div>

                    <div className="pet-modal__stack-layer">
                      <span className="pet-modal__stack-layer-name">
                        {t('projects.pet.stack.backend.label', 'Backend')}
                      </span>
                      <span className="pet-modal__stack-layer-val">
                        <bdi>
                          {t('projects.pet.stack.backend.value', 'PHP, Symfony, PostgreSQL, JWT')}
                        </bdi>
                      </span>
                    </div>

                    <div className="pet-modal__stack-layer">
                      <span className="pet-modal__stack-layer-name">
                        {t('projects.pet.stack.apps.label', 'Apps')}
                      </span>
                      <span className="pet-modal__stack-layer-val">
                        <bdi>
                          {t('projects.pet.stack.apps.value', 'React, Vite, React Native, Expo, TypeScript')}
                        </bdi>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 8. Repositories Block */}
                <div className="pet-modal__repos-box">
                  <h4 className="pet-modal__section-title">
                    {t('projects.pet.repos.title', 'Repositories')}
                  </h4>
                  <div className="pet-modal__repos-list">
                    <a
                      href={PET_REPOS.hardware}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pet-modal__repo-link"
                    >
                      <div className="pet-modal__repo-info">
                        <span className="pet-modal__repo-role">
                          {t('projects.pet.repos.hardware.label', 'Hardware & Firmware')}
                        </span>
                        <span className="pet-modal__repo-desc">
                          {t('projects.pet.repos.hardware.desc', 'Arduino firmware, SolidWorks CAD & 3D models')}
                        </span>
                      </div>
                      <ExternalLink size={15} className="pet-modal__repo-icon" aria-hidden="true" />
                    </a>

                    <a
                      href={PET_REPOS.backend}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pet-modal__repo-link"
                    >
                      <div className="pet-modal__repo-info">
                        <span className="pet-modal__repo-role">
                          {t('projects.pet.repos.backend.label', 'Backend API')}
                        </span>
                        <span className="pet-modal__repo-desc">
                          {t('projects.pet.repos.backend.desc', 'Symfony 7.4 REST API, PostgreSQL, JWT')}
                        </span>
                      </div>
                      <ExternalLink size={15} className="pet-modal__repo-icon" aria-hidden="true" />
                    </a>

                    <a
                      href={PET_REPOS.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pet-modal__repo-link"
                    >
                      <div className="pet-modal__repo-info">
                        <span className="pet-modal__repo-role">
                          {t('projects.pet.repos.web.label', 'Web Dashboard')}
                        </span>
                        <span className="pet-modal__repo-desc">
                          {t('projects.pet.repos.web.desc', 'React, Vite, TypeScript management UI')}
                        </span>
                      </div>
                      <ExternalLink size={15} className="pet-modal__repo-icon" aria-hidden="true" />
                    </a>

                    <a
                      href={PET_REPOS.mobile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pet-modal__repo-link"
                    >
                      <div className="pet-modal__repo-info">
                        <span className="pet-modal__repo-role">
                          {t('projects.pet.repos.mobile.label', 'Mobile App')}
                        </span>
                        <span className="pet-modal__repo-desc">
                          {t('projects.pet.repos.mobile.desc', 'React Native, Expo, TypeScript telemetry app')}
                        </span>
                      </div>
                      <ExternalLink size={15} className="pet-modal__repo-icon" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                {/* 9. Primary CTA */}
                <a
                  href={PET_HUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pet-modal__primary-cta"
                >
                  <FaGithub size={18} aria-hidden="true" />
                  <span>{t('projects.pet.cta', 'View project on GitHub')}</span>
                </a>
              </div>
            ) : (
              /* --- GENERIC PROJECT CONTENT (UNCHANGED) --- */
              <>
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

                {/* Skills Used Block */}
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
              </>
            )}
          </div>

          {/* =========================================================
              GALLERY COLUMN
             ========================================================= */}
          <div className="project-modal__gallery">
            {isPet ? (
              /* --- PET GALLERY COLUMN --- */
              <>
                <div className="project-modal__gallery-main pet-gallery__main">
                  <button
                    type="button"
                    className="project-modal__nav project-modal__nav--prev"
                    aria-label={`${t('common.previousPhoto')} - ${projectTitle}`}
                    onClick={() => {
                      activateManualSelection(
                        (selectedGalleryIndex - 1 + petGalleryItems.length) % petGalleryItems.length
                      );
                    }}
                  >
                    ‹
                  </button>

                  {/* Active Gallery Preview */}
                  <div className="pet-gallery__preview-area">
                    {activePetItem?.type === 'component' ? (
                      <div className="pet-gallery__component-wrapper">
                        <PetArchDiagram isRtl={isRtl} t={t} />
                      </div>
                    ) : (
                      <div
                        className={`pet-gallery__img-wrapper ${
                          activePetItem?.isPaperCard ? 'pet-gallery__img-wrapper--paper' : ''
                        }`}
                      >
                        <img
                          src={activePetItem?.src}
                          alt={activePetItem?.alt || projectTitle}
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="project-modal__nav project-modal__nav--next"
                    aria-label={`${t('common.nextPhoto')} - ${projectTitle}`}
                    onClick={() => {
                      activateManualSelection((selectedGalleryIndex + 1) % petGalleryItems.length);
                    }}
                  >
                    ›
                  </button>
                </div>

                {/* Caption */}
                {activePetItem?.caption && (
                  <p className="pet-gallery__caption">
                    <MixedText text={activePetItem.caption} isRtl={isRtl} />
                  </p>
                )}

                {/* Thumbnails Strip */}
                <div className="project-modal__thumbs pet-gallery__thumbs" aria-label="PET project gallery preview items">
                  {petGalleryItems.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`project-modal__thumb pet-gallery__thumb ${
                        index === selectedGalleryIndex ? 'is-active' : ''
                      }`}
                      aria-label={`${item.thumbLabel || item.alt} (${index + 1}/${petGalleryItems.length})`}
                      onClick={() => activateManualSelection(index)}
                    >
                      {item.type === 'component' ? (
                        <div className="pet-gallery__thumb-placeholder">
                          <Cpu size={24} aria-hidden="true" />
                          <span>{item.thumbLabel}</span>
                        </div>
                      ) : (
                        <img
                          src={item.src}
                          alt={item.alt}
                          loading="lazy"
                          className={item.isPaperCard ? 'pet-gallery__thumb-img--paper' : ''}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </>
            ) : hasPhotos ? (
              /* --- GENERIC GALLERY (UNCHANGED) --- */
              <>
                <div className="project-modal__gallery-main">
                  <button
                    type="button"
                    className="project-modal__nav project-modal__nav--prev"
                    aria-label={`${t('common.previousPhoto')} - ${projectTitle}`}
                    onClick={() => {
                      activateManualSelection(
                        (selectedGalleryIndex - 1 + genericPhotos.length) % genericPhotos.length
                      );
                    }}
                  >
                    ‹
                  </button>

                  <img
                    src={genericPhotos[selectedGalleryIndex]}
                    alt={`${projectTitle} - ${t('common.photo')} ${selectedGalleryIndex + 1}`}
                    loading="lazy"
                  />

                  <button
                    type="button"
                    className="project-modal__nav project-modal__nav--next"
                    aria-label={`${t('common.nextPhoto')} - ${projectTitle}`}
                    onClick={() => {
                      activateManualSelection((selectedGalleryIndex + 1) % genericPhotos.length);
                    }}
                  >
                    ›
                  </button>
                </div>

                <div className="project-modal__thumbs" aria-label={`${projectTitle} photo gallery`}>
                  {genericPhotos.map((photo, index) => (
                    <button
                      key={`${project.slug}-${index}`}
                      type="button"
                      className={`project-modal__thumb ${index === selectedGalleryIndex ? 'is-active' : ''}`}
                      aria-label={`${t('common.photo')} ${index + 1} - ${projectTitle}`}
                      onClick={() => activateManualSelection(index)}
                    >
                      <img
                        src={photo}
                        alt={`${projectTitle} ${t('common.photo')} ${index + 1}`}
                        loading="lazy"
                      />
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

        {/* Subtle bottom scroll fade indicator */}
        <div
          className={`project-modal__scroll-fade ${canScrollMore ? 'is-visible' : ''}`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
