import { useI18n } from '../i18n/I18nProvider';
import WebpImage from './WebpImage';

export default function About() {
  const { t } = useI18n();
  return (
    <div className="container about__content">
      <div className="about__image-wrapper">
        <WebpImage className="about__image" src="/me.jpg" alt={t('common.portraitAlt')} />
      </div>
      <div>
        <h2 className="section__title">{t('sections.about')}</h2>
        <p className="about__intro">{t('about.intro')}</p>
        <div className="about__mission">
          <h3 className="about__mission-title">{t('sections.mission')}</h3>
          <p>{t('about.missionText')}</p>
        </div>
      </div>
    </div>
  )
}
