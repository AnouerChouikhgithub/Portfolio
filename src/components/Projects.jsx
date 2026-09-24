import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';

const projects = [
  {
    slug: 'pet-filament-machine',
    title: 'PET Plastic Recycling to 3D Printer Filament System',
    meta: 'Solo project · 2024 – Present',
    preview: 'Turning plastic waste into usable filament through a custom extrusion system.',
    description: 'Independently designing and building an Arduino-based extrusion control system using PID temperature regulation (targeting 245°C) via a thermistor and PWM-driven heater, combined with a microstepping stepper driver (1/2 to 1/16 step, up to 3200 steps/revolution) for controlled filament extrusion with acceleration ramping. Refined across multiple iterations over several years of solo development — currently on the 3rd version.',
    role: null,
    tech: ['Arduino', 'PID Control', 'Thermistor', 'PWM', 'Stepper Driver','Mechanical Design'],
    githubUrl: 'https://github.com/AnouerChouikhgithub/pet-recycling-filament-system',
    photos: [],
  },
  {
    slug: 'neurofocus',
    title: 'NeuroFocus — Wearable Physiological Monitoring System for Children',
    meta: '2026',
    preview: 'A child-focused wearable that tracks physiological signals in real time.',
    description: 'Wired sensor electronics and implemented I2C communication to interface a MAX30100 pulse oximeter and MPU6050 accelerometer/gyroscope with an ESP32, alongside a GSR sensor for skin conductance. Developed firmware to read heart rate, RR interval, motion, and skin conductance data and transmit it via Wi-Fi to Firebase Realtime Database every second in JSON format for remote monitoring.',
    role: null,
    tech: ['ESP32', 'I2C', 'MAX30100', 'MPU6050', 'Firebase'],
    githubUrl: 'https://github.com/AnouerChouikhgithub/NeuroFocus.git',
    photos: [],
  },
  {
    slug: 'carthago',
    title: 'Carthago — AI Waste Collection Robot',
    meta: '2024',
    preview: 'An autonomous waste-collection concept built around smart robotics and design.',
    description: 'Designed and fabricated the mechanical prototype body and assembled structural components for an autonomous waste-detection-and-collection robot concept, working within a 4-person team — two teammates handled computer vision and Raspberry Pi–based control integration.',
    role: 'My role: mechanical design & fabrication',
    tech: ['Mechanical Design', 'Prototyping', 'Team Project'],
    githubUrl: '',
    photos: [],
  },
  {
    slug: 'fighter-robot',
    title: 'Fighter Robot',
    meta: null,
    preview: 'A competitive combat robot built for performance and control.',
    description: 'Robotics competition combat robot.',
    role: null,
    tech: [],
    githubUrl: '',
    photos: [],
  },
  {
    slug: 'all-terrain-robot',
    title: 'All-Terrain Robot',
    meta: null,
    preview: 'A rugged robot designed to navigate tough and uneven ground.',
    description: 'A rugged 4-motor robot built for uneven ground, with two independent BTS7960 (IBT_2) high-current motor drivers (one per side) for stronger torque than a standard L298N setup. Available in three control variants: ESP32 with built-in Bluetooth, Arduino with an HC-05 Bluetooth module, and Arduino with a wired PS2 controller for direct tank-style control.',
    role: null,
    tech: ['RC Robot', 'Competition Build', 'Arduino', 'ESP32', 'Bluetooth', 'PS2 Controller'],
    githubUrl: 'https://github.com/AnouerChouikhgithub/All-Terrain-Robot.git',
    photos: [],
  },
  {
    slug: 'line-follower-robot',
    title: 'Line-Follower Robot',
    meta: null,
    preview: 'An autonomous robot that follows a guided path with precision.',
    description: 'An Arduino UNO line following robot using five analog IR sensors and a PID controller for smooth, non-oscillating tracking. Includes an automatic sensor calibration routine and line-recovery behaviour when the track is lost.',
    role: null,
    tech: ['Arduino', 'PID Control', 'IR Sensors', 'Competition Build'],
    githubUrl: 'https://github.com/AnouerChouikhgithub/Line-Folower-Robot.git',
    photos: [],
  },  
  {
    slug: 'junior-robot',
    title: 'Junior Robot',
    meta: '2022',
    preview: 'A compact RC robot built for the junior track challenge at FSB SmarTech.',
    description: 'A 4-wheel drive RC car controlled over Bluetooth, built in two hardware variants: an Arduino Uno + HC-05 version, and a standalone ESP32 version using its built-in Bluetooth — no external Bluetooth module required.',
    role: 'Junior Challenge robot',
    tech: ['RC Robot', 'Mechanical Design', 'Competition Build'],
    githubUrl: 'https://github.com/AnouerChouikhgithub/Junior-Robot.git',
    photos: [],
  }
];

function ProjectModal({ project, onClose }) {
  const { t } = useI18n();
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const lastUserActionRef = useRef(0);
  const hasPhotos = Array.isArray(project.photos) && project.photos.length > 0;
  const hasGithubUrl = typeof project.githubUrl === 'string' && project.githubUrl.trim().length > 0;

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

  return (
    <div className="project-modal" onClick={onClose}>
      <div
        className="project-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onClick={(event) => event.stopPropagation()}
        ref={modalRef}
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
            <p className="project-card__meta">{project.meta || t('common.dateTbd')}</p>
            <h3 id="project-modal-title" className="project-modal__title">
              {project.title}
            </h3>

            {project.role && <p className="project-modal__role">{project.role}</p>}

            <p className="project-modal__description">{project.description}</p>

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
                <div
                  className="project-modal__gallery-main"
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  <button
                    type="button"
                    className="project-modal__nav project-modal__nav--prev"
                    aria-label={`Previous photo for ${project.title}`}
                    onClick={() => {
                      activateManualSelection((selectedPhotoIndex - 1 + project.photos.length) % project.photos.length);
                    }}
                  >
                    ‹
                  </button>

                  <img
                    src={project.photos[selectedPhotoIndex]}
                    alt={`${project.title} photo ${selectedPhotoIndex + 1}`}
                  />

                  <button
                    type="button"
                    className="project-modal__nav project-modal__nav--next"
                    aria-label={`Next photo for ${project.title}`}
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
                      aria-label={`View photo ${index + 1} for ${project.title}`}
                      onClick={() => activateManualSelection(index)}
                    >
                      <img src={photo} alt={`${project.title} thumbnail ${index + 1}`} />
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
  const { t } = useI18n();
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
        {projects.map((project) => (
          <button
            type="button"
            key={project.slug}
            className="project-card"
            aria-haspopup="dialog"
            aria-expanded={activeProject?.slug === project.slug}
            onClick={() => setActiveProject(project)}
          >
            <span className="project-card__meta">{project.meta || t('common.dateTbd')}</span>
            <h3 className="project-card__title">{project.title}</h3>
            <p className="project-card__description">{project.preview || project.description}</p>
          </button>
        ))}
      </div>

      {activeProject && <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />}
    </div>
  );
}
