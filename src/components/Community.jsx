import { useEffect, useRef, useState } from 'react';

const communityImageList = (folder, files) => files.map((file) => `/Communities/${folder}/${file}`);

const ieeeChapterLogos = [
  {
    name: 'CS',
    label: 'IEEE ESSTHS SB CS Chapter',
    path: '/Communities/Logos/IEEE Chapters/IEEE-ESSTHS-CS.jpg',
    description: 'The Computer Society chapter promotes computing excellence through technical learning, software innovation, and collaborative projects that strengthen students’ practical skills in the digital era.',
  },
  {
    name: 'IIP',
    label: 'IEEE ESSTHS SB IIP Joint Chapter',
    path: '/Communities/Logos/IEEE Chapters/IEEE-ESSTHS-IIP.jpg',
    description: 'The IIP Joint Chapter unites three specialized IEEE societies: IES (Industrial Electronics Society), IAS (Industry Applications Society), and PES (Power & Energy Society). By merging industrial automation, electrical equipment applications, and sustainable power systems into a single joint chapter, it provides members with a comprehensive, multi-disciplinary engineering framework.',
  },
  {
    name: 'RAS',
    label: 'IEEE ESSTHS SB RAS Chapter',
    path: '/Communities/Logos/IEEE Chapters/IEEE-ESSTHS-RAS.jpg',
    description: 'The IEEE Robotics and Automation Society (RAS) Chapter focuses on robotics, autonomous navigation, and intelligent control systems. It provides members with hands-on experience in hardware prototyping, embedded development, and real-world engineering challenges.',
  },
  {
    name: 'SIGHT',
    label: 'ESSTHS SB SIGHT Group',
    path: '/Communities/Logos/IEEE Chapters/IEEE-ESSTHS-SIGHT.jpg',
    description: 'The IEEE Special Interest Group on Humanitarian Technology (SIGHT) Chapter leverages technology to drive social impact, empowering members to design and deploy practical, sustainable engineering solutions for real-world community challenges.',
  },
  {
    name: 'WIE',
    label: 'IEEE ESSTHS SB WIE Chapter',
    path: '/Communities/Logos/IEEE Chapters/IEEE-ESSTHS-WIE.jpg',
    description: 'The IEEE Women in Engineering (WIE) Chapter supports and advances women in technical fields, empowering members through leadership development, professional networking, mentorship, and inclusive STEM innovation initiatives.',
  },
];

const getRelatedEventYear = (eventSlug) => {
  const yearBySlug = {
    'robotsleague-2': 2024,
    'robots-league-3': 2025,
    'smc-3': 2026,
    'sdc-4': 2026,
    'tsyp12': 2024,
    'ieeextreme': 2025,
    'nuit-info-2025': 2025,
    'robokids-2026': 2026,
    'algo-arena-4': 2025,
    'algo-arena-2': 2023,
    'algo-arena-1': 2023,
    'crt-palestine-campaign': 2023,
    'esprit-ras-robots-2025': 2025,
  };

  return yearBySlug[eventSlug] ?? 0;
};

