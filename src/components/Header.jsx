export default function Header() {
  return (
    <header className="header">
      <nav className="nav__container container" aria-label="Primary">
        <a href="#home" className="nav__logo" aria-label="Go to home">Anouer</a>
        <ul className="nav__list">
          {[
            ['Home', '#home'],
            ['About', '#about'],
            ['Skills', '#skills'],
            ['Projects', '#projects'],
            ['Community', '#community'],
            ['Events', '#events'],
            ['Goals', '#goals'],
            ['Contact', '#contact'],
          ].map(([label, href]) => (
            <li key={href}><a className="nav__link" href={href}>{label}</a></li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
