import logo from './assets/logo.png'
import { Ic } from './Icons'

export function Nav({ onNav, account, view = 'home' }) {
  return (
    <header className="nav">
      <div className="wrap navin">
        <button type="button" className="logo" aria-label="BusBee, refresh page" onClick={() => onNav('reload')}>
          <img src={logo} alt="" />BusBee
        </button>
        <nav aria-label="Main">
          <button type="button" className={view === 'home' ? 'on' : ''} onClick={() => onNav('home')}><Ic n="home" />Home</button>
          <button type="button" onClick={() => onNav('routes')}><Ic n="pin" />Routes</button>
          <button type="button" onClick={() => onNav('my')}><Ic n="ticket" />My Bookings</button>
          <button type="button" className={view === 'contact' ? 'on' : ''} onClick={() => onNav('contact')}><Ic n="headset" />Contact Us</button>
          <button type="button" className="tg" aria-label="Switch light and dark mode" onClick={() => onNav('theme')}><Ic n="moon" /></button>
          {account && <span className="hi">Hi, {account.name.split(' ')[0]}</span>}
          <button type="button" className="acct" onClick={() => onNav('acct')}>{account ? 'Logout' : 'Login'}</button>
          {!account && <button type="button" className="cta" onClick={() => onNav('signup')}>Sign Up</button>}
        </nav>
      </div>
    </header>
  )
}

export function MyBookings({ mine, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3>My bookings</h3>
        {mine.length ? mine.map((m) => (
          <div className="tk" key={m.pnr}>
            <b>{m.pnr}</b> · {m.route.from} to {m.route.to}
            <div className="mute">{m.route.date} · {m.op} · seats {m.seats.join(', ')} · ₹{m.total}{m.trav ? ' · ' + m.trav : ''}</div>
          </div>
        )) : <p className="mute">No tickets yet. Book a bus and your ticket will show here.</p>}
        <div className="act"><button type="button" className="p" onClick={onClose}>Close</button></div>
      </div>
    </div>
  )
}