export const clubs = [
  {
    slug: 'ieee-essths-sb',
    name: 'IEEE ESSTHS SB',
    fullName: 'IEEE ESSTHS Student Branch',
    title: 'IEEE ESSTHS Student Branch',
    since: 'since 2024',
    location: 'ESSTHS, Sousse',
    description: 'An international student network under IEEE (Institute of Electrical and Electronics Engineers), composed of specialized technical chapters that empower future engineers through robotics, research, hands-on projects, and professional development.',
    logo: '/Communities/Logos/IEEE-ESSTHS-SB.jpg',
    chapterLogos: ieeeChapterLogos,
    icon: '⚙️',
    photos: communityImageList('IEEE', [
      '1776703382796.jfif',
      '20241224_005606_563.jpg',
      '480328048_656492480067706_7599675241454232436_n.jpg',
      '631677310_17863135410592307_1784183151617336395_n.jfif',
      'IMG-20260501-WA0017.jpg',
      'received_718295347292095.jpeg',
    ]),
    relatedEvents: [
      { slug: 'robotsleague-2', title: 'IEEE ESSTHS Robots League 2.0' },
      { slug: 'robots-league-3', title: 'IEEE ESSTHS Robots League 3.0' },
      { slug: 'smc-3', title: 'SMC 3.0 (Speed Modeling Challenge)' },
      { slug: 'sdc-4', title: 'SDC 4.0 (IEEE SIGHT Day Congress)' },
      { slug: 'tsyp12', title: 'TSYP12 (IEEE Tunisian Student Young Professional Congress)' },
      { slug: 'ieeextreme', title: 'IEEEXtreme 19.0' },
    ],
  },
  {
    slug: 'ajst',
    name: 'AJST',
    fullName: 'Tunisian Youth Science Association, El Alia',
    title: 'Tunisian Youth Science Association, El Alia',
    since: 'since 2020',
    location: 'El Alia, Bizerte',
    description: 'A youth science and innovation community encouraging STEM participation, creative problem solving, and collaborative learning through community-driven initiatives.',
    logo: '/Communities/Logos/AJST.png',
    icon: '🚀',
    photos: communityImageList('AJST', [
      '474126130_8899732923395098_6627906612122467292_n.jpg',
      '488408979_1222436649882533_5970289886636577858_n.jpg',
      '491293494_1243645151095016_4991186940266954620_n.jpg',
      '492337765_1243644117761786_1006609197959837061_n.jpg',
      '605138693_1456072589852270_4193772306217600208_n.jpg',
      '605146256_1455065249953004_2563523498531105948_n.jpg',
      '741365590_1632817675511093_2464940709175451496_n.jpg',
      '747778522_1637699151689612_5683180859609243406_n.jpg',
      '750785908_1643528707773323_2478333727297794032_n.jpg',
    ]),
    relatedEvents: [
      { slug: 'robokids-2026', title: 'ROBOKIDS 2026' },
      { slug: 'algo-arena-4', title: 'Algo Arena 4.0' },
      { slug: 'algo-arena-2', title: 'Algo Arena 2.0' },
      { slug: 'algo-arena-1', title: 'Algo Arena 1.0' },
    ],
  },
  {
    slug: 'tunisian-red-crescent',
    name: 'Tunisian Red Crescent, El Alia',
    fullName: 'Tunisian Red Crescent, El Alia',
    title: 'Humanitarian outreach & volunteer coordination',
    since: 'since 2023',
    location: 'El Alia, Bizerte',
    description: 'A humanitarian community involved in volunteering, community support, and mobilizing aid efforts to help people in need with practical action and solidarity.',
    logo: '/Communities/Logos/CRT.jpg',
    icon: '🤝',
    photos: communityImageList('CRT', [
      '481247300_1047956810694163_8362059026597306439_n.jpg',
      '482056870_1051483890341455_7026896222072665079_n.jpg',
      '482083166_1051483783674799_6991042061416396420_n.jpg',
      '482219590_1047956730694171_2775369847530945783_n.jpg',
      '482223160_1046391994183978_8404813678013859006_n.jpg',
      '482241601_1051483770341467_5607059090035460372_n.jpg',
      '482242077_1051483930341451_7821533392595598027_n.jpg',
      '482244396_1051483817008129_2872683757224338639_n.jpg',
    ]),
    relatedEvents: [
      { slug: 'crt-palestine-campaign', title: 'CRT Palestine Campaign' },
    ],
  },
  {
    slug: 'otddph',
    name: 'OTDDPH',
    fullName: 'Organisation Tunisienne de Défence des Droits des Personnes Handicapées',
    title: 'Community for sustainable development and human protection',
    since: 'since 2017',
    location: 'Beb Saadoun, Tunisia',
    description: 'independent non-profit organization in Tunisia founded by young citizens with disabilities following the January 14, 2011 revolution. The organization promotes a human rights-based approach to disability, advocates for full social, economic, and political inclusion, and monitors the implementation of the UN Convention on the Rights of Persons with Disabilities (CRDPH).',
    logo: '/Communities/Logos/OTDDPH.jpg',
    icon: '🌍',
    photos: communityImageList('OTDDPH', [
      '486616801_1078552040982064_1642776078035525543_n.jpg',
      '486967885_1078552070982061_2228468187657722284_n.jpg',
      'Messenger_creation_331002237966963.jpeg',
    ]),
    relatedEvents: [{ slug: 'caux-forum-2017', title: 'Caux Forum 2017' }],
  },,
  {
    slug: 'igc',
    name: 'IGC',
    fullName: 'ISITCom Google Club',
    title: 'ISITCom Google Club',
    since: 'since 2025',
    location: 'ISITCom, Hammam Sousse',
    description: 'A student-driven tech community focused on Google technologies, developer learning, and practical projects that strengthen technical confidence and collaboration.',
    logo: '/Communities/Logos/IGC.jpg',
    icon: '💡',
    photos: [],
    relatedEvents: [
      { slug: 'nuit-info-2025', title: 'Nuit d’Info 2025' },
    ],
  }
];

