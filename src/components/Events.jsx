import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import MixedText from './MixedText';
import CrossfadeImage from './CrossfadeImage';
import useModalAccessibility from '../hooks/useModalAccessibility';
import useAutoCarousel from '../hooks/useAutoCarousel';
import { scrollToId } from '../motion/lenisStore';

const imageList = (folder, files) => files.map((file) => `/Events/${folder}/${file}`);

const renderProjectLinksInText = (text, onClose, isRtl = false) => {
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
      parts.push(<MixedText key={`chunk-${cursor}`} text={text.slice(cursor)} isRtl={isRtl} />);
      break;
    }

    if (bestMatch.matchIndex > cursor) {
      parts.push(
        <MixedText
          key={`chunk-${cursor}`}
          text={text.slice(cursor, bestMatch.matchIndex)}
          isRtl={isRtl}
        />
      );
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
        aria-label={`${bestMatch.matchedText}`}
        title={bestMatch.matchedText}
      >
        <MixedText text={bestMatch.matchedText} isRtl={isRtl} />
      </a>
    );

    cursor = bestMatch.matchIndex + bestMatch.matchedText.length;
  }

  return parts;
};

export const organizedEvents = [
  {
    slug: 'robokids-2026',
    title: 'ROBOKIDS 2026',
    year: 2026,
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
    year: 2026,
    photos: imageList('SMC3.0', ['IMG-20260501-WA0017.jpg', 'IMG-20260501-WA0009.jpg']),
  },
  {
    slug: 'algo-arena-4',
    title: 'Algo Arena 4.0',
    year: 2025,
    photos: imageList('AlgoAreana4.0', [
      '605146256_1455065249953004_2563523498531105948_n.jpg',
      '605138693_1456072589852270_4193772306217600208_n.jpg',
      '601860160_1454388580020671_3862581073818534666_n.jpg',
    ]),
  },
  {
    slug: 'robots-league-3',
    title: 'IEEE ESSTHS Robots League 3.0',
    year: 2025,
    photos: imageList('RobotsLeague3.0', [
      '632827946_17863135260592307_7310623845599494380_n.jfif',
      '631677310_17863135410592307_1784183151617336395_n.jfif',
      '632948615_17863135245592307_8756060148406342015_n.jfif',
    ]),
  },
  {
    slug: 'robotsleague-2',
    title: 'IEEE ESSTHS Robots League 2.0',
    year: 2024,
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
    year: 2023,
    photos: imageList('AlgoArena2.0', ['DSC_0208.JPG', 'DSC_0064.JPG', 'DSC_0021.JPG']),
  },
];

export const otherEvents = [
  {
    slug: 'eniso-smart-challenge',
    title: 'ENISo Smart Challenge',
    year: 2022,
    photos: imageList('EnisoSmartChallenge', ['IMG_20220424_180752_811.jpg']),
  },
  {
    slug: 'fsb-smartech',
    title: 'FSB SmarTech',
    year: 2022,
    photos: imageList('FSBSmartChallenge', [
      '481775323_9115234118511643_4969609786711446471_n.jpg',
      '481252779_9115233821845006_7288383613134083637_n.jpg',
      '480935962_9115234301844958_1977117138749174010_n.jpg',
    ]),
  },
  {
    slug: 'esprit-ras-robots-2025',
    title: 'ESPRIT RAS Robots 2025',
    year: 2025,
    photos: imageList('Esprit Ras Robots', ['received_609273398797693.jpeg', 'received_718295347292095.jpeg']),
  },
  {
    slug: 'tsyp12',
    title: 'TSYP12 (IEEE Tunisian Student Young Professional Congress)',
    year: 2024,
    photos: imageList('TSYP12', ['20241224_005606_563.jpg']),
  },
  {
    slug: 'nrw',
    title: 'National Robotics Weekend (NRW) 5.0',
    year: 2023,
    photos: imageList('NRW', [
      '476436877_929557102638590_614182522696266983_n.jpg',
      '440751760_748925197368449_1967877939820872143_n.jpg',
    ]),
  },
  {
    slug: 'crt-palestine-campaign',
    title: 'CRT Palestine Campaign',
    year: 2023,
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
    year: 2023,
    photos: imageList('AlgoArena1.0', [
      '487124730_1216482703811261_2809329442559644233_n.jpg',
      '487016477_1216482720477926_3872804814145809501_n.jpg',
      '486951932_1216482493811282_2040708878349475201_n.jpg',
    ]),
  },
  {
    slug: 'nettawaa-mall',
    title: 'Nettawaa Mall',
    year: 2025,
    photos: imageList('NettawaaMall', ['IMG_0079_20251217_125506_3600 (1).jpeg']),
  },
  {
    slug: 'nuit-info-2025',
    title: 'Nuit d’Info 2025',
    year: 2025,
    photos: [],
  },
  {
    slug: 'ieeextreme',
    title: 'IEEEXtreme 19.0',
    year: 2025,
    photos: [],
  },
  {
    slug: 'sdc-4',
    title: 'SDC 4.0 (IEEE SIGHT Day Congress)',
    year: 2026,
    photos: imageList('SDC4.0', ['1776703382796.jfif']),
  },
  {
    slug: 'el-alia-robots-1',
    title: 'EL ALia ROBOTS 1.0',
    year: 2026,
    photos: imageList('ELAliaRobots1.0', ['IMG-20260830-WA0028.jpg']),
  },
  {
    slug: 'caux-forum',
    title: 'Caux Forum',
    year: 2017,
    photos: imageList('CAUXForum', [
      'Messenger_creation_352601875795236.jpeg',
      'Messenger_creation_340285383723292.jpeg',
      'Messenger_creation_331002237966963.jpeg',
      'Messenger_creation_2199422626856669.jpeg',
    ]),
  },
];

