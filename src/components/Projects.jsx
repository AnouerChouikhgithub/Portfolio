import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import MixedText from './MixedText';

const ACCENT_COLORS = {
  green:  '#22c55e',
  cyan:   '#06b6d4',
  purple: '#a855f7',
  red:    '#ef4444',
  amber:  '#f59e0b',
  blue:   '#3b82f6',
  yellow: '#eab308',
};

const BG_COLORS = {
  green:  '#052e16',
  cyan:   '#083344',
  purple: '#2e1065',
  red:    '#450a0a',
  amber:  '#451a03',
  blue:   '#172554',
  yellow: '#422006',
};

const projects = [
  {
    slug: 'pet-filament-machine',
    title: 'PET Plastic Recycling to 3D Printer Filament System',
    tech: ['Arduino', 'PID Control', 'Thermistor', 'PWM', 'Stepper Driver', 'Mechanical Design'],
    githubUrl: 'https://github.com/AnouerChouikhgithub/pet-recycling-filament-system',
    photos: [
      "/Projects/PET-Recycling-Filament-System/Capture%20d'%C3%A9cran%202026-09-28%20145437.png",
      "/Projects/PET-Recycling-Filament-System/Schematic%20Diagram.jpg",
    ],
    logo: '/Projects/logos/PET Plastic Recycling.svg',
    accent: ACCENT_COLORS.green,
    bg: BG_COLORS.green,
  },
  {
    slug: 'neurofocus',
    title: 'NeuroFocus — Wearable Physiological Monitoring System for Children',
    tech: ['ESP32', 'I2C', 'MAX30100', 'MPU6050', 'Firebase'],
    githubUrl: 'https://github.com/AnouerChouikhgithub/NeuroFocus.git',
    photos: ["/Projects/NeuroFocus/wiring-diagram.jpg"],
    logo: '/Projects/logos/NeuroFocus.svg',
    accent: ACCENT_COLORS.cyan,
    bg: BG_COLORS.cyan,
  },
  {
    slug: 'carthago',
    title: 'Carthago — AI Waste Collection Robot',
    tech: ['Mechanical Design', 'Prototyping', 'Team Project'],
    githubUrl: '',
    photos: [],
    logo: '/Projects/logos/Carthago.svg',
    accent: ACCENT_COLORS.purple,
    bg: BG_COLORS.purple,
  },
  {
    slug: 'fighter-robot',
    title: 'Fighter Robot',
    tech: [],
    githubUrl: '',
    photos: [],
    logo: '/Projects/logos/Fighter Robot.svg',
    accent: ACCENT_COLORS.red,
    bg: BG_COLORS.red,
  },
  {
    slug: 'all-terrain-robot',
    title: 'All-Terrain Robot',
    tech: ['RC Robot', 'Competition Build', 'Arduino', 'ESP32', 'Bluetooth', 'PS2 Controller'],
    githubUrl: 'https://github.com/AnouerChouikhgithub/All-Terrain-Robot.git',
    photos: [
      "/Projects/All%20Terrain/app-screenshot.jfif",
      "/Projects/All%20Terrain/off-road-military-robot-action-camera-mount-main-450x500.jpg",
      "/Projects/All%20Terrain/Schematic-Diagram-Arduino-Bluetooth-Version.jpg",
      "/Projects/All%20Terrain/Schematic-Diagram-Arduino-PS2-Controller-Version.jpg",
      "/Projects/All%20Terrain/Schematic-Diagram-ESP32Version.jpg",
    ],
    logo: '/Projects/logos/All-Terrain-Robot.svg',
    accent: ACCENT_COLORS.amber,
    bg: BG_COLORS.amber,
  },
  {
    slug: 'line-follower-robot',
    title: 'Line-Follower Robot',
    tech: ['Arduino', 'PID Control', 'IR Sensors', 'Competition Build'],
    githubUrl: 'https://github.com/AnouerChouikhgithub/Line-Folower-Robot.git',
    photos: [
      "/Projects/Line%20Follower/images%20(1).jfif",
      "/Projects/Line%20Follower/Schematic-Diagram-Arduino.jpg",
    ],
    logo: '/Projects/logos/Line-Follower Robot.svg',
    accent: ACCENT_COLORS.blue,
    bg: BG_COLORS.blue,
  },
  {
    slug: 'junior-robot',
    title: 'Junior Robot',
    tech: ['RC Robot', 'Mechanical Design', 'Competition Build'],
    githubUrl: 'https://github.com/AnouerChouikhgithub/Junior-Robot.git',
    photos: [
      "/Projects/Junior/app-screenshot.jfif",
      "/Projects/Junior/images.jfif",
      "/Projects/Junior/Schematic-Diagram-ArduinoVersion.jpg",
      "/Projects/Junior/Schematic-Diagram-ESP32Version.jpg",
    ],
    logo: '/Projects/logos/Junior Robot.svg',
    accent: ACCENT_COLORS.yellow,
    bg: BG_COLORS.yellow,
  }
];

