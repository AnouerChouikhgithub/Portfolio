import { PET_HUB_URL } from './pet-repos';

export const ACCENT_COLORS = {
  green:  '#22c55e',
  cyan:   '#06b6d4',
  purple: '#a855f7',
  red:    '#ef4444',
  amber:  '#f59e0b',
  blue:   '#3b82f6',
  yellow: '#eab308',
};

export const BG_COLORS = {
  dark: {
    green:  '#052e16',
    cyan:   '#083344',
    purple: '#2e1065',
    red:    '#450a0a',
    amber:  '#451a03',
    blue:   '#172554',
    yellow: '#422006',
  },
  light: {
    green:  '#bbf7d0',
    cyan:   '#a5f3fc',
    purple: '#e9d5ff',
    red:    '#fecaca',
    amber:  '#fde68a',
    blue:   '#bfdbfe',
    yellow: '#fef08a',
  },
};

export const GROUPS = [
  { id: 'embedded-iot', title: 'Embedded/IoT', icon: 'Cpu', color: '#06b6d4' },
  { id: 'hardware',     title: 'Hardware',     icon: 'Wrench', color: '#a855f7' },
  { id: 'web-mobile',   title: 'Web/Mobile',   icon: 'Globe', color: '#3b82f6' },
  { id: 'programming',  title: 'Programming',  icon: 'Code', color: '#22c55e' },
  { id: 'tools-devops', title: 'Tools/DevOps', icon: 'GitBranch', color: '#f59e0b' },
  { id: 'data-cloud',   title: 'Data/Cloud',   icon: 'Cloud', color: '#eab308' },
];

export const SKILLS = [
  // Embedded/IoT
  { id: 'arduino',        name: 'Arduino',          group: 'embedded-iot' },
  { id: 'esp32',          name: 'ESP32',            group: 'embedded-iot' },
  { id: 'raspberry-pi',   name: 'Raspberry Pi',     group: 'embedded-iot' },
  { id: 'sensors',        name: 'Sensors',          group: 'embedded-iot' },
  { id: 'relays',         name: 'Relays',           group: 'embedded-iot' },
  { id: 'i2c',            name: 'I2C',              group: 'embedded-iot' },
  { id: 'ble-hc05-hc06',  name: 'BLE (HC-05/HC-06)', group: 'embedded-iot' },
  { id: 'pid-control',    name: 'PID Control',      group: 'embedded-iot' },

  // Hardware
  { id: '3d-printing',       name: '3D Printing',       group: 'hardware' },
  { id: 'solidworks',        name: 'SolidWorks',        group: 'hardware' },
  { id: 'cnc-machine',       name: 'CNC Machine',       group: 'hardware' },
  { id: 'fritzing',          name: 'Fritzing',          group: 'hardware' },
  { id: 'mechanical-design', name: 'Mechanical Design', group: 'hardware' },

  // Web/Mobile
  { id: 'react',        name: 'React',        group: 'web-mobile' },
  { id: 'react-native', name: 'React Native', group: 'web-mobile' },
  { id: 'php',          name: 'PHP',          group: 'web-mobile' },
  { id: 'symfony',      name: 'Symfony',      group: 'web-mobile' },
  { id: 'doctrine',     name: 'Doctrine',     group: 'web-mobile' },
  { id: 'rest-apis',    name: 'REST APIs',    group: 'web-mobile' },
  { id: 'html',         name: 'HTML',         group: 'web-mobile' },
  { id: 'css',          name: 'CSS',          group: 'web-mobile' },
  { id: 'js',           name: 'JS',           group: 'web-mobile' },

  // Programming
  { id: 'python', name: 'Python', group: 'programming' },
  { id: 'java',   name: 'Java',   group: 'programming' },
  { id: 'c-cpp',  name: 'C/C++',  group: 'programming' },
  { id: 'sql',    name: 'SQL',    group: 'programming' },
  { id: 'numpy',  name: 'NumPy',  group: 'programming' },
  { id: 'pandas', name: 'Pandas', group: 'programming' },

  // Tools/DevOps
  { id: 'git',     name: 'Git',     group: 'tools-devops' },
  { id: 'github',  name: 'GitHub',  group: 'tools-devops' },
  { id: 'docker',  name: 'Docker',  group: 'tools-devops' },
  { id: 'postman', name: 'Postman', group: 'tools-devops' },

  // Data/Cloud
  { id: 'firebase', name: 'Firebase', group: 'data-cloud' },
  { id: 'cloud',    name: 'Cloud',    group: 'data-cloud' },
];

