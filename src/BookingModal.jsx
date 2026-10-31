import { useState } from 'react'
import { fmt } from './data'

export default function BookingModal({ bus, seats, route, family, fam, account, onClose, onPaid }) {
  const [name, setName] = useState(account?.name ?? '')
  const [phone, setPhone] = useState(account?.phone ?? '')
  // one row per traveller: men first, then women, then children
  const kinds = [...Array(fam.m).fill('m'), ...Array(fam.w).fill('w'), ...Array(fam.c).fill('c')]
  const TYPE = { m: 'Man', w: 'Woman', c: 'Child' }
  const [travs, setTravs] = useState(() => kinds.map(() => ({ name: '', age: '' })))
  const [travText, setTravText] = useState('')
  const [coupon, setCoupon] = useState('')
  const [off, setOff] = useState(0)
  const [note, setNote] = useState(null)   // { ok, text }
  const [pnr, setPnr] = useState(null)
  const total = Math.round(seats.length * bus.price * (1 - off))

  const apply = () => {
    const ok = coupon.trim().toUpperCase() === 'BUSBEE10'
    setOff(ok ? 0.1 : 0)
    setNote({ ok, text: ok ? 'BUSBEE10 applied: 10% off.' : 'That code isn’t valid.' })
  }

  const pay = () => {
    if (!name.trim()) return setNote({ ok: false, text: 'Enter the passenger’s name.' })
    if (!/^[6-9]\d{9}$/.test(phone.trim())) return setNote({ ok: false, text: 'Enter a valid 10 digit mobile number.' })
    let trav = ''
    if (family) {
      if (travs.some((t) => !t.name.trim() || t.age === ''))
        return setNote({ ok: false, text: 'Enter the name and age of every traveller.' })
      if (travs.some((t, i) => (kinds[i] === 'c' ? +t.age > 11 || +t.age < 0 : +t.age < 12 || +t.age > 99)))
        return setNote({ ok: false, text: 'Adults must be 12 or older and children under 12.' })
      const P = (n, one, many) => (n ? `${n} ${n > 1 ? many : one}` : '')
      trav = [P(fam.m, 'man', 'men'), P(fam.w, 'woman', 'women'), P(fam.c, 'child', 'children')].filter(Boolean).join(', ')
    }
    setTravText(trav)
    const code = 'BB' + Math.random().toString(36).slice(2, 8).toUpperCase()
    setPnr(code)
    onPaid({ pnr: code, total, trav })
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {pnr ? (
          <>
            <h3>Ticket confirmed</h3>
            <p className="mute">{name}, your seats {seats.join(', ')} on {bus.op} are booked.</p>
            <div className="pnr">{pnr}</div>
            <p className="mute">Keep this PNR for boarding. Amount paid: ₹{total}.{travText ? ` Travelling: ${travText}.` : ''}</p>
            <div className="act"><button type="button" className="p" onClick={onClose}>Done</button></div>
          </>
        ) : (
          <>
            <h3>{route.from} to {route.to}</h3>
            <div className="mute">{bus.op} · {bus.type} · {route.date} · departs {fmt(bus.dep)}</div>
            <label>Boarding point
              <select>
                <option>{route.from} Main Bus Stand</option>
                <option>{route.from} Bypass Junction</option>
                <option>{route.from} Railway Station</option>
              </select>
            </label>
            <label>Dropping point
              <select>
                <option>{route.to} Main Bus Stand</option>
                <option>{route.to} City Centre</option>
              </select>
            </label>
            <label>Passenger name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" /></label>
            <label>Mobile number<input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="numeric" maxLength={10} placeholder="10 digit number" /></label>
            {family && (
              <>
                <b style={{ display: 'block', marginTop: 12 }}>Travellers ({kinds.length})</b>
                {travs.map((t, i) => (
                  <div className="trv" key={i}>
                    <label>Seat {seats[i]}: name
                      <input value={t.name} placeholder="Full name" onChange={(e) => setTravs(travs.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                    </label>
                    <label>Age
                      <input type="number" min={kinds[i] === 'c' ? 0 : 12} max={kinds[i] === 'c' ? 11 : 99} value={t.age} onChange={(e) => setTravs(travs.map((x, j) => (j === i ? { ...x, age: e.target.value } : x)))} />
                    </label>
                    <label>Type<input value={TYPE[kinds[i]]} disabled /></label>
                  </div>
                ))}
              </>
            )}
            <label>Coupon code
              <span className="cp">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="BUSBEE10" />
                <button type="button" onClick={apply}>Apply</button>
              </span>
            </label>
            <p className="total"><span>Seats {seats.join(', ')}</span><b>₹{total}</b></p>
            {note && <p className={note.ok ? 'okmsg' : 'err'} role="alert">{note.text}</p>}
            <div className="act">
              <button type="button" onClick={onClose}>Back</button>
              <button type="button" className="p" onClick={pay}>Pay ₹{total}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
