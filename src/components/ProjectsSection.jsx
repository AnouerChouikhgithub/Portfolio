import React, { useState, useEffect, useCallback } from "react";
import { Github, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * REPLACE BEFORE SHIPPING:
 * Every project below has `photos: []` and `githubUrl: ""` left empty —
 * fill these in with your real image paths/URLs and repo links.
 * Nothing in this file invents content: descriptions marked (CV-aligned)
 * mirror your finalized CV text exactly. The four projects marked
 * "NEEDS REAL DESCRIPTION" only have your original one-line taglines —
 * write a real paragraph for each before this goes live, the same way
 * the top three were written.
 * ─────────────────────────────────────────────────────────────────────────
 */

const PROJECTS = [
  {
    title: "PET Plastic Recycling to 3D Printer Filament System",
    meta: "Solo project · 2024 – Present",
    description:
      "Independently designing and building an Arduino-based extrusion control system using PID temperature regulation (targeting 245°C) via a thermistor and PWM-driven heater, combined with a microstepping stepper driver (1/2 to 1/16 step, up to 3200 steps/revolution) for controlled filament extrusion with acceleration ramping. Refined across multiple iterations over several years of solo development — currently on the 3rd version.",
    tech: ["Arduino", "PID Control", "Thermistor", "PWM", "Stepper Driver"],
    role: null,
    photos: [], // TODO: add real photos of the extruder/prototype
    githubUrl: "", // TODO: add repo link
  },
  {
    title: "NeuroFocus — Wearable Physiological Monitoring System for Children",
    meta: "2026",
    description:
      "Wired sensor electronics and implemented I2C communication to interface a MAX30100 pulse oximeter and MPU6050 accelerometer/gyroscope with an ESP32, alongside a GSR sensor for skin conductance. Developed firmware to read heart rate, RR interval, motion, and skin conductance data and transmit it via Wi-Fi to Firebase Realtime Database every second in JSON format for remote monitoring.",
    tech: ["ESP32", "I2C", "MAX30100", "MPU6050", "Firebase"],
    role: null,
    photos: [], // TODO: add real photos of the wearable/wiring
    githubUrl: "", // TODO: add repo link
  },
  {
    title: "Carthago — AI Waste Collection Robot",
    meta: "2024",
    description:
      "Designed and fabricated the mechanical prototype body and assembled structural components for an autonomous waste-detection-and-collection robot concept, working within a 4-person team — two teammates handled computer vision and Raspberry Pi–based control integration.",
    tech: ["Mechanical Design", "Prototyping", "Team Project"],
    role: "My role: mechanical design & fabrication",
    photos: [], // TODO: add real photos of the robot body
    githubUrl: "", // TODO: add repo link (or omit this button if the mechanical side has no repo)
  },
  {
    title: "Smart House",
    meta: "NEEDS REAL DESCRIPTION",
    description:
      "IoT-based intelligent home automation system.", // placeholder — replace with a real paragraph
    tech: [],
    role: null,
    photos: [],
    githubUrl: "",
  },
  {
    title: "All-Terrain Robot",
    meta: "NEEDS REAL DESCRIPTION",
    description:
      "Adaptable mobile robot for rough terrain navigation.", // placeholder — replace with a real paragraph
    tech: [],
    role: null,
    photos: [],
    githubUrl: "",
  },
  {
    title: "Fighter Robot",
    meta: "NEEDS REAL DESCRIPTION",
    description:
      "Robotics competition combat robot.", // placeholder — replace with a real paragraph
    tech: [],
    role: null,
    photos: [],
    githubUrl: "",
  },
  {
    title: "Line-Follower Robot",
    meta: "NEEDS REAL DESCRIPTION",
    description:
      "Autonomous robot that follows a black path.", // placeholder — replace with a real paragraph
    tech: [],
    role: null,
    photos: [],
    githubUrl: "",
  },
];

function Lightbox({ project, onClose }) {
  const [index, setIndex] = useState(0);
  const count = project.photos.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % Math.max(count, 1)), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + Math.max(count, 1)) % Math.max(count, 1)), [count]);

  useEffect(() => {
    setIndex(0);
  }, [project.title]);

  useEffect(() => {
    if (count <= 1) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setIndex((currentIndex) => (currentIndex + 1) % count);
    }, 2000);

    return () => window.clearTimeout(timerId);
  }, [count, index]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, next, prev]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(4,6,11,0.88)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 p-2 rounded-full"
        style={{ color: "#8993a8" }}
      >
        <X size={22} />
      </button>

      <div
        className="w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full aspect-video flex items-center justify-center border"
          style={{ borderColor: "#1c2536", background: "#0d1220" }}
        >
          {count > 0 ? (
            <img
              src={project.photos[index]}
              alt={`${project.title} photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-3" style={{ color: "#4a5468" }}>
              <ImageIcon size={32} strokeWidth={1.25} />
              <span className="text-sm">No photos added yet</span>
            </div>
          )}

          {count > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full"
                style={{ background: "rgba(6,9,17,0.6)", color: "#eef2f8" }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full"
                style={{ background: "rgba(6,9,17,0.6)", color: "#eef2f8" }}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <h3 className="text-base font-semibold" style={{ color: "#eef2f8" }}>
            {project.title}
          </h3>
          {count > 0 && (
            <span className="text-sm" style={{ color: "#8993a8" }}>
              {index + 1} / {count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectRow({ project, index }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const reversed = index % 2 === 1;
  const photoCount = project.photos.length;

  return (
    <div
      className="py-12 md:py-16 border-t first:border-t-0"
      style={{ borderColor: "#1c2536" }}
    >
      <div
        className={`flex flex-col gap-8 md:gap-12 md:items-center ${
          reversed ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        {/* Photo stage */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="w-full md:w-5/12 text-left"
          aria-label={`View photos for ${project.title}`}
        >
          <div
            className="relative w-full aspect-[4/3] border flex items-center justify-center overflow-hidden group"
            style={{ borderColor: "#1c2536", background: "#0d1220" }}
          >
            {photoCount > 0 ? (
              <img
                src={project.photos[0]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg width="100%" height="100%" className="absolute inset-0" style={{ opacity: 0.35 }}>
                <defs>
                  <pattern id={`diag-${index}`} width="14" height="14" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="14" stroke="#1c2536" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#diag-${index})`} />
              </svg>
            )}
            <div
              className="relative flex items-center gap-2 px-3 py-2 text-sm"
              style={{ color: photoCount > 0 ? "#eef2f8" : "#4a5468", background: photoCount > 0 ? "rgba(6,9,17,0.55)" : "transparent" }}
            >
              <ImageIcon size={16} strokeWidth={1.5} />
              <span>{photoCount > 0 ? `View photos (${photoCount})` : "Add photos"}</span>
            </div>
          </div>
        </button>

        {/* Content */}
        <div className="w-full md:w-7/12">
          <h3 className="text-xl font-semibold mb-1" style={{ color: "#eef2f8" }}>
            {project.title}
          </h3>
          <p className="text-sm mb-4" style={{ color: "#5b6478" }}>
            {project.meta}
          </p>

          {project.role && (
            <p
              className="inline-block text-sm px-2.5 py-1 mb-4 border"
              style={{ color: "#22d3ee", borderColor: "#173238" }}
            >
              {project.role}
            </p>
          )}

          <p className="text-[15px] leading-relaxed mb-5" style={{ color: "#b7bfd0" }}>
            {project.description}
          </p>

          {project.tech.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-1 border"
                  style={{ color: "#8993a8", borderColor: "#1c2536" }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 border"
                style={{ color: "#eef2f8", borderColor: "#22d3ee" }}
              >
                <Github size={16} />
                GitHub
              </a>
            ) : (
              <span
                className="inline-flex items-center gap-2 text-sm px-4 py-2 border"
                style={{ color: "#4a5468", borderColor: "#1c2536" }}
              >
                <Github size={16} />
                Repo link needed
              </span>
            )}
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox project={project} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section className="w-full min-h-screen px-6 md:px-12 py-16" style={{ background: "#060911" }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-3" style={{ color: "#eef2f8" }}>
          Projects
        </h2>
        <p className="text-[15px] mb-2" style={{ color: "#8993a8" }}>
          A working record of what I've built, solo and in teams.
        </p>

        <div>
          {PROJECTS.map((p, i) => (
            <ProjectRow key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
