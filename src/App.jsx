import { useMemo, useState } from 'react'
import { CITIES, fmt, buildBuses, seatIndex } from './data'
import SeatPage from './SeatPage'
import BookingModal from './BookingModal'
import { Nav, MyBookings } from './Nav'
import { AccountModal, TermsModal } from './Modals'
import { Ic } from './Icons'
import ContactPage from './ContactPage'
import SignUpPage from './SignUpPage'
import Footer from './Footer'
import CityInput from './CityInput'

const iso = (offset) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}
const canon = (x) => Object.keys(CITIES).find((c) => c.toLowerCase() === x.trim().toLowerCase())
const problem = (s) =>
  !s.from.trim() || !s.to.trim() ? 'Type your From and To cities, pick a travel date, then press Search buses.'
  : !CITIES[s.from] || !CITIES[s.to] ? `We couldn’t find that city. Try ${Object.keys(CITIES).join(', ')}.`
  : s.from === s.to ? 'From and To must be different cities.'
  : !s.date ? 'Choose a travel date.' : ''
const slotOf = (h) => (h < 6 ? 0 : h < 12 ? 1 : h < 18 ? 2 : 3)
const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

export default function App() {
  const [form, setForm] = useState({ from: 'Hyderabad', to: 'Bengaluru', date: iso(1) })
  const [search, setSearch] = useState(form)
  const [types, setTypes] = useState([])
  const [slots, setSlots] = useState([])
  const [sort, setSort] = useState('d')
  const [openId, setOpenId] = useState(null)
  const [gender, setGender] = useState('M')
  const [seatG, setSeatG] = useState({})  // `${busId}:${seatId}` -> 'M' | 'F'
  const [picks, setPicks] = useState({})   // busId -> seat ids
  const [sold, setSold] = useState({})     // busId -> extra sold seat indexes
  const [booking, setBooking] = useState(null)
  const [showMy, setShowMy] = useState(false)
  const [account, setAccount] = useState(null)
  const [showAcct, setShowAcct] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [view, setView] = useState('home')      // 'home' | 'contact' | 'signup'
  const [users, setUsers] = useState([])        // accounts made on the Sign up page (in memory)
  const [fam, setFam] = useState({ m: 1, w: 1, c: 0 })  // men, women, children
  const [mine, setMine] = useState([])

  const buses = useMemo(() => (problem(search) ? null : buildBuses(search.from, search.to, search.date)), [search])

  const list = useMemo(() => {
    if (!buses) return []
    const l = buses.filter(
      (b) => types.every((t) => b.type.includes(t)) && (!slots.length || slots.includes(slotOf(b.dep)))
    )
    const by = { d: (a, b) => a.dep - b.dep, p: (a, b) => a.price - b.price, r: (a, b) => b.rating - a.rating, u: (a, b) => a.dur - b.dur }
    return [...l].sort(by[sort])
  }, [buses, types, slots, sort])

  const openBus = buses ? buses.find((b) => b.id === openId) : null

  const runSearch = (f = form) => { setSearch({ ...f, from: canon(f.from) || f.from.trim(), to: canon(f.to) || f.to.trim() }); setOpenId(null); setPicks({}); setTimeout(() => document.getElementById('results')?.scrollIntoView({ block: 'start' }), 0) }
  const swap = () => { const f = { ...form, from: form.to, to: form.from }; setForm(f); runSearch(f) }

  const go = (v) => { setView(v); window.scrollTo(0, 0) }
  const onNav = (k) => {
    if (k === 'my') return setShowMy(true)
    if (k === 'reload') return window.location.reload()
    if (k === 'acct') return account ? setAccount(null) : setShowAcct(true)
    if (k === 'signin') return setShowAcct(true)
    if (k === 'contact' || k === 'signup') return go(k)
    if (k === 'theme') {
      const r = document.documentElement
      const dark = (r.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark'
      r.dataset.theme = dark ? 'light' : 'dark'
      return
    }
    if (k === 'routes') { setView('home'); return void setTimeout(() => document.getElementById('routes')?.scrollIntoView({ block: 'center' }), 0) }
    if (k === 'help') return document.getElementById('help')?.scrollIntoView({ block: 'start' })
    setView('home')   // 'home' and 'offers' both start from the home page
    if (k === 'home') { setOpenId(null); setTimeout(() => document.querySelector('.bookcard')?.scrollIntoView({ block: 'center' }), 0) }
  }
  const onRoute = (from, to) => { const f = { ...form, from, to, date: form.date || iso(1) }; setView('home'); setForm(f); runSearch(f); window.scrollTo(0, 0) }

  const toggleSeat = (bus, id) => {
    const cur = picks[bus.id] || []
    if (cur.includes(id)) setPicks({ ...picks, [bus.id]: cur.filter((s) => s !== id) })
    else if (cur.length < 6) {
      setPicks({ ...picks, [bus.id]: [...cur, id] })
      setSeatG({ ...seatG, [bus.id + ':' + id]: gender })
    }
  }

  const markBooked = (bus, seats) => {
    setSold({ ...sold, [bus.id]: { ...(sold[bus.id] || {}), ...Object.fromEntries(seats.map((s) => [seatIndex(bus, s), seatG[bus.id + ':' + s]])) } })
    setPicks({ ...picks, [bus.id]: [] })
  }

  return (
    <>
      {view !== 'signup' && <Nav onNav={onNav} account={account} view={view} />}
      {view === 'contact' && <ContactPage account={account} />}
      {view === 'signup' && (
        <SignUpPage
          users={users}
          onCreate={(u) => { setUsers([...users, u]); setAccount({ name: u.name, email: u.email, phone: u.phone }) }}
          onLogin={() => setShowAcct(true)}
          onTerms={() => setShowTerms(true)}
          onHome={() => onNav('home')}
        />
      )}
      {view === 'home' && (
      <>
      <div className={`top ${openBus ? 'compact' : ''}`}>
        <div className="wrap herowrap">
          <div className="herotxt">
            <h1 className="hero">Travel More,<br /><span className="tl">Worry Less!</span></h1>
            <p>Join BusBee and make your journey easier. Search bus routes, choose your seats and book your ticket in a few clicks.</p>
            <div className="feats">
              <div className="feat"><span className="fi"><Ic n="bus" /></span><div><b>Book Tickets in Seconds</b><small>Search, pick seats and pay online</small></div></div>
              <div className="feat"><span className="fi"><Ic n="shield" /></span><div><b>Safe &amp; Secure Bookings</b><small>Verified operators and safe payments</small></div></div>
              <div className="feat"><span className="fi"><Ic n="headset" /></span><div><b>24/7 Customer Support</b><small>Help whenever you need it</small></div></div>
            </div>
          </div>

          <div className="bookcard" role="search">
            <h2>Book Your Trip</h2>
            <p className="sub">Find the perfect bus for your journey</p>
            <CityInput id="from" label="From" placeholder="Select departure city" value={form.from} onChange={(v) => setForm({ ...form, from: v })}
              onPick={() => document.getElementById('to')?.focus()} onEnter={() => runSearch()} />
            <button type="button" className="swap" aria-label="Swap cities" onClick={swap}>⇅</button>
            <CityInput id="to" label="To" placeholder="Select destination city" value={form.to} onChange={(v) => setForm({ ...form, to: v })}
              onEnter={() => runSearch()} />
            <div className="fld">
              <label htmlFor="dt">Journey Date</label>
              <div className="inw">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
                <input id="dt" type="date" min={iso(0)} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <button type="button" className="go" onClick={() => runSearch()}>Search Available Buses</button>
            <p className="fine">* All prices include taxes and fees.</p>
          </div>
        </div>
      </div>
      <div className="wrap">
        {openBus ? (
          <SeatPage
            bus={openBus}
            route={search}
            seats={picks[openBus.id] || []}
            soldExtra={sold[openBus.id] || {}}
            gender={gender}
            setGender={setGender}
            fam={fam}
            setFam={setFam}
            genderOf={(id) => seatG[openBus.id + ':' + id]}
            onToggle={(id) => toggleSeat(openBus, id)}
            onBack={() => setOpenId(null)}
            onContinue={() => setBooking({ bus: openBus, seats: picks[openBus.id] || [] })}
          />
        ) : (
          <>

        <div className="main" id="results">
          <aside className="filters" aria-label="Filters">
            <fieldset>
              <h3>Bus type</h3>
              {['AC', 'Non-AC', 'Sleeper', 'Seater'].map((t) => (
                <label key={t}><input type="checkbox" checked={types.includes(t)} onChange={() => setTypes(toggle(types, t))} /> {t}</label>
              ))}
            </fieldset>
            <fieldset>
              <h3>Departure time</h3>
              {['Before 6 am', '6 am to 12 pm', '12 pm to 6 pm', 'After 6 pm'].map((t, i) => (
                <label key={t}><input type="checkbox" checked={slots.includes(i)} onChange={() => setSlots(toggle(slots, i))} /> {t}</label>
              ))}
            </fieldset>
          </aside>

          <section>
            <div className="head">
              <h2>{buses ? `${search.from} to ${search.to}: ${list.length} buses` : 'Buses'}</h2>
              <label className="sort">Sort
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="d">Earliest departure</option>
                  <option value="p">Lowest price</option>
                  <option value="r">Top rated</option>
                  <option value="u">Shortest</option>
                </select>
              </label>
            </div>

            {!buses && <div className="empty">{problem(search)}</div>}
            {buses && !list.length && <div className="empty">No buses match these filters. Clear a filter to see more.</div>}

            {list.map((b) => {
              const isOpen = openId === b.id
              return (
                <article className={`bus ${isOpen ? 'active' : ''}`} key={b.id}>
                  <div className="r1">
                    <div><div className="op">{b.op}</div><div className="mute">{b.type}</div></div>
                    <div>
                      <span className="time">{fmt(b.dep)}</span> <span className="mute">to</span> <span className="time">{fmt(b.dep + b.dur)}</span>
                      <div className="mute">{Math.floor(b.dur)}h {Math.round((b.dur % 1) * 60)}m · {Math.round(b.km)} km</div>
                    </div>
                    <div><span className="rate">★ {b.rating}</span><div className="mute">{36 - b.sold.size - Object.keys(sold[b.id] || {}).length} seats left</div></div>
                    <div className="price">
                      <span className="mute">Starts at</span><b>₹{b.price}</b>
                      <button type="button" className="view" onClick={() => { setOpenId(b.id); window.scrollTo(0, 0) }}>
                        View seats
                      </button>
                    </div>
                  </div>

                </article>
              )
            })}
          </section>

        </div>
          </>
        )}
      </div>
      </>
      )}

      {view !== 'signup' && <Footer onRoute={onRoute} onContact={() => go('contact')} showContact={view !== 'home'} />}

      {showAcct && <AccountModal users={users} onSignIn={(a) => { setAccount(a); setShowAcct(false) }} onSignUp={() => { setShowAcct(false); go('signup') }} onClose={() => setShowAcct(false)} />}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      {showMy && <MyBookings mine={mine} onClose={() => setShowMy(false)} />}
      {booking && (
        <BookingModal
          bus={booking.bus}
          seats={booking.seats}
          route={search}
          account={account}
          fam={fam}
          family={booking.seats.some((id) => seatG[booking.bus.id + ':' + id] === 'P')}
          onClose={() => setBooking(null)}
          onPaid={(t) => {
            markBooked(booking.bus, booking.seats)
            setMine([{ ...t, route: search, op: booking.bus.op, seats: booking.seats }, ...mine])
          }}
        />
      )}
    </>
  )
}
