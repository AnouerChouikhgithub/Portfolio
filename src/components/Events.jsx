import { useEffect, useRef, useState } from 'react';
import { clubs } from './Community';
import { useI18n } from '../i18n/I18nProvider';

const imageList = (folder, files) => files.map((file) => `/Events/${folder}/${file}`);

const renderProjectLinksInText = (text, onClose) => {
  if (!text) {
    return text;
  }

  const hyperlinkDefinitions = [
    { label: 'PET recycling machine', href: '#project-pet-filament-machine', className: 'event-modal__project-link event-modal__project-link--project' },
    { label: 'NeuroFocus project', href: '#project-neurofocus', className: 'event-modal__project-link event-modal__project-link--project' },
    { label: 'Carthago project', href: '#project-carthago', className: 'event-modal__project-link event-modal__project-link--project' },
    { label: 'Fighter Robot challenge', href: '#project-fighter-robot', className: 'event-modal__project-link event-modal__project-link--project' },
    { label: 'All Terrain Challenge', href: '#project-all-terrain-robot', className: 'event-modal__project-link event-modal__project-link--project' },
    { label: 'All-Terrain Challenge', href: '#project-all-terrain-robot', className: 'event-modal__project-link event-modal__project-link--project' },
    { label: 'Line Follower Challenge', href: '#project-line-follower-robot', className: 'event-modal__project-link event-modal__project-link--project' },
    { label: 'Junior Robot challenge', href: '#project-junior-robot', className: 'event-modal__project-link event-modal__project-link--project' },
    { label: 'combat robot', href: '#project-fighter-robot', className: 'event-modal__project-link event-modal__project-link--project' },
    { label: 'OTDDPH organization', href: '#community-otddph', className: 'event-modal__project-link event-modal__project-link--otddph' },
    { label: 'Tunisian Youth Science Association, El Alia', href: '#community-ajst', className: 'event-modal__project-link event-modal__project-link--blue' },
    { label: 'Tunisian Youth Science Association', href: '#community-ajst', className: 'event-modal__project-link event-modal__project-link--blue' },
    { label: 'IEEE ESSTHS SB', href: '#community-ieee-essths-sb', className: 'event-modal__project-link event-modal__project-link--blue' },
    { label: 'IEEE ESSTHS', href: '#community-ieee-essths-sb', className: 'event-modal__project-link event-modal__project-link--blue' },
    { label: 'IEEE', href: '#community-ieee-essths-sb', className: 'event-modal__project-link event-modal__project-link--blue' },
    { label: 'RAS Chapter', href: '#community-ieee-essths-sb?chapter=RAS', className: 'event-modal__project-link event-modal__project-link--red' },
    { label: 'RAS', href: '#community-ieee-essths-sb?chapter=RAS', className: 'event-modal__project-link event-modal__project-link--red' },
    { label: 'SIGHT Group', href: '#community-ieee-essths-sb?chapter=SIGHT', className: 'event-modal__project-link event-modal__project-link--orange' },
    { label: 'SIGHT', href: '#community-ieee-essths-sb?chapter=SIGHT', className: 'event-modal__project-link event-modal__project-link--orange' },
    { label: 'CS Chapter', href: '#community-ieee-essths-sb?chapter=CS', className: 'event-modal__project-link event-modal__project-link--yellow' },
  ].sort((a, b) => b.label.length - a.label.length);

  const textLower = text.toLowerCase();
  const parts = [];
  let cursor = 0;

  while (cursor < text.length) {
    let bestMatch = null;
    let bestMatchScore = Number.NEGATIVE_INFINITY;

    for (const definition of hyperlinkDefinitions) {
      const targetLabel = definition.label.toLowerCase();
      const matchIndex = textLower.indexOf(targetLabel, cursor);

      if (matchIndex === -1) {
        continue;
      }

      const beforeChar = matchIndex > 0 ? text[matchIndex - 1] : ' ';
      const afterChar = matchIndex + definition.label.length < text.length ? text[matchIndex + definition.label.length] : ' ';
      const isStandaloneMatch = !/[A-Za-z0-9]/.test(beforeChar) && !/[A-Za-z0-9]/.test(afterChar);

      if (!isStandaloneMatch) {
        continue;
      }

      const matchedText = text.slice(matchIndex, matchIndex + definition.label.length);
      const isSpecificGroupOrChapter = /(chapter|group)/i.test(definition.label);
      const score = (isSpecificGroupOrChapter ? 1000 : 0) + definition.label.length;

      const shouldReplaceMatch =
        !bestMatch ||
        matchIndex < bestMatch.matchIndex ||
        (matchIndex === bestMatch.matchIndex && score > bestMatchScore) ||
        (matchIndex === bestMatch.matchIndex && score === bestMatchScore && definition.label.length > bestMatch.label.length);

      if (shouldReplaceMatch) {
        bestMatch = {
          matchIndex,
          matchedText,
          ...definition,
        };
        bestMatchScore = score;
      }
    }

    if (!bestMatch) {
      parts.push(text.slice(cursor));
      break;
    }

    if (bestMatch.matchIndex > cursor) {
      parts.push(text.slice(cursor, bestMatch.matchIndex));
    }

    parts.push(
      <a
        key={`${bestMatch.label}-${bestMatch.matchIndex}`}
        href={bestMatch.href}
        onClick={(event) => {
          event.preventDefault();
          onClose();

          if (bestMatch.href.startsWith('#community-')) {
            const [hashPath, queryString = ''] = bestMatch.href.split('?');
            const slug = hashPath.replace('#community-', '');
            const chapterQuery = new URLSearchParams(queryString).get('chapter');

            if (typeof window.openCommunityModal === 'function') {
              window.openCommunityModal(slug, chapterQuery || null);
            } else {
              window.dispatchEvent(new CustomEvent('open-community', { detail: { slug, chapter: chapterQuery || null } }));
            }

            window.location.hash = bestMatch.href;
            return;
          }

          window.location.hash = bestMatch.href;
        }}
        className={bestMatch.className}
        aria-label={`${bestMatch.matchedText}. More details`}
        title="More details"
      >
        {bestMatch.matchedText}
      </a>
    );

    cursor = bestMatch.matchIndex + bestMatch.matchedText.length;
  }

  return parts;
};

