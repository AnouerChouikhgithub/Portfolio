const clubs = [
  { name: 'IGC', detail: 'ISITCom Google Club', since: 'since 2025' },
  { name: 'IEEE ESSTHS SB', detail: '', since: 'since 2024' },
  { name: 'Tunisian Red Crescent, El Alia', detail: '', since: 'since 2023' },
  { name: 'AJST', detail: 'Tunisian Youth Science Association, El Alia', since: 'since 2020' },
]

export default function Community() {
  return (
    <div className="container">
      <h2 className="section__title">Community & Leadership</h2>
      <div className="community__grid">
        {clubs.map(c => (
          <div key={c.name} className="community-card">
            <div className="community-card__name">{c.name}</div>
            {c.detail && <div className="community-card__detail">{c.detail}</div>}
            <div className="community-card__since">{c.since}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
