import { FaLinkedin } from "react-icons/fa";
import { PiGithubLogoLight } from "react-icons/pi";
import { SiGmail } from "react-icons/si";
import { FaInstagram } from "react-icons/fa6";
import { useI18n } from '../i18n/I18nProvider';
import SectionBackground from './SectionBackground';


export default function Footer() {
  const { t } = useI18n();
  const links = ['home', 'about', 'skills', 'projects', 'community', 'events'];
  return (
    <footer className="footer">
      <SectionBackground variant="contact" />
      <div className="container footer__content">
        <div className="footer__copy">{t('footer.copyright')}</div>
        <nav className="footer__nav" aria-label={t('nav.footer')}>
          {links.map((key) => (
            <a key={key} className="footer__link" href={`#${key}`}>{t(`nav.${key}`)}</a>
          ))}
        </nav>
        <div className="footer__social">
          <a className="footer__social-link" href="mailto:anouer.chouikh2005@gmail.com" aria-label={t('common.social.email')} title={t('common.social.email')}><SiGmail /></a>
          <a className="footer__social-link" href="https://github.com/AnouerChouikhgithub" aria-label={t('common.social.github')} title={t('common.social.github')} target="_blank" rel="noopener noreferrer"><PiGithubLogoLight /></a>
          <a className="footer__social-link" href="https://www.linkedin.com/in/anouer-chouikh-303306220" aria-label={t('common.social.linkedin')} title={t('common.social.linkedin')} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a className="footer__social-link" href="https://www.instagram.com/anouerchouikhh" aria-label={t('common.social.instagram')} title={t('common.social.instagram')} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  )
}