const organizedEvents = [
  {
    slug: 'robokids-2026',
    title: 'ROBOKIDS 2026',
    meta: 'Robotics Instructor & Organizer · July -- August 2026',
    preview: 'A hands-on robotics workshop where kids built and debugged smart projects with real hardware.',
    description: "Organized by Tunisian Youth Science Association, El Alia, in El Alia Bizerte, this immersive, hands-on robotics workshop was designed for 25 young students aged 7–14, delivering structured instruction in C++/Arduino programming, circuit design, and sensor integration. The event guided participants through building functional hardware projects—such as remote-controlled cars—while providing technical mentorship in debugging embedded code, resolving wiring faults, and mastering core STEM concepts to foster high engagement and impactful educational outcomes.",
    role: "Co-organized and led the event, delivering structured instruction in C++/Arduino programming, circuit design, and sensor integration to guide 25 students aged 7–14 through building functional hardware projects like remote-controlled cars. Provided direct technical mentorship to help participants debug embedded code, resolve wiring faults, and master fundamental STEM principles, driving high student engagement and earning enthusiastic parent feedback.",
    photos: imageList('ROBOKIDS2026', [
      '1788454842030.jfif',
      '1788454842413.jfif',
      '1788454842520.jfif',
      '1788454842653.jfif',
      '1788454844382.jfif',
      '1788454846559.jfif',
      '1788454847351.jfif',
      '1788454850526.jfif',
      '1788454850546.jfif',
      '1788454850890.jfif',
      '1788454852709.jfif',
      '1788454853756.jfif',
      '1788454853882.jfif',
      '1788454856333.jfif',
    ]),
  },
  {
    slug: 'smc-3',
    title: 'SMC 3.0 (Speed Modeling Challenge)',
    meta: 'Organizing Team · 2026',
    preview: 'A fast-paced challenge where I helped shape the. event flow and judging experience.',
    description: "Organized by IEEE ESSTHS SB RAS chapter, in Pristini scholl of AI, the Speed Modeling Challenge is an intense, head-to-head CAD competition where participants race in pairs to rapidly model designated 3D parts under strict time constraints. The winning model is selected based on speed, design accuracy, correct material selection, and precise part weight.",
    role: "Served as an official jury member, evaluating participants' completed parametric models, verifying precise material properties and mass specs, and declaring final contest winners.",
    photos: imageList('SMC3.0', ['IMG-20260501-WA0017.jpg', 'IMG-20260501-WA0009.jpg']),
  },
  {
    slug: 'algo-arena-4',
    title: 'Algo Arena 4.0',
    meta: 'Problems Manager · 2025',
    preview: 'I managed the challenge structure and kept problem delivery smooth and competitive.',
    description: "Organized by the Tunisian Youth Science Association, El Alia, in EL ALia, Algo Arena is an intensive, day-long (~8h) competitive programming contest hosted on HackerRank, challenging participant teams across multiple difficulty tiers: Easy, Medium, Hard, and Advanced. Teams compete to accumulate points by writing optimized code that accurately solves problems and passes all automated validation test cases.",
    role: "Served as the Technical Problem Setter, responsible for designing, authoring, and managing approximately 40 competitive programming problems across all difficulty levels. Built and configured comprehensive automated test cases on HackerRank—including edge cases, hidden inputs, and expected outputs—to ensure rigorous evaluation, accurate scoring, and precise solution verification throughout the event.",
    photos: imageList('AlgoAreana4.0', [
      '605146256_1455065249953004_2563523498531105948_n.jpg',
      '605138693_1456072589852270_4193772306217600208_n.jpg',
      '601860160_1454388580020671_3862581073818534666_n.jpg',
    ]),
  },
  {
    slug: 'robots-league-3',
    title: 'IEEE ESSTHS Robots League 3.0',
    meta: 'Organizing Team · 2025',
    preview: 'I supported the robotics event logistics and helped keep the competition running cleanly.',
    description: "Organized by the IEEE ESSTHS SB RAS Chapter, in ESSTHS, this multi-tier robotics competition features three distinct technical challenges: the Junior Challenge, where participants under 18 race remote-controlled cars through a timed track over multiple rounds; the Line Follower Challenge, focused on autonomous navigation; and the All Terrain Challenge, designed for participants over 18 using advanced robots to navigate larger, highly complex obstacles.",
    role: "Served as an official jury member for the Junior Challenge, responsible for coordinating participant match brackets, running competition rounds, and determining winning teams based on course completion times and rules compliance.",
    photos: imageList('RobotsLeague3.0', [
      '632827946_17863135260592307_7310623845599494380_n.jfif',
      '631677310_17863135410592307_1784183151617336395_n.jfif',
      '632948615_17863135245592307_8756060148406342015_n.jfif',
    ]),
  },
  {
    slug: 'robotsleague-2',
    title: 'IEEE ESSTHS Robots League 2.0',
    meta: 'Model Chief · 2024',
    preview: 'Led key model operations and helped steer the competition with strong coordination.',
    description: "Organized by the IEEE ESSTHS SB RAS Chapter, this multi-tier robotics competition features three distinct technical challenges: the Junior Challenge, where participants under 18 race remote-controlled cars through a timed track over multiple rounds; the Line Follower Challenge, focused on autonomous navigation; and the All Terrain Challenge, designed for participants over 18 using advanced robots to navigate larger, highly complex obstacles.",
    role: "Served as the Chief of the Junior Model Track, leading the design, planning, and hands-on construction of the competition track. Oversee model mechanics, track layout, and physical construction while managing the official homologation process to inspect, measure, weigh, and verify the electronics of each robot to authorize competition entry.",
    photos: imageList('RobotsLeague2.0', [
      '480328048_656492480067706_7599675241454232436_n.jpg',
      '480319935_656492380067716_3718151997370951199_n.jpg',
      '480299848_656492356734385_1099335836654474353_n.jpg',
      '480251108_656492240067730_681408608190222142_n.jpg',
      '480163038_656492363401051_2234398112275209873_n.jpg',
    ]),
  },
  {
    slug: 'algo-arena-2',
    title: 'Algo Arena 2.0',
    meta: 'Treasurer and Logistics Manager · 2023',
    preview: 'I handled the event logistics and financial coordination behind the challenge experience.',
    description: "Organized by the Tunisian Youth Science Association, El Alia, in EL ALia, Algo Arena is an intensive, day-long (~8h) competitive programming contest hosted on HackerRank, challenging participant teams across multiple difficulty tiers: Easy, Medium, Hard, and Advanced. Teams compete to accumulate points by writing optimized code that accurately solves problems and passes all automated validation test cases.",
    role: "Served as Event Logistics Lead and Treasurer, overseeing technical infrastructure, physical setup, and financial operations. Managed on-site logistics—including power distribution, network connectivity, and equipment setup—while directing budget planning, trackable income and expenditure logging, and overall financial administration for the event.",
    photos: imageList('AlgoArena2.0', ['DSC_0208.JPG', 'DSC_0064.JPG', 'DSC_0021.JPG']),
  },
];

