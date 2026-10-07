import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import MixedText from './MixedText';
import WebpImage from './WebpImage';
import SubScreen from './overlay/SubScreen';
import CinematicGallery from './gallery/CinematicGallery';
import ChapterConstellation from './gallery/ChapterConstellation';
import ModalErrorBoundary from './ModalErrorBoundary';
import { scrollToId } from '../motion/lenisStore';

const communityImageList = (folder, files) => files.map((file) => `/Communities/${folder}/${file}`);

/** Extracts the leading year from an i18n "since" string (e.g. "Since 2024"). */
const sinceYear = (since) => {
  const match = typeof since === 'string' ? since.match(/\d{4}/) : null;
  return match ? match[0] : '';
};

const ieeeChapterLogos = [
  {
    name: 'CS',
    label: 'IEEE ESSTHS SB CS Chapter',
    path: '/Communities/Logos/IEEE Chapters/IEEE-ESSTHS-CS.jpg',
  },
  {
    name: 'IIP',
    label: 'IEEE ESSTHS SB IIP Joint Chapter',
    path: '/Communities/Logos/IEEE Chapters/IEEE-ESSTHS-IIP.jpg',
  },
  {
    name: 'RAS',
    label: 'IEEE ESSTHS SB RAS Chapter',
    path: '/Communities/Logos/IEEE Chapters/IEEE-ESSTHS-RAS.jpg',
  },
  {
    name: 'SIGHT',
    label: 'ESSTHS SB SIGHT Group',
    path: '/Communities/Logos/IEEE Chapters/IEEE-ESSTHS-SIGHT.jpg',
  },
  {
    name: 'WIE',
    label: 'IEEE ESSTHS SB WIE Chapter',
    path: '/Communities/Logos/IEEE Chapters/IEEE-ESSTHS-WIE.jpg',
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
    logo: '/Communities/Logos/OTDDPH.jpg',
    icon: '🌍',
    photos: communityImageList('OTDDPH', [
      '486616801_1078552040982064_1642776078035525543_n.jpg',
      '486967885_1078552070982061_2228468187657722284_n.jpg',
      'Messenger_creation_331002237966963.jpeg',
    ]),
    relatedEvents: [{ slug: 'caux-forum', title: 'Caux Forum' }],
  },
  {
    slug: 'igc',
    name: 'IGC',
    fullName: 'ISITCom Google Club',
    logo: '/Communities/Logos/IGC.jpg',
    icon: '💡',
    photos: [],
    relatedEvents: [
      { slug: 'nuit-info-2025', title: 'Nuit d’Info 2025' },
    ],
  },
];