export const orderedParticipatedEvents = [...otherEvents].sort((a, b) => b.year - a.year);

function EventModal({ event, onClose }) {
  const { t, isRtl } = useI18n();
  const modalRef = useRef(null);
  const hasPhotos = Array.isArray(event.photos) && event.photos.length > 0;
  const carousel = useAutoCarousel(event.photos, 1500);
  const selectedPhotoIndex = carousel.index;
  const activateManualSelection = carousel.selectIndex;

  useModalAccessibility({ panelRef: modalRef, onClose });

  const meta = t(`events.items.${event.slug}.meta`);
  const description = t(`events.items.${event.slug}.description`);
  const role = t(`events.items.${event.slug}.role`);

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
          <div className="event-modal__details modal-scroll-region">
            <p className="event-card__meta">
              <MixedText text={meta} isRtl={isRtl} />
            </p>
            <h3 id="event-modal-title" className="event-modal__title">
              <MixedText text={event.title} isRtl={isRtl} />
            </h3>

            <div className="event-modal__text-group">
              {description ? (
                <>
                  <h4 className="event-modal__section-label">{t('common.eventOverview')}</h4>
                  <p className="event-modal__description">
                    {renderProjectLinksInText(description, onClose, isRtl)}
                  </p>
                </>
              ) : (
                <p className="event-modal__description event-modal__description--muted">{t('common.overviewSoon')}</p>
              )}
            </div>

            <div className="event-modal__text-group">
              {role ? (
                <>
                  <h4 className="event-modal__section-label">{t('common.myRole')}</h4>
                  <p className="event-modal__description">
                    {renderProjectLinksInText(role, onClose, isRtl)}
                  </p>
                </>
              ) : (
                <p className="event-modal__description event-modal__description--muted">{t('common.roleSoon')}</p>
              )}
            </div>
          </div>

          <div className="event-modal__gallery modal-scroll-region" {...carousel.carouselProps}>
            {hasPhotos ? (
              <>
                <div className="event-modal__gallery-main">
                  <button
                    type="button"
                    className="event-modal__nav event-modal__nav--prev"
                    aria-label={t('common.prevPhoto')}
                    onClick={() => {
                      activateManualSelection((selectedPhotoIndex - 1 + event.photos.length) % event.photos.length);
                    }}
                  >
                    ‹
                  </button>

                  <CrossfadeImage
                    src={event.photos[selectedPhotoIndex]}
                    alt={`${event.title} - ${selectedPhotoIndex + 1}`}
                  />

                  <button
                    type="button"
                    className="event-modal__nav event-modal__nav--next"
                    aria-label={t('common.nextPhoto')}
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
                      aria-label={`${t('common.viewPhoto')} ${index + 1}`}
                      onClick={() => activateManualSelection(index)}
                    >
                      <img src={photo} alt={`${event.title} ${index + 1}`} />
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
  const { t, isRtl } = useI18n();
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
        scrollToId('events');
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
        {organizedEvents.map((event) => {
          const meta = t(`events.items.${event.slug}.meta`);
          const preview = t(`events.items.${event.slug}.preview`);

          return (
            <button
              type="button"
              key={event.slug}
              className="events-card"
              aria-haspopup="dialog"
              aria-expanded={activeEvent?.slug === event.slug}
              onClick={() => setActiveEvent(event)}
            >
              <span className="events-card__meta">
                <MixedText text={meta} isRtl={isRtl} />
              </span>
              <h3 className="events-card__title">
                <MixedText text={event.title} isRtl={isRtl} />
              </h3>
              <p className="events-card__description">
                <MixedText text={preview || 'Details coming soon'} isRtl={isRtl} />
              </p>
            </button>
          );
        })}
      </div>

      <div className="events__other">
        <h3 className="events__subheading">{t('sections.alsoParticipated')}</h3>
        <ul className="events__list">
          {orderedParticipatedEvents.map((event) => {
            const meta = t(`events.items.${event.slug}.meta`);

            return (
              <li key={event.slug} className="events__list-item">
                <button
                  type="button"
                  className="events__list-button"
                  aria-haspopup="dialog"
                  aria-expanded={activeEvent?.slug === event.slug}
                  onClick={() => setActiveEvent(event)}
                >
                  <span className="events__list-name">
                    <MixedText text={event.title} isRtl={isRtl} />
                  </span>
                  <span className="events__list-meta">
                    <MixedText text={meta} isRtl={isRtl} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {activeEvent && <EventModal event={activeEvent} onClose={() => setActiveEvent(null)} />}
    </div>
  );
}
