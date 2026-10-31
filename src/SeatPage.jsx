import SeatMap from './SeatMap'
import { fmt } from './data'

export default function SeatPage({ bus, route, seats, soldExtra, gender, setGender, genderOf, fam, setFam, onToggle, onBack, onContinue }) {
  const famN = fam.m + fam.w + fam.c
  const step = (k, d) => {
    const n = { ...fam, [k]: fam[k] + d }
    const total = n.m + n.w + n.c
    if (n[k] < 0 || total < 2 || total > 6 || n.m + n.w < 1) return
    setFam(n)
  }
  const family = gender === 'P' || seats.some((id) => genderOf(id) === 'P')
  const ok = seats.length > 0 && (!family || seats.length === famN)
  const decks = bus.sleeper ? [['L', 'Lower deck'], ['U', 'Upper deck']] : [['', 'Seats']]
  return (
    <>
      <button type="button" className="back" onClick={onBack}>← Back to buses</button>
      <div className="sp">
        <div className="spmain">
          <h2>{bus.op}</h2>
          <div className="mute" style={{ marginBottom: 12 }}>
            {bus.type} · {route.from} to {route.to} · {route.date} · {fmt(bus.dep)} to {fmt(bus.dep + bus.dur)}
          </div>
          <div className="legend">
            <span><i className="la" />Available</span>
            <span><i className="lm" />Booked by male</span>
            <span><i className="lf" />Booked by female</span>
            <span><i className="lp" />Booked by family</span>
            <span><i className="sm" />Your pick (male)</span>
            <span><i className="sf" />Your pick (female)</span>
            <span><i className="sp2" />Your pick (family)</span>
          </div>
          <div className="mute" style={{ fontSize: 12, marginBottom: 12 }}>A seat beside a booked seat can only be booked by the same gender.</div>
          <div className="decks">
            {decks.map(([d, label]) => (
              <div key={d}>
                <h3>{label}</h3>
                <SeatMap bus={bus} deck={d} selected={seats} soldExtra={soldExtra} genderOf={genderOf} gender={gender} onToggle={onToggle} />
              </div>
            ))}
          </div>
        </div>

        <div className="sumcard">
          <b>Booking next seat for</b>
          <div className="deckbtn" style={{ marginTop: 8 }}>
            {[['M', 'Male'], ['F', 'Female'], ['P', 'Family']].map(([g, label]) => (
              <button type="button" key={g} data-g={g} aria-pressed={gender === g} onClick={() => setGender(g)}>{label}</button>
            ))}
          </div>
          <div className="mute" style={{ fontSize: 12, marginTop: 6 }}>Family seats can sit beside anyone.</div>
          {gender === 'P' && (
            <div className="fbox">
              <b>Who is travelling?</b>
              {[['m', 'Men (adult)'], ['w', 'Women (adult)'], ['c', 'Children (under 12)']].map(([k, label]) => (
                <div className="fr" key={k}>
                  <span>{label}</span>
                  <span className="step">
                    <button type="button" aria-label={`Fewer ${label}`} onClick={() => step(k, -1)}>−</button>
                    <b>{fam[k]}</b>
                    <button type="button" aria-label={`More ${label}`} onClick={() => step(k, 1)}>+</button>
                  </span>
                </div>
              ))}
              <div className="mute">Total {famN}: pick {famN} seats.</div>
            </div>
          )}
          <div className="sum">
            <div className="ln"><span className="mute">Seats</span><span>{seats.length ? seats.join(', ') : 'None yet'}</span></div>
            <div className="ln"><span className="mute">Fare</span><b>₹{seats.length * bus.price}</b></div>
            {seats.length >= 6 && <div className="mute">Maximum of 6 seats selected.</div>}
            {family && seats.length !== famN && <div className="mute" style={{ marginTop: 8 }}>Select {famN} seats for your family ({seats.length} picked).</div>}
            <button type="button" className="view wide" disabled={!ok} onClick={onContinue}>Continue to book</button>
          </div>
        </div>
      </div>
    </>
  )
}
