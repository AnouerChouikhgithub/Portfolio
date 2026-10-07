import React, { useEffect, useRef, useMemo } from 'react';
import {
  Wrench,
  Server,
  Radio,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import WebpImage from './WebpImage';
import { FaGithub } from 'react-icons/fa';
import { useI18n } from '../i18n/I18nProvider';
import { useTheme } from '../theme/ThemeProvider';
import MixedText from './MixedText';
import PetArchDiagram from './PetArchDiagram';
import AnimatedCountText from './AnimatedCountText';
import ModalWordReveal from './ModalWordReveal';
import useModalAccessibility from '../hooks/useModalAccessibility';
import CinematicGallery from './gallery/CinematicGallery';
import useModalReveals from '../hooks/useModalReveals';
import { getSkillById, getGroupForSkill } from '../data/portfolio-data';
import { PET_REPOS, PET_HUB_URL } from '../data/pet-repos';

export default function ProjectModal({ project, onClose, onOpenSkillGroup }) {
  const { t, isRtl, language } = useI18n();
  const { theme } = useTheme();
  const modalRef = useRef(null);

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
        // A dense diagram cannot be read in 1.5 s — 4.5 s dwell (documented decision).
        dwellMs: 4500,
        caption: t('projects.pet.gallery.arch.caption'),
        alt: t('projects.pet.gallery.arch.alt'),
        thumbLabel: t('projects.pet.arch.title', 'Architecture'),
      },
      {
        id: 'pet-wiring',
        // TODO(owner): replace after the schematic update
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
  const carouselItems = isPet ? petGalleryItems : genericPhotos;
  const selectedGalleryIndexRef = useRef(0);
  const galleryCount = carouselItems.length;
  const hasPhotos = galleryCount > 0;
  const hasGithubUrl = typeof project.githubUrl === 'string' && project.githubUrl.trim().length > 0;

  const handleGalleryIndexChange = (i) => { selectedGalleryIndexRef.current = i; };

  // Reset scroll and selection on project or language change
  useEffect(() => {
    modalRef.current?.querySelectorAll('.modal-scroll-region').forEach((region) => {
      region.scrollTop = 0;
    });
  }, [project.slug, language]);

  useModalReveals(modalRef, project.slug);

  // (Keyboard arrows + Space for the gallery are handled inside CinematicGallery
  // on the stage; window-level interception was removed to avoid double skips and
  // to keep Escape/Tab trap semantics in useModalAccessibility intact.)

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

  // PET captions flip with the active gallery item (kept via ref so the
  // autoplay engine owns the index exclusively).
  const activePetCaption = isPet && hasPhotos
    ? petGalleryItems[selectedGalleryIndexRef.current]?.caption ?? null
    : null;

  return (
    // The wrapper/backdrop/backdrop-click close now live in overlay/SubScreen;
    // this component renders only the panel whose surface keeps per-project
    // colors and current layout.
    <div
      className="project-modal__panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
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

        {/* Desktop columns scroll independently; mobile uses this shared scroll area. */}
        <div
          className="project-modal__content"
          tabIndex={0}
          role="region"
          aria-label={t('projects.modalScrollLabel', 'Project details and media gallery')}
        >
          {/* =========================================================
              TEXT COLUMN
             ========================================================= */}
          <div className="project-modal__details modal-scroll-region">
            {isPet ? (
              /* --- PET-SPECIFIC MODAL CONTENT --- */
              <div className="pet-modal">
                {/* 1. Eyebrow */}
                <p className="project-card__meta pet-modal__eyebrow modal-reveal">
                  {t('projects.pet.eyebrow', 'Solo project · 2024 – Present')}
                </p>

                {/* 2. Logo & Title */}
                {project.logo && (
                  <div className="project-modal__logo-icon" aria-hidden="true">
                    <WebpImage src={project.logo} alt="" />
                  </div>
                )}
                <h3 id="project-modal-title" className="project-modal__title pet-modal__title modal-reveal modal-reveal--word-title" aria-label={projectTitle}>
                  <ModalWordReveal text={projectTitle} />
                </h3>

                {/* 3. Hook */}
                <p className="pet-modal__hook modal-reveal">
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
                  <div className="pet-modal__status-card modal-reveal modal-reveal--scale">
                    <div className="pet-modal__status-header">
                      <Wrench size={15} className="pet-modal__status-icon" aria-hidden="true" />
                      <span>{t('projects.pet.status.machine.title', 'Machine')}</span>
                    </div>
                    <span className="pet-modal__status-val">
                      {t('projects.pet.status.machine.label', 'Working · 3rd iteration')}
                    </span>
                  </div>

                  <div className="pet-modal__status-card modal-reveal modal-reveal--scale">
                    <div className="pet-modal__status-header">
                      <Server size={15} className="pet-modal__status-icon" aria-hidden="true" />
                      <span>{t('projects.pet.status.software.title', 'Software platform')}</span>
                    </div>
                    <span className="pet-modal__status-val">
                      {t('projects.pet.status.software.label', 'Built · MQTT tested locally')}
                    </span>
                  </div>

                  <div className="pet-modal__status-card pet-modal__status-card--planned modal-reveal modal-reveal--scale">
                    <div className="pet-modal__status-header">
                      <Radio size={15} className="pet-modal__status-icon" aria-hidden="true" />
                      <span>{t('projects.pet.status.link.title', 'ESP32 GATEWAY')}</span>
                    </div>
                    <span className="pet-modal__status-val">
                      {t('projects.pet.status.link.label', 'In progress · bench wiring')}
                    </span>
                  </div>
                </div>

                {/* Status recency note */}
                <p className="project-card__meta pet-modal__eyebrow modal-reveal">
                  {t('projects.pet.statusAsOf', 'Status as of October 2026')}
                </p>

                {/* 5. Stat Chips */}
                <div className="pet-modal__chips" aria-label="Key specifications">
                  <span className="pet-modal__chip modal-reveal modal-reveal--scale">
                    <bdi><AnimatedCountText text={t('projects.pet.chips.temp', '245 °C PID target')} /></bdi>
                  </span>
                  <span className="pet-modal__chip modal-reveal modal-reveal--scale">
                    <bdi><AnimatedCountText text={t('projects.pet.chips.micro', 'Microstepping up to 1/16')} /></bdi>
                  </span>
                  <span className="pet-modal__chip modal-reveal modal-reveal--scale">
                    <AnimatedCountText text={t('projects.pet.chips.iters', '3 hardware iterations')} />
                  </span>
                  <span className="pet-modal__chip modal-reveal modal-reveal--scale">
                    <bdi><AnimatedCountText text={t('projects.pet.chips.endpoints', '15 REST endpoints')} /></bdi>
                  </span>
                  <span className="pet-modal__chip modal-reveal modal-reveal--scale">
                    <AnimatedCountText text={t('projects.pet.chips.repos', '4 repositories')} />
                  </span>
                </div>

                {/* 6. Summary */}
                <p className="pet-modal__summary modal-reveal">
                  <MixedText
                    text={t(
                      'projects.pet.summary',
                      'An automated machine that turns PET bottles into 3D printer filament: PID-regulated heating (245 °C target), microstepped extrusion with acceleration ramping, custom SolidWorks CAD and 3D-printed parts. A software platform backs it: a Symfony 7.4 (PHP 8.3) REST API with JWT and refresh-token authentication, per-user machine ownership, per-machine device tokens and a command audit trail, plus a React web dashboard and an Expo mobile app on seeded demo data. The backend\u2019s MQTT integration (Mosquitto broker, telemetry consumer, expiring QoS 1 commands, per-device ACLs) is verified on a local broker with manual test messages. Next: an ESP32 gateway, wired on the bench, to connect the machine itself.'
                    )}
                    isRtl={isRtl}
                  />
                </p>

                {/* 7. Tech Stack Grouped by Layer */}
                <div className="pet-modal__stack-box modal-reveal">
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
                          {t('projects.pet.stack.firmware.value', 'Arduino Mega, C/C++, PID, stepper drivers, ESP32 (in development)')}
                        </bdi>
                      </span>
                    </div>

                    <div className="pet-modal__stack-layer">
                      <span className="pet-modal__stack-layer-name">
                        {t('projects.pet.stack.backend.label', 'Backend')}
                      </span>
                      <span className="pet-modal__stack-layer-val">
                        <bdi>
                          {t('projects.pet.stack.backend.value', 'PHP, Symfony, PostgreSQL, JWT, MQTT (Mosquitto), Docker')}
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
                <div className="pet-modal__repos-box modal-reveal">
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
                <p className="project-card__meta modal-reveal">{projectMeta || t('common.dateTbd')}</p>
                {project.logo && (
                  <div className="project-modal__logo-icon" aria-hidden="true">
                    <WebpImage src={project.logo} alt="" />
                  </div>
                )}
                <h3 id="project-modal-title" className="project-modal__title modal-reveal modal-reveal--word-title" aria-label={projectTitle}>
                  <ModalWordReveal text={projectTitle} />
                </h3>

                {projectRole && (
                  <p className="project-modal__role modal-reveal">
                    <MixedText text={projectRole} isRtl={isRtl} />
                  </p>
                )}

                <p className="project-modal__description modal-reveal">
                  <MixedText text={projectDescription} isRtl={isRtl} />
                </p>

                {/* Skills Used Block */}
                {(technicalSkillsList.length > 0 || softSkillsList.length > 0) && (
                  <div className="project-modal__skills-block modal-reveal">
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
                    className="project-modal__link modal-reveal"
                  >
                    {t('common.viewGithub')}
                  </a>
                ) : (
                  <span className="project-modal__link project-modal__link--disabled modal-reveal" aria-disabled="true">
                    {t('common.githubUnavailable')}
                  </span>
                )}
              </>
            )}
          </div>

          {/* =========================================================
              GALLERY COLUMN (shared CinematicGallery — Blueprint HUD)
             ========================================================= */}
          <div className="project-modal__gallery modal-scroll-region">
            {hasPhotos ? (
              <CinematicGallery
                items={carouselItems}
                variant="project"
                altBuilder={(item, i) => (
                  typeof item === 'object' && item?.alt ? item.alt : `${projectTitle} - ${t('common.photo')} ${i + 1}`
                )}
                labels={{
                  play: t('common.play'),
                  pause: t('common.pause'),
                  prev: t('common.previousPhoto'),
                  next: t('common.nextPhoto'),
                  viewPhoto: t('common.viewPhoto'),
                  stage: `${projectTitle} — ${t('sections.projects')}`,
                  thumbStrip: `${projectTitle} photo gallery`,
                }}
                onIndexChange={handleGalleryIndexChange}
                className="project-cine"
                renderSlideOverlay={(item, i, layer) => {
                  if (layer !== 'in') return null;
                  if (typeof item === 'object' && item?.type === 'component') {
                    return (
                      <div className="pet-gallery__component-wrapper">
                        <PetArchDiagram isRtl={isRtl} t={t} />
                      </div>
                    );
                  }
                  return null;
                }}
              />
            ) : (
              <div className="project-modal__empty">
                <span>{t('common.noPhotos')}</span>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