function CommunityModal({ community, onClose, initialChapter = null }) {
  const { t, isRtl } = useI18n();
  const modalRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(initialChapter);
  const hasPhotos = Array.isArray(community.photos) && community.photos.length > 0;
  const closeChapter = useCallback(() => setActiveChapter(null), []);

  useModalAccessibility({ panelRef: modalRef, onClose });

  const since = t(`community.items.${community.slug}.since`);
  const location = t(`community.items.${community.slug}.location`);
  const description = t(`community.items.${community.slug}.description`);

  useEffect(() => {
    setActiveChapter(initialChapter ?? null);
  }, [community.slug, initialChapter]);

  const stageCaption = hasPhotos ? (
    <p className="cine-caption" aria-hidden="true">
      <span className="cine-caption__name">{community.name}</span>
      <span className="cine-caption__year">{sinceYear(since) || ''}</span>
    </p>
  ) : null;

  return (
    <>
    <div
      className="event-modal__panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="community-modal-title"
      ref={modalRef}
    >
      <button
        type="button"
        className="event-modal__close"
        aria-label={t('common.closeCommunity')}
        onClick={onClose}
      >
        ×
      </button>

        <div className="event-modal__content">
          <div className="event-modal__details modal-scroll-region">
            <p className="event-card__meta">
              <MixedText text={since} isRtl={isRtl} />
            </p>
            <h3 id="community-modal-title" className="event-modal__title">
              <MixedText text={community.fullName || community.name} isRtl={isRtl} />
            </h3>

            <div className="event-modal__text-group">
              <h4 className="event-modal__section-label">{t('common.description')}</h4>
              <p className="event-modal__description">
                <MixedText text={description} isRtl={isRtl} />
              </p>
            </div>

            {community.chapterLogos?.length ? (
              <div className="event-modal__text-group">
                <h4 className="event-modal__section-label">{t('common.chapters')}</h4>
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
                      <WebpImage src={chapterLogo.path} alt={`${community.name} ${chapterLogo.name} chapter logo`} />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="event-modal__text-group">
              <h4 className="event-modal__section-label">{t('common.location')}</h4>
              <p className="event-modal__description">
                <MixedText text={location || 'Location coming soon'} isRtl={isRtl} />
              </p>
            </div>

            <div className="event-modal__text-group">
              <h4 className="event-modal__section-label">{t('common.eventsRelated')}</h4>
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
                <p className="event-modal__description event-modal__description--muted">{t('common.relatedSoon')}</p>
              )}
            </div>
          </div>

          <div className="event-modal__gallery community-modal__gallery modal-scroll-region">
            <CinematicGallery
              items={hasPhotos ? community.photos : []}
              variant="community"
              altBuilder={(photo, i) => `${community.name} — photo ${i + 1}`}
              labels={{
                play: t('common.play'),
                pause: t('common.pause'),
                prev: t('common.previousPhoto'),
                next: t('common.nextPhoto'),
                viewPhoto: t('common.viewPhoto'),
                stage: `${community.name} — ${t('sections.community')}`,
                thumbStrip: `${community.name} photo gallery`,
              }}
              caption={stageCaption}
              renderSlideOverlay={() => <div className="cine-polaroid-frame" aria-hidden="true" />}
            />
            <ChapterConstellation
              chapterLogos={community.chapterLogos}
              onOpenChapter={setActiveChapter}
            />
          </div>
        </div>
    </div>
      {activeChapter && (
        <SubScreen
          open
          onClose={closeChapter}
          labelledBy="chapter-modal-title"
          variant="community-chapter"
        >
          <ModalErrorBoundary
            onClose={closeChapter}
            message={t('common.viewLoadError')}
            closeLabel={t('common.close')}
          >
            <ChapterDetailModal chapter={activeChapter} onClose={closeChapter} />
          </ModalErrorBoundary>
        </SubScreen>
      )}
    </>
  );
}

function ChapterDetailModal({ chapter, onClose }) {
  const { t, isRtl } = useI18n();
  const modalRef = useRef(null);
  useModalAccessibility({ panelRef: modalRef, onClose });

  if (!chapter) {
    return null;
  }

  const handleClose = (event) => {
    event?.stopPropagation();
    onClose();
  };

  const chapterDesc = t(`community.chapters.${chapter.name.toLowerCase()}`);

  return (
    <div
      className="community-chapter-modal__panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chapter-modal-title"
      ref={modalRef}
    >
        <button
          type="button"
          className="community-chapter-modal__close"
          aria-label={t('common.closeChapter')}
          onClick={handleClose}
        >
          ×
        </button>

        <div className="community-chapter-modal__content modal-scroll-region">
          <div className="community-chapter-modal__logo-wrap">
            <WebpImage src={chapter.path} alt={`${chapter.label || chapter.name} logo`} />
          </div>

          <div className="community-chapter-modal__text">
            <h4 id="chapter-modal-title" className="community-modal__section-label community-modal__section-label--chapter">
              <MixedText text={chapter.label || chapter.name} isRtl={isRtl} />
            </h4>
            <p className="community-modal__description">
              <MixedText text={chapterDesc} isRtl={isRtl} />
            </p>
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
  const { t, isRtl } = useI18n();
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
        scrollToId('community');
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
      scrollToId('community');
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
      <h2 className="section__title">{t('sections.community')}</h2>
      <div className="community__grid">
        {clubs.map((club) => {
          const title = t(`community.items.${club.slug}.title`);
          const since = t(`community.items.${club.slug}.since`);

          return (
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
                <WebpImage src={club.logo} alt={`${club.name} logo`} className="community-card__image" />
              </div>
              <div className="community-card__name">
                <MixedText text={club.name} isRtl={isRtl} />
              </div>
              <div className="community-card__detail">
                <MixedText text={title} isRtl={isRtl} />
              </div>
              <div className="community-card__since">
                <MixedText text={since} isRtl={isRtl} />
              </div>
            </button>
          );
        })}
      </div>

      {activeCommunity && (
        <ModalErrorBoundary
          onClose={() => {
            setActiveCommunity(null);
            setActiveChapter(null);
          }}
          message={t('common.viewLoadError')}
          closeLabel={t('common.close')}
        >
          <CommunityModal
            community={activeCommunity}
            initialChapter={activeChapter}
            onClose={() => {
              setActiveCommunity(null);
              setActiveChapter(null);
            }}
          />
        </ModalErrorBoundary>
      )}
    </div>
  );
}