const otherEvents = [
  {
    slug: 'eniso-smart-challenge',
    title: 'ENISo Smart Challenge',
    meta: 'Participant · 2022',
    preview: 'A robotics challenge that pushed strategy, build quality, and performance.',
    description: "Organized by ENISo Team at the École Nationale d'Ingénieurs de Sousse (ENISo), this multi-tier robotics competition brings together junior and senior builders to test autonomous navigation, structural durability, and hardware resilience across specialized arenas. The event features multiple technical tracks, including the Junior Challenge for remote-controlled track racing, the autonomous Line Follower Challenge, the All-Terrain Challenge, and the high-impact Fighter Challenge.",
    role: 'Representing Tunisian Youth Science Association, El Alia as a core hardware developer in a four-person team for the Fighter Robot challenge. Contributed to the assembly, mechanical alignment, and drive systems calibration of a combat robot, while managing real-time strategy, rapid repairs, and power-system troubleshooting between intense elimination matches.',
    photos: imageList('EnisoSmartChallenge', ['IMG_20220424_180752_811.jpg']),
  },
  {
    slug: 'fsb-smartech',
    title: 'FSB SmarTech',
    meta: 'Junior Challenge Participant · 2022',
    preview: 'A challenge-driven experience focused on hands-on technical creativity.',
    description: "Organized by SmarTech FSB at the Faculté des Sciences de Bizerte (FSB), this multi-tier robotics competition brings together junior and senior builders to test autonomous navigation and hardware resilience across specialized arenas. The event features three distinct technical tracks: the Junior Challenge for remote-controlled track racing, the autonomous Line Follower Challenge, and the All-Terrain Challenge, where advanced custom robots navigate large, complex obstacle courses.",
    role: 'Representing Tunisian Youth Science Association, El Alia as an active team member in the Junior Robot challenge, collaborating on robot design, hardware assembly, and real-time performance optimization. Participated in technical testing, drive calibration, and field troubleshooting during competitive heats to maximize navigation accuracy and course completion speed.',
    photos: imageList('FSBSmartChallenge', [
      '481775323_9115234118511643_4969609786711446471_n.jpg',
      '481252779_9115233821845006_7288383613134083637_n.jpg',
      '480935962_9115234301844958_1977117138749174010_n.jpg',
    ]),
  },
  {
    slug: 'esprit-ras-robots-2025',
    title: 'ESPRIT RAS Robots 2025',
    meta: 'Participant · 2025',
    preview: 'I competed in the All Terrain Challenge and tested navigation, stability, and endurance under real race conditions.',
    description: "Participated in the All Terrain Challenge at ESPRIT RAS Robots 2025, where competitors tested robot mobility, control precision, and obstacle-handling performance across rough, uneven terrain. The challenge emphasized robust design, reliable traction, and real-time tuning under pressure.",
    role: 'Representing IEEE ESSTHS RAS Chapter and competed in the All Terrain Challenge as a active team member. Contributed directly to robot setup, systematic testing, and rapid on-site adjustments, optimizing control responsiveness and mechanical stability throughout the dynamic runs.',
    photos: imageList('Esprit Ras Robots', ['received_609273398797693.jpeg', 'received_718295347292095.jpeg']),
  },
  {
    slug: 'tsyp12',
    title: 'TSYP12 (IEEE Tunisian Student Young Professional Congress)',
    meta: 'Participant · 2024',
    preview: 'A student-focused professional event bringing engineering and networking together.',
    description: "The 12th IEEE Tunisian Student and Young Professional Congress (TSYP 12) brought together over 1,200 engineering students, young professionals, and industry experts at the El Medina Congress Center in Yasmine Hammamet. Centered on the theme \"TUNISIA 2056,\" the congress examined technological advancement across health tech, agritech, and creative industries through the TN2056 Forum, technical sessions, chapter challenges, and startup pitch competitions.",
    role: 'Representing the IEEE ESSTHS Student Branch at TSYP 12, competing in both the SIGHT group and RAS chapter technical challenges with the Carthago project. Co-engineered and presented the technical solution before evaluation juries, demonstrating system functionality, hardware-software integration, and humanitarian impact under strict competition guidelines.',
    photos: imageList('TSYP12', ['20241224_005606_563.jpg']),
  },
  {
    slug: 'nrw',
    title: 'National Robotics Weekend (NRW) 5.0',
    meta: 'Junior Startup Participant · 2023',
    preview: 'A robotics weekend that blended startup thinking with practical technical exploration.',
    description: "Organized by the IEEE RAS INSAT Student Branch, National Robotics Weekend (NRW) 5.0 is a flagship 3-day national robotics congress and hackathon held in Tunis. Bringing together engineering, tech, and business students from top universities across Tunisia, the event bridges autonomous robotics engineering with startup innovation through competitive track challenges, 24-to-36-hour makeathons, technical workshops, and panels on AI, automation, and Industry 4.0 applications.",
    role: 'Representing Tunisian Youth Science Association, El Alia, leading a team of four young innovators to design, build, and pitch the initial functional prototype of an automated plastic bottle PET recycling machine. Directed project planning, hardware iteration, and system integration while guiding team members through pitch development, business model refinement, and live technical demonstrations.',
    photos: imageList('NRW', [
      '476436877_929557102638590_614182522696266983_n.jpg',
      '440751760_748925197368449_1967877939820872143_n.jpg',
    ]),
  },
  {
    slug: 'crt-palestine-campaign',
    title: 'CRT Palestine Campaign',
    meta: 'Participant · 2023',
    preview: 'A meaningful participation during a period of crisis and collective solidarity.',
    description: 'Led by the Tunisian Red Crescent (Croissant Rouge Tunisien), this nationwide relief operation mobilized humanitarian aid and medical supplies for the Gaza Strip during the 2023 crisis. The initiative coordinated large-scale public donation drives, managed sorting and packing at central logistics hubs, deployed military cargo airlifts to Al-Arish airport for delivery via the Rafah crossing, and facilitated medical evacuation logistics for injured individuals receiving treatment in Tunisia.',
    role: 'Served as an active volunteer and logistics coordinator, managing the collection, sorting, and packaging of essential humanitarian aid—including medical supplies, food, and emergency relief goods—at local collection depots. Supported community outreach initiatives to mobilize public donations and assisted in streamlining warehouse operations for shipment preparation.',
    photos: imageList('CRTPalestineCampaign', [
      '481247300_1047956810694163_8362059026597306439_n.jpg',
      '482056870_1051483890341455_7026896222072665079_n.jpg',
      '482083166_1051483783674799_6991042061416396420_n.jpg',
      '482219590_1047956730694171_2775369847530945783_n.jpg',
      '482241601_1051483770341467_5607059090035460372_n.jpg',
      '482242077_1051483930341451_7821533392595598027_n.jpg',
      '482244396_1051483817008129_2872683757224338639_n.jpg',
    ]),
  },
  {
    slug: 'algo-arena-1',
    title: 'Algo Arena 1.0',
    meta: 'Problem Solving Challenge Participant · 2023',
    preview: 'A competitive challenge that rewarded creative thinking under pressure.',
    description: 'Organized by the Tunisian Youth Science Association, El Alia, in EL ALia, Algo Arena is an intensive, day-long (~8h) competitive programming contest hosted on HackerRank, challenging participant teams across multiple difficulty tiers: Easy, Medium, Hard, and Advanced. Teams compete to accumulate points by writing optimized code that accurately solves problems and passes all automated validation test cases.',
    role: 'Competed as part of a three-person team in the multi-tiered algorithmic challenge, driving problem analysis, mathematical modeling, and optimized code implementation under strict time constraints. Successfully solved complex algorithmic problems on HackerRank to claim 3rd place in the competition.',
    photos: imageList('AlgoArena1.0', [
      '487124730_1216482703811261_2809329442559644233_n.jpg',
      '487016477_1216482720477926_3872804814145809501_n.jpg',
      '486951932_1216482493811282_2040708878349475201_n.jpg',
    ]),
  },
  {
    slug: 'nettawaa-mall',
    title: 'Nettawaa Mall',
    meta: 'Participant · 2025',
    preview: 'An event experience centered on engagement, technology, and community interaction.',
    description: "Organized by Future Visions (رؤى المستقبل) in Messadine, Sousse, this non-profit initiative focuses on empowering youth through targeted training, civic engagement, and hands-on technological projects. The event brings together students and young professionals across the Sahel region for interactive workshops, leadership development, and collaborative innovation labs.",
    role: 'Representing Tunisian Youth Science Association, El Alia as an active participant. Engaged in hands-on technological workshops, civic leadership sessions, and collaborative innovation labs, contributing to regional youth empowerment and inter-association technical exchange.',
    photos: imageList('NettawaaMall', ['IMG_0079_20251217_125506_3600 (1).jpeg']),
  },
  { slug: 'nuit-info-2025', title: 'Nuit d’Info 2025', meta: 'Participant · 2025', preview: 'A memorable information and tech event with a strong collaborative atmosphere.', description: "Organized at ISITCOM (Institut Supérieur d'Informatique et des Techniques de Communication) in Hammam Sousse as part of the nationwide French-Tunisian hackathon La Nuit de l'Info, this overnight competition brings together students, faculty, and industry professionals. Teams work from sunset to sunrise to design, build, and deploy a functional web application addressing a national prompt alongside targeted technical and design challenges sponsored by corporate partners.", role: 'Participant', photos: [] },
  { slug: 'ieeextreme', title: 'IEEEXtreme 19.0', meta: 'Participant · 2025', preview: 'A high-pressure programming challenge that pushed problem-solving and teamwork.', description: "IEEEXtreme is a global 24-hour virtual competitive programming marathon organized by IEEE, bringing together thousands of student members worldwide. Teams compete continuously against strict time constraints to solve a set of complex algorithmic, mathematical, and logical challenges proctored locally across university hubs.", role: 'Represented the IEEE ESSTHS SB CS Chapter as part of a three-member competitive team alongside fellow student programmers. Collaborated continuously over 24 hours to analyze complex problem statements, design optimized algorithmic solutions, and debug code under tight time constraints against international peer teams.', photos: [] },
  {
    slug: 'sdc-4',
    title: 'SDC 4.0 (IEEE SIGHT Day Congress)',
    meta: 'Participant · 2026',
    preview: 'Represented the team in the technical challenge with NeuroFocus, pitching and demonstrating engineering solutions for educational accessibility.',
    description: "Organized by the IEEE SIGHT Tunisia Section, the IEEE SIGHT Day Congress (SDC) is an annual flagship gathering uniting students, engineers, and humanitarian technology advocates across Tunisia. The congress focuses on leveraging engineering and technological innovation to address pressing social, educational, and healthcare challenges through technical competitions, keynote addresses, interactive workshops, and cross-branch collaboration.",
    role: 'Representing IEEE ESSTHS SB SIGHT Group in the SDC technical challenge with the NeuroFocus project, presenting engineering innovations designed to address core accessibility and educational challenges.',
    photos: imageList('SDC4.0', ['1776703382796.jfif']),
  },
  {
    slug: 'el-alia-robots-1',
    title: 'EL ALia ROBOTS 1.0',
    meta: 'Participant · 2026',
    preview: 'A robotics event experience focused on creativity, teamwork, and hands-on technical challenge.',
    description: "Organized by the CODING4EVER Club in El Alia, El Alia Robots is a two-day robotics competition for both junior (under 15) and senior (above 15) participants. The event features an initial day dedicated to assembling and fine-tuning remote-controlled cars, followed by a competitive match day evaluating performance and navigation precision across age-based divisions.",
    role: 'Representing Tunisian Youth Science Association, El Alia, serving as Team Lead and Technical Mentor. Managed two junior teams and one senior team throughout the build, optimization, and competition phases, directing hardware setup, strategic drive adjustments, and real-time troubleshooting to lead the senior team to secure a 3rd place podium finish.',
    photos: imageList('ELAliaRobots1.0', ['IMG-20260830-WA0028.jpg']),
  },
  {
    slug: 'caux-forum',
    title: 'Caux Forum',
    meta: 'Representative · 2017',
    preview: 'A representative role connecting youth leadership with inclusive social impact.',
    description: 'Hosted at the historic Caux Palace overlooking Montreux, Switzerland, the Caux Forum 2017 brought together global leaders, policymakers, researchers, and grass-roots advocates to examine the root causes of global inequalities and the rise of extremism. Organized by the Initiatives of Change (IofC) Foundation, the forum featured dedicated conference tracks on inclusive governance, land restoration, ethical business leadership, and European peace-building, combining high-level policy dialogue with personal storytelling to foster human-centered solutions to global conflict.',
    role: 'Representing Tunisia as an 11-year-old youth delegate in collaboration with the OTDDPH organization at the Caux Forum. Engaged with international leaders, policymakers, and global peers on peace-building, youth civic engagement, and addressing global inequalities through cross-cultural dialogues, specialized workshops on ethical leadership, and community resilience discussions.',
    photos: imageList('CAUXForum', [
      'Messenger_creation_352601875795236.jpeg',
      'Messenger_creation_340285383723292.jpeg',
      'Messenger_creation_331002237966963.jpeg',
      'Messenger_creation_2199422626856669.jpeg',
    ]),
  },
];

