import { FaLinkedin } from "react-icons/fa";
import { PiGithubLogoLight } from "react-icons/pi";
import { SiGmail } from "react-icons/si";
import { FaInstagram } from "react-icons/fa6";


export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__content">
        <div className="footer__copy">© 2025 Anouer Chouikh. All rights reserved.</div>
        <nav className="footer__nav" aria-label="Footer">
          {['Home','About', 'Skills', 'Projects', 'Community', 'Events'].map(s => (
            <a key={s} className="footer__link" href={'#'+s.toLowerCase()}>{s}</a>
          ))}
        </nav>
        <div className="footer__social">
          <a className="footer__social-link" href="mailto:anouer.chouikh2005@gmail.com" aria-label="Email" ><SiGmail /></a>
          <a className="footer__social-link" href="https://github.com/AnouerChouikhgithub" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><PiGithubLogoLight /></a>
          <a className="footer__social-link" href="https://www.linkedin.com/in/anouer-chouikh-303306220" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a className="footer__social-link" href="https://www.instagram.com/anouerchouikhh" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram />  </a>

        </div>
      </div>
    </footer>
  )
}


