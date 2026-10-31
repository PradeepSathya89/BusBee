import { useState } from 'react'
import { emailOk, phoneOk } from './validate'
import { Ic } from './Icons'
import logo from './assets/logo.png'

export default function SignUpPage({ users, onCreate, onLogin, onHome, onTerms }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', pw: '', pw2: '' })
  const [show, setShow] = useState({ pw: false, pw2: false })
  const [agree, setAgree] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState(null)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = () => {
    const email = f.email.trim().toLowerCase(), phone = f.phone.trim()
    if (!f.name.trim()) return setErr('Enter your full name.')
    if (!emailOk(email)) return setErr('Enter a valid email address.')
    if (phone && !phoneOk(phone)) return setErr('Mobile number must be 10 digits, or leave it blank.')
    if (f.pw.length < 8) return setErr('Password must be at least 8 characters.')
    if (f.pw !== f.pw2) return setErr('Passwords do not match.')
    if (!agree) return setErr('Please accept the Terms & Privacy Policy.')
    if (users.some((u) => u.email === email)) return setErr('An account with this email already exists. Login instead.')
    setErr('')
    onCreate({ name: f.name.trim(), email, phone, pw: f.pw })
    setDone(f.name.trim().split(' ')[0])
  }

  const Pw = ({ k, ph }) => (
    <div className="iw">
      <Ic n="lock" />
      <input type={show[k] ? 'text' : 'password'} aria-label={ph} placeholder={ph} autoComplete="new-password" value={f[k]} onChange={set(k)} />
      <button type="button" className="eye" aria-label="Show or hide password" onClick={() => setShow({ ...show, [k]: !show[k] })}><Ic n="eye" /></button>
    </div>
  )

  return (
    <main className="supg">
      <div className="sp-left">
        <button type="button" className="sp-logo" aria-label="BusBee home" onClick={onHome}>
          <img src={logo} alt="" />
          <span className="nm">Bus<b>Bee</b>
            <svg viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden="true"><path d="M2 10C30 2 80 2 118 6" fill="none" stroke="#f5a524" strokeWidth="4" strokeLinecap="round" /></svg>
          </span>
        </button>
        <h1>Travel More,<br /><span>Worry Less!</span></h1>
        <p>Join BusBee and make your journey easier.</p>
        <ul className="sp-feats">
          <li><span className="o"><Ic n="bus" /></span>Book Tickets<br />in Seconds</li>
          <li><span className="o"><Ic n="shield" /></span>Safe &amp; Secure<br />Bookings</li>
          <li><span className="o"><Ic n="headset" /></span>24/7 Customer<br />Support</li>
        </ul>
        <div className="sp-bus" />
      </div>

      <div className="sp-right">
        <div className="sp-card">
          <svg className="sp-plane" viewBox="0 0 110 70" aria-hidden="true">
            <path d="M95 6L60 22l12 6 4 14 8-12z" fill="#14b8a6" />
            <path d="M6 60C20 40 10 28 28 30s8 22 28 8" fill="none" stroke="#14b8a6" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round" />
          </svg>
          {done ? (
            <>
              <h2>Welcome to BusBee, {done}!</h2>
              <p className="sub">Your account is ready and you are signed in.</p>
              <button type="button" className="subtn" onClick={onHome}>Book a bus</button>
            </>
          ) : (
            <>
              <h2>Create Your Account</h2>
              <p className="sub">Join BusBee and start your journey today!</p>
              <div className="iw"><Ic n="user" /><input aria-label="Full name" placeholder="Full Name" autoComplete="name" value={f.name} onChange={set('name')} /></div>
              <div className="iw"><Ic n="mail" /><input type="email" aria-label="Email address" placeholder="Email Address" autoComplete="email" value={f.email} onChange={set('email')} /></div>
              <div className="iw"><Ic n="phone" /><input type="tel" aria-label="Mobile number, optional" placeholder="Mobile Number (Optional)" inputMode="numeric" maxLength={10} value={f.phone} onChange={set('phone')} /></div>
              <Pw k="pw" ph="Password" />
              <Pw k="pw2" ph="Confirm Password" />
              <label className="terms">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                <span>I agree to the <button type="button" className="lnk" onClick={onTerms}>Terms &amp; Privacy Policy</button></span>
              </label>
              <p className="formerr" role="alert">{err}</p>
              <button type="button" className="subtn" onClick={submit}><Ic n="userplus" />Create Account<Ic n="right" /></button>
              <div className="divl">Already have an account? <button type="button" className="lnk" onClick={onLogin}>Login</button></div>
              <div className="pill">Travel Better with BusBee <span style={{ color: '#14b8a6' }}>♥</span></div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
