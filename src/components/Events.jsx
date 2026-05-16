const events = [
  { name: 'SMC 3.0 (Speed Modeling Challenge)', detail: 'Jury', since: '2026' },
  { name: 'SDC 4.0 (IEEE Dight Day Congress)', detail: 'Participant', since: '2026' },
  { name: 'Algo Arena 4.0', detail: 'Problems Manager', since: '2025' },
  { name: 'Nettawaa Mall', detail: 'Participant', since: '2025' },
  { name: 'Nuit d\'Info 2025', detail: 'Participant', since: '2025' },
  { name: 'Robots League 3.0', detail: 'Junior Challenge Jury', since: '2025' },
  { name: 'IEEEXtreme', detail: 'Participant', since: '2025' },
  { name: 'TSYP12 (IEEE Tunisian Student Young Professional Congress)', detail: 'Participant', since: '2024' },
  { name: 'IEEE ESSTHS RobotsLeague 2.0', detail: 'Junior Challenge Model Chief', since: '2024' },
  { name: 'Algo Arena 2.0', detail: 'Treasurer, and Logistics Manager', since: '2023' },
  { name: 'CRT Palestine Campaign', detail: 'Participation during the 2023 Palestine crisis', since: '2023' },
  { name: 'National Robotics Weekend - NRW', detail: 'Junior Startup Participant', since: '2023' },
  { name: 'Algo Arena 1.0', detail: 'Problem Solving Challenge, Participant', since: '2023' },
  { name: 'FSB Smartech', detail: 'Junior Challenge Participant', since: '2022' },
  { name: 'ENISo Smart', detail: 'Fighter Challenge Participant', since: '2022' },
  { name: 'ENISo Smart', detail: 'Junior Challenge Participant', since: '2022' },
  { name: 'Caux Forum', detail: 'Representative for Tunisian youth and children with disabilities in Swiziland with (OTDDPH)', since: '2017' }

];



export default function Events() {
  return (
    <div className="container">
      <h2 className="section__title">Events I went to</h2>
      <div className="events__grid">
        {events.map(e => (
          <div key={e.name} className="events-card">
            <div className="events-card__name">{e.name}</div>
            {e.detail && <div className="events-card__detail">{e.detail}</div>}
            <div className="events-card__since">{e.since}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