function ProjectModal({ project, onClose }) {
  const { t, isRtl } = useI18n();
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const lastUserActionRef = useRef(0);
  const hasPhotos = Array.isArray(project.photos) && project.photos.length > 0;
  const hasGithubUrl = typeof project.githubUrl === 'string' && project.githubUrl.trim().length > 0;

  const projectMeta = t(`projects.items.${project.slug}.meta`, '');
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

  useEffect(() => {
    const previousActiveElement = document.activeElement;
    const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    document.body.style.overflow = 'hidden';

    const focusFirst = () => {
      const focusable = modalRef.current?.querySelectorAll(focusableSelectors);
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }
    };

    focusFirst();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) {
        return;
      }

      const focusable = Array.from(
        modalRef.current.querySelectorAll(focusableSelectors)
      );

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [onClose]);

  const accentStyle = {
    ...(project.accent ? { '--accent': project.accent } : {}),
    ...(project.bg    ? { background: project.bg }      : {}),
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
          ref={closeButtonRef}
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
              {project.title}
            </h3>

            {projectRole && (
              <p className="project-modal__role">
                <MixedText text={projectRole} isRtl={isRtl} />
              </p>
            )}

            <p className="project-modal__description">
              <MixedText text={projectDescription} isRtl={isRtl} />
            </p>

            {project.tech.length > 0 && (
              <ul className="project-modal__tags" aria-label={`${project.title} technology stack`}>
                {project.tech.map((item) => (
                  <li key={item} className="project-modal__tag">
                    {item}
                  </li>
                ))}
              </ul>
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
                    aria-label={`${t('common.previousPhoto')} - ${project.title}`}
                    onClick={() => {
                      activateManualSelection((selectedPhotoIndex - 1 + project.photos.length) % project.photos.length);
                    }}
                  >
                    ‹
                  </button>

                  <img
                    src={project.photos[selectedPhotoIndex]}
                    alt={`${project.title} - ${t('common.photo')} ${selectedPhotoIndex + 1}`}
                  />

                  <button
                    type="button"
                    className="project-modal__nav project-modal__nav--next"
                    aria-label={`${t('common.nextPhoto')} - ${project.title}`}
                    onClick={() => {
                      activateManualSelection((selectedPhotoIndex + 1) % project.photos.length);
                    }}
                  >
                    ›
                  </button>
                </div>

                <div className="project-modal__thumbs" aria-label={`${project.title} photo gallery`}>
                  {project.photos.map((photo, index) => (
                    <button
                      key={`${project.slug}-${index}`}
                      type="button"
                      className={`project-modal__thumb ${index === selectedPhotoIndex ? 'is-active' : ''}`}
                      aria-label={`${t('common.photo')} ${index + 1} - ${project.title}`}
                      onClick={() => activateManualSelection(index)}
                    >
                      <img src={photo} alt={`${project.title} ${t('common.photo')} ${index + 1}`} />
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

export default function Projects() {
  const { t, isRtl } = useI18n();
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const syncProjectFromHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith('#project-')) {
        return;
      }

      const slug = hash.replace('#project-', '');
      const matchedProject = projects.find((project) => project.slug === slug);

      if (matchedProject) {
        setActiveProject(matchedProject);
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    syncProjectFromHash();
    window.addEventListener('hashchange', syncProjectFromHash);

    return () => window.removeEventListener('hashchange', syncProjectFromHash);
  }, []);

  return (
    <div id="projects" className="container projects">
      <h2 className="section__title">{t('sections.projects')}</h2>

      <div className="projects__grid">
        {projects.map((project) => {
          const meta = t(`projects.items.${project.slug}.meta`, '');
          const preview = t(`projects.items.${project.slug}.preview`, '');
          const description = t(`projects.items.${project.slug}.description`, '');

          return (
            <button
              type="button"
              key={project.slug}
              className="project-card"
              aria-haspopup="dialog"
              aria-expanded={activeProject?.slug === project.slug}
              onClick={() => setActiveProject(project)}
            >
              {project.logo && (
                <img
                  className="project-card__logo"
                  src={project.logo}
                  alt={`${project.title} ${t('common.logo')}`}
                  loading="lazy"
                />
              )}
              <span className="project-card__meta">{meta || t('common.dateTbd')}</span>
              <h3 className="project-card__title" style={project.accent ? { color: project.accent } : {}}>{project.title}</h3>
              <p className="project-card__description">
                <MixedText text={preview || description} isRtl={isRtl} />
              </p>
            </button>
          );
        })}
      </div>

      {activeProject && <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />}
    </div>
  );
}