const orderedParticipatedEvents = [...otherEvents].sort((a, b) => {
  const yearA = Number.parseInt(String(a.meta).match(/(\d{4})/)?.[1] || '0', 10);
  const yearB = Number.parseInt(String(b.meta).match(/(\d{4})/)?.[1] || '0', 10);
  return yearB - yearA;
});

const allEvents = [...organizedEvents, ...orderedParticipatedEvents];

function EventModal({ event, onClose }) {
  const { t } = useI18n();
  const modalRef = useRef(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const lastUserActionRef = useRef(0);
  const hasPhotos = Array.isArray(event.photos) && event.photos.length > 0;

  const activateManualSelection = (nextIndex) => {
    lastUserActionRef.current = Date.now();
    setSelectedPhotoIndex(nextIndex);
  };

  useEffect(() => {
    setSelectedPhotoIndex(0);
    lastUserActionRef.current = 0;
  }, [event.slug]);

  useEffect(() => {
    if (!hasPhotos || event.photos.length <= 1) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      const now = Date.now();
      if (now - lastUserActionRef.current >= 1000) {
        setSelectedPhotoIndex((currentIndex) => (currentIndex + 1) % event.photos.length);
      }
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [event.photos, hasPhotos, selectedPhotoIndex]);

  useEffect(() => {
    const previousActiveElement = document.activeElement;
    const focusableSelectors = 'button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    document.body.style.overflow = 'hidden';

    const focusFirst = () => {
      const focusable = modalRef.current?.querySelectorAll(focusableSelectors);
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }
    };

    focusFirst();

    const handleKeyDown = (eventKey) => {
      if (eventKey.key === 'Escape') {
        onClose();
        return;
      }

      if (eventKey.key !== 'Tab' || !modalRef.current) {
        return;
      }

      const focusable = Array.from(modalRef.current.querySelectorAll(focusableSelectors));

      if (!focusable.length) {
        eventKey.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (eventKey.shiftKey && document.activeElement === first) {
        eventKey.preventDefault();
        last.focus();
      } else if (!eventKey.shiftKey && document.activeElement === last) {
        eventKey.preventDefault();
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
    <div className="event-modal" onClick={onClose}>
      <div
        className="event-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        ref={modalRef}
      >
        <button
          type="button"
          className="event-modal__close"
          aria-label={t('common.closeEvent')}
          onClick={onClose}
        >
          ×
        </button>

        <div className="event-modal__content">
          <div className="event-modal__details">
            <p className="event-card__meta">{event.meta}</p>
            <h3 id="event-modal-title" className="event-modal__title">{event.title}</h3>

            <div className="event-modal__text-group">
              {event.description ? (
                <>
                  <h4 className="event-modal__section-label">{t('common.eventOverview')}</h4>
                  <p className="event-modal__description">
                    {typeof event.description === 'string' ? renderProjectLinksInText(event.description, onClose) : event.description}
                  </p>
                </>
              ) : (
                <p className="event-modal__description event-modal__description--muted">{t('common.overviewSoon')}</p>
              )}
            </div>

            <div className="event-modal__text-group">
              {event.role ? (
                <>
                  <h4 className="event-modal__section-label">{t('common.myRole')}</h4>
                  <p className="event-modal__description">{typeof event.role === 'string' ? renderProjectLinksInText(event.role, onClose) : event.role}</p>
                </>
              ) : (
                <p className="event-modal__description event-modal__description--muted">{t('common.roleSoon')}</p>
              )}
            </div>
          </div>

          <div className="event-modal__gallery">
            {hasPhotos ? (
              <>
                <div className="event-modal__gallery-main">
                  <button
                    type="button"
                    className="event-modal__nav event-modal__nav--prev"
                    aria-label={`Previous photo for ${event.title}`}
                    onClick={() => {
                      activateManualSelection((selectedPhotoIndex - 1 + event.photos.length) % event.photos.length);
                    }}
                  >
                    ‹
                  </button>

                  <img
                    src={event.photos[selectedPhotoIndex]}
                    alt={`${event.title} photo ${selectedPhotoIndex + 1}`}
                  />

                  <button
                    type="button"
                    className="event-modal__nav event-modal__nav--next"
                    aria-label={`Next photo for ${event.title}`}
                    onClick={() => {
                      activateManualSelection((selectedPhotoIndex + 1) % event.photos.length);
                    }}
                  >
                    ›
                  </button>
                </div>

                <div className="event-modal__thumbs" aria-label={`${event.title} photo gallery`}>
                  {event.photos.map((photo, index) => (
                    <button
                      key={`${event.slug}-${index}`}
                      type="button"
                      className={`event-modal__thumb ${index === selectedPhotoIndex ? 'is-active' : ''}`}
                      aria-label={`View photo ${index + 1} for ${event.title}`}
                      onClick={() => activateManualSelection(index)}
                    >
                      <img src={photo} alt={`${event.title} thumbnail ${index + 1}`} />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="event-modal__empty">
                <span>{t('common.noPhotos')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const { t } = useI18n();
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    const syncEventFromHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith('#event-')) {
        return;
      }

      const slug = hash.replace('#event-', '');
      const matchedEvent = [...organizedEvents, ...orderedParticipatedEvents].find((event) => event.slug === slug);

      if (matchedEvent) {
        setActiveEvent(matchedEvent);
        document.getElementById('events')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    syncEventFromHash();
    window.addEventListener('hashchange', syncEventFromHash);

    return () => window.removeEventListener('hashchange', syncEventFromHash);
  }, []);

  return (
    <div id="events" className="container events">
      <h2 className="section__title">{t('sections.events')}</h2>

      <div className="events__organized">
        {organizedEvents.map((event) => (
          <button
            type="button"
            key={event.slug}
            className="events-card"
            aria-haspopup="dialog"
            aria-expanded={activeEvent?.slug === event.slug}
            onClick={() => setActiveEvent(event)}
          >
            <span className="events-card__meta">{event.meta}</span>
            <h3 className="events-card__title">{event.title}</h3>
            <p className="events-card__description">
              {event.preview || event.description || 'Details coming soon'}
            </p>
          </button>
        ))}
      </div>

      <div className="events__other">
        <h3 className="events__subheading">{t('sections.alsoParticipated')}</h3>
        <ul className="events__list">
          {orderedParticipatedEvents.map((event) => (
            <li key={event.slug} className="events__list-item">
              <button
                type="button"
                className="events__list-button"
                aria-haspopup="dialog"
                aria-expanded={activeEvent?.slug === event.slug}
                onClick={() => setActiveEvent(event)}
              >
                <span className="events__list-name">{event.title}</span>
                <span className="events__list-meta">{event.meta}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {activeEvent && <EventModal event={activeEvent} onClose={() => setActiveEvent(null)} />}
    </div>
  );
}