function CommunityModal({ community, onClose, initialChapter = null }) {
  const modalRef = useRef(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [activeChapter, setActiveChapter] = useState(initialChapter);
  const lastUserActionRef = useRef(0);
  const hasPhotos = Array.isArray(community.photos) && community.photos.length > 0;

  const activateManualSelection = (nextIndex) => {
    lastUserActionRef.current = Date.now();
    setSelectedPhotoIndex(nextIndex);
  };

  useEffect(() => {
    setSelectedPhotoIndex(0);
    setActiveChapter(initialChapter ?? null);
    lastUserActionRef.current = 0;
  }, [community.slug, initialChapter]);

  useEffect(() => {
    if (!hasPhotos || community.photos.length <= 1) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      const now = Date.now();
      if (now - lastUserActionRef.current >= 1000) {
        setSelectedPhotoIndex((currentIndex) => (currentIndex + 1) % community.photos.length);
      }
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [community.photos, hasPhotos, selectedPhotoIndex]);

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

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) {
        return;
      }

      const focusable = Array.from(modalRef.current.querySelectorAll(focusableSelectors));
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
    <div className="event-modal" onClick={onClose}>
      <div
        className="event-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="community-modal-title"
        onClick={(event) => event.stopPropagation()}
        ref={modalRef}
      >
        <button
          type="button"
          className="event-modal__close"
          aria-label="Close community details"
          onClick={onClose}
        >
          ×
        </button>

        <div className="event-modal__content">
          <div className="event-modal__details">
            <p className="event-card__meta">{community.since}</p>
            <h3 id="community-modal-title" className="event-modal__title">{community.fullName || community.name}</h3>

            <div className="event-modal__text-group">
              <h4 className="event-modal__section-label">Description</h4>
              <p className="event-modal__description">{community.description}</p>
            </div>

            {community.chapterLogos?.length ? (
              <div className="event-modal__text-group">
                <h4 className="event-modal__section-label">Chapters</h4>
                <div className="community-modal__chapter-logos" aria-label={`${community.name} chapters`}>
                  {community.chapterLogos.map((chapterLogo) => (
                    <button
                      key={`${community.slug}-${chapterLogo.name}`}
                      type="button"
                      className="community-modal__chapter-logo"
                      title={chapterLogo.label || chapterLogo.name}
                      aria-label={`Open ${chapterLogo.label || chapterLogo.name} chapter details`}
                      onClick={() => setActiveChapter(chapterLogo)}
                    >
                      <img src={chapterLogo.path} alt={`${community.name} ${chapterLogo.name} chapter logo`} />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="event-modal__text-group">
              <h4 className="event-modal__section-label">Location</h4>
              <p className="event-modal__description">{community.location || 'Location coming soon'}</p>
            </div>

            <div className="event-modal__text-group">
              <h4 className="event-modal__section-label">Events related</h4>
              {community.relatedEvents?.length ? (
                <ul className="community-modal__related-list">
                  {[...community.relatedEvents]
                    .sort((firstEvent, secondEvent) => {
                      const firstYear = getRelatedEventYear(firstEvent.slug);
                      const secondYear = getRelatedEventYear(secondEvent.slug);

                      if (secondYear !== firstYear) {
                        return secondYear - firstYear;
                      }

                      return firstEvent.title.localeCompare(secondEvent.title);
                    })
                    .map((event) => (
                      <li key={`${community.slug}-${event.slug}`} className="community-modal__related-item">
                        <button
                          type="button"
                          className="community-modal__related-button"
                          title="More details"
                          onClick={() => {
                            onClose();
                            window.location.hash = `#event-${event.slug}`;
                          }}
                        >
                          <span>{event.title}</span>
                        </button>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="event-modal__description event-modal__description--muted">Related events coming soon</p>
              )}
            </div>
          </div>

          <div className="event-modal__gallery">
            {community.photos?.length ? (
              <>
                <div className="event-modal__gallery-main">
                  <button
                    type="button"
                    className="event-modal__nav event-modal__nav--prev"
                    aria-label={`Previous photo for ${community.name}`}
                    onClick={() => {
                      activateManualSelection((selectedPhotoIndex - 1 + community.photos.length) % community.photos.length);
                    }}
                  >
                    ‹
                  </button>

                  <img src={community.photos[selectedPhotoIndex]} alt={`${community.name} community photo ${selectedPhotoIndex + 1}`} />

                  <button
                    type="button"
                    className="event-modal__nav event-modal__nav--next"
                    aria-label={`Next photo for ${community.name}`}
                    onClick={() => {
                      activateManualSelection((selectedPhotoIndex + 1) % community.photos.length);
                    }}
                  >
                    ›
                  </button>
                </div>

                <div className="event-modal__thumbs" aria-label={`${community.name} photo gallery`}>
                  {community.photos.map((photo, index) => (
                    <button
                      key={`${community.slug}-photo-${index}`}
                      type="button"
                      className={`event-modal__thumb ${index === selectedPhotoIndex ? 'is-active' : ''}`}
                      aria-label={`Open ${community.name} photo ${index + 1}`}
                      onClick={() => activateManualSelection(index)}
                    >
                      <img src={photo} alt={`${community.name} photo ${index + 1}`} />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="event-modal__empty">
                <span>No photos added yet</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeChapter && <ChapterDetailModal chapter={activeChapter} onClose={() => setActiveChapter(null)} />}
    </div>
  );
}

function ChapterDetailModal({ chapter, onClose }) {
  if (!chapter) {
    return null;
  }

  const handleClose = (event) => {
    event?.stopPropagation();
    onClose();
  };

  return (
    <div className="community-chapter-modal" onClick={handleClose}>
      <div
        className="community-chapter-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chapter-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="community-chapter-modal__close"
          aria-label="Close chapter details"
          onClick={handleClose}
        >
          ×
        </button>

        <div className="community-chapter-modal__content">
          <div className="community-chapter-modal__logo-wrap">
            <img src={chapter.path} alt={`${chapter.label || chapter.name} chapter logo`} />
          </div>

          <div className="community-chapter-modal__text">
            <h4 id="chapter-modal-title" className="community-modal__section-label community-modal__section-label--chapter">
              {chapter.label || chapter.name}
            </h4>
            <p className="community-modal__description">{chapter.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const openCommunityBySlug = (slug, chapterName = null) => {
  const matchedCommunity = clubs.find((community) => community.slug === slug);
  if (!matchedCommunity) {
    return;
  }

  const safeChapter = chapterName ? decodeURIComponent(chapterName) : null;
  const chapterMatch = safeChapter
    ? matchedCommunity.chapterLogos?.find((chapter) => {
        const chapterKey = chapter.name.toLowerCase();
        const chapterLabel = (chapter.label || chapter.name).toLowerCase();
        return chapterKey === safeChapter.toLowerCase() || chapterLabel.includes(safeChapter.toLowerCase());
      })
    : null;

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-community', { detail: { slug, chapter: safeChapter } }));
  }

  return { matchedCommunity, chapterMatch };
};

if (typeof window !== 'undefined') {
  window.openCommunityModal = (slug, chapterName = null) => {
    const result = openCommunityBySlug(slug, chapterName);
    if (!result) {
      return false;
    }

    return true;
  };
}

export default function Community() {
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);

  useEffect(() => {
    const syncCommunityFromHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith('#community-')) {
        return;
      }

      const [hashPath, queryString = ''] = hash.split('?');
      const slug = hashPath.replace('#community-', '');
      const chapterQuery = new URLSearchParams(queryString).get('chapter');
      const matchedCommunity = clubs.find((community) => community.slug === slug);

      if (matchedCommunity) {
        setActiveCommunity(matchedCommunity);
        const matchedChapter = matchedCommunity.chapterLogos?.find((chapter) => {
          if (!chapterQuery) {
            return false;
          }

          const chapterKey = chapter.name.toLowerCase();
          const chapterLabel = (chapter.label || chapter.name).toLowerCase();
          return chapterKey === chapterQuery.toLowerCase() || chapterLabel.includes(chapterQuery.toLowerCase());
        });

        setActiveChapter(matchedChapter ?? null);
        document.getElementById('community')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const openCommunityFromEvent = (event) => {
      const slug = event.detail?.slug;
      if (!slug) {
        return;
      }

      const matchedCommunity = clubs.find((community) => community.slug === slug);
      if (!matchedCommunity) {
        return;
      }

      const chapterName = event.detail?.chapter;
      const matchedChapter = chapterName
        ? matchedCommunity.chapterLogos?.find((chapter) => {
            const chapterKey = chapter.name.toLowerCase();
            const chapterLabel = (chapter.label || chapter.name).toLowerCase();
            return chapterKey === chapterName.toLowerCase() || chapterLabel.includes(chapterName.toLowerCase());
          })
        : null;

      setActiveCommunity(matchedCommunity);
      setActiveChapter(matchedChapter ?? null);
      document.getElementById('community')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    syncCommunityFromHash();
    window.addEventListener('hashchange', syncCommunityFromHash);
    window.addEventListener('open-community', openCommunityFromEvent);

    return () => {
      window.removeEventListener('hashchange', syncCommunityFromHash);
      window.removeEventListener('open-community', openCommunityFromEvent);
    };
  }, []);

  return (
    <div id="community" className="container">
      <h2 className="section__title">Community & Leadership</h2>
      <div className="community__grid">
        {clubs.map((club) => (
          <button
            key={club.slug}
            type="button"
            className="community-card"
            aria-haspopup="dialog"
            aria-expanded={activeCommunity?.slug === club.slug}
            onClick={() => {
              setActiveCommunity(club);
              setActiveChapter(null);
            }}
          >
            <div className="community-card__logo community-card__logo--image" aria-label={`${club.name} logo`}>
              <img src={club.logo} alt={`${club.name} logo`} className="community-card__image" />
            </div>
            <div className="community-card__name">{club.name}</div>
            <div className="community-card__detail">{club.title}</div>
            <div className="community-card__since">{club.since}</div>
          </button>
        ))}
      </div>

      {activeCommunity && (
        <CommunityModal
          community={activeCommunity}
          initialChapter={activeChapter}
          onClose={() => {
            setActiveCommunity(null);
            setActiveChapter(null);
          }}
        />
      )}
    </div>
  );
}