export const PROJECTS = [
  {
    id: 'pet-filament-machine',
    slug: 'pet-filament-machine',
    title: 'PET Plastic Recycling to 3D Printer Filament System',
    name: 'PET Plastic Recycling to 3D Printer Filament System',
    route: '#project-pet-filament-machine',
    technicalSkills: [
      'arduino',
      'sensors',
      'pid-control',
      'mechanical-design',
      '3d-printing',
      'c-cpp',
    ],
    softSkills: [
      'Problem-solving',
      'Autonomy',
      'Self-learning',
      'Resilience',
      'Project management',
      'Attention to detail',
    ],
    githubUrl: PET_HUB_URL,
    photos: [
      "/Projects/PET-Recycling-Filament-System/Capture%20d'%C3%A9cran%202026-09-28%20145437.png",
      "/Projects/PET-Recycling-Filament-System/Schematic%20Diagram.jpg",
    ],
    logo: '/Projects/logos/PET Plastic Recycling.svg',
    accent: ACCENT_COLORS.green,
    bgDark: BG_COLORS.dark.green,
    bgLight: BG_COLORS.light.green,
    bg: {
      dark: BG_COLORS.dark.green,
      light: BG_COLORS.light.green,
    },
  },
  {
    id: 'neurofocus',
    slug: 'neurofocus',
    title: 'NeuroFocus — Wearable Physiological Monitoring System for Children',
    name: 'NeuroFocus — Wearable Physiological Monitoring System for Children',
    route: '#project-neurofocus',
    technicalSkills: [
      'esp32',
      'sensors',
      'i2c',
      'firebase',
      'cloud',
      'c-cpp',
    ],
    softSkills: [
      'Problem-solving',
      'Analytical thinking',
      'Attention to detail',
      'Self-learning',
      'Initiative',
    ],
    githubUrl: 'https://github.com/AnouerChouikhgithub/NeuroFocus.git',
    photos: ["/Projects/NeuroFocus/wiring-diagram.jpg"],
    logo: '/Projects/logos/NeuroFocus.svg',
    accent: ACCENT_COLORS.cyan,
    bgDark: BG_COLORS.dark.cyan,
    bgLight: BG_COLORS.light.cyan,
    bg: {
      dark: BG_COLORS.dark.cyan,
      light: BG_COLORS.light.cyan,
    },
  },
  {
    id: 'carthago',
    slug: 'carthago',
    title: 'Carthago — AI Waste Collection Robot',
    name: 'Carthago — AI Waste Collection Robot',
    route: '#project-carthago',
    technicalSkills: [
      'mechanical-design',
      'solidworks',
      '3d-printing',
      'raspberry-pi',
    ],
    softSkills: [
      'Teamwork',
      'Communication',
      'Creativity',
      'Adaptability',
    ],
    githubUrl: '',
    photos: [],
    logo: '/Projects/logos/Carthago.svg',
    accent: ACCENT_COLORS.purple,
    bgDark: BG_COLORS.dark.purple,
    bgLight: BG_COLORS.light.purple,
    bg: {
      dark: BG_COLORS.dark.purple,
      light: BG_COLORS.light.purple,
    },
  },
  {
    id: 'fighter-robot',
    slug: 'fighter-robot',
    title: 'Fighter Robot',
    name: 'Fighter Robot',
    route: '#project-fighter-robot',
    technicalSkills: [
      'mechanical-design',
    ],
    softSkills: [
      'Teamwork',
      'Resilience',
      'Time management',
    ],
    githubUrl: '',
    photos: [],
    logo: '/Projects/logos/Fighter Robot.svg',
    accent: ACCENT_COLORS.red,
    bgDark: BG_COLORS.dark.red,
    bgLight: BG_COLORS.light.red,
    bg: {
      dark: BG_COLORS.dark.red,
      light: BG_COLORS.light.red,
    },
  },
  {
    id: 'all-terrain-robot',
    slug: 'all-terrain-robot',
    title: 'All-Terrain Robot',
    name: 'All-Terrain Robot',
    route: '#project-all-terrain-robot',
    technicalSkills: [
      'esp32',
      'arduino',
      'ble-hc05-hc06',
      'c-cpp',
    ],
    softSkills: [
      'Problem-solving',
      'Creativity',
      'Critical thinking',
    ],
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
    bgDark: BG_COLORS.dark.amber,
    bgLight: BG_COLORS.light.amber,
    bg: {
      dark: BG_COLORS.dark.amber,
      light: BG_COLORS.light.amber,
    },
  },
  {
    id: 'line-follower-robot',
    slug: 'line-follower-robot',
    title: 'Line-Follower Robot',
    name: 'Line-Follower Robot',
    route: '#project-line-follower-robot',
    technicalSkills: [
      'arduino',
      'sensors',
      'pid-control',
      'c-cpp',
    ],
    softSkills: [
      'Analytical thinking',
      'Problem-solving',
      'Attention to detail',
    ],
    githubUrl: 'https://github.com/AnouerChouikhgithub/Line-Folower-Robot.git',
    photos: [
      "/Projects/Line%20Follower/images%20(1).jfif",
      "/Projects/Line%20Follower/Schematic-Diagram-Arduino.jpg",
    ],
    logo: '/Projects/logos/Line-Follower Robot.svg',
    accent: ACCENT_COLORS.blue,
    bgDark: BG_COLORS.dark.blue,
    bgLight: BG_COLORS.light.blue,
    bg: {
      dark: BG_COLORS.dark.blue,
      light: BG_COLORS.light.blue,
    },
  },
  {
    id: 'junior-robot',
    slug: 'junior-robot',
    title: 'Junior Robot',
    name: 'Junior Robot',
    route: '#project-junior-robot',
    technicalSkills: [
      'arduino',
      'esp32',
      'ble-hc05-hc06',
      'c-cpp',
    ],
    softSkills: [
      'Adaptability',
      'Self-learning',
      'Initiative',
    ],
    githubUrl: 'https://github.com/AnouerChouikhgithub/Junior-Robot.git',
    photos: [
      "/Projects/Junior/app-screenshot.jfif",
      "/Projects/Junior/images.jfif",
      "/Projects/Junior/Schematic-Diagram-ArduinoVersion.jpg",
      "/Projects/Junior/Schematic-Diagram-ESP32Version.jpg",
    ],
    logo: '/Projects/logos/Junior Robot.svg',
    accent: ACCENT_COLORS.yellow,
    bgDark: BG_COLORS.dark.yellow,
    bgLight: BG_COLORS.light.yellow,
    bg: {
      dark: BG_COLORS.dark.yellow,
      light: BG_COLORS.light.yellow,
    },
  },
];

// ─── Derived Relation Helpers ───────────────────────────────────────────────────

export function getSkillById(skillId) {
  return SKILLS.find((s) => s.id === skillId) ?? null;
}

export function getGroupById(groupId) {
  return GROUPS.find((g) => g.id === groupId) ?? null;
}

export function getGroupForSkill(skillId) {
  const skill = getSkillById(skillId);
  if (!skill) return null;
  return getGroupById(skill.group);
}

export function getSkillsForGroup(groupId) {
  return SKILLS.filter((s) => s.group === groupId);
}

export function getProjectsForSkill(skillId) {
  return PROJECTS.filter((p) => Array.isArray(p.technicalSkills) && p.technicalSkills.includes(skillId));
}

export function getProjectsForGroup(groupId) {
  const groupSkillIds = new Set(getSkillsForGroup(groupId).map((s) => s.id));
  return PROJECTS.filter(
    (p) => Array.isArray(p.technicalSkills) && p.technicalSkills.some((id) => groupSkillIds.has(id))
  );
}

// Aliases for compatibility
export const PROJECTS_DATA = PROJECTS;
export const SKILL_GROUPS = GROUPS.map((group) => ({
  ...group,
  skills: getSkillsForGroup(group.id),
}));
