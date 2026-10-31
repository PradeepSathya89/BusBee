import { useState } from 'react'

// Sign in dialog. Accounts are created on the Sign up page and live in memory (demo only).
export function AccountModal({ users, onSignIn, onSignUp, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  const go = () => {
    const u = users.find((x) => x.email === email.trim().toLowerCase() && x.pw === password)
    if (!u) return setErr(users.length ? 'That email and password don’t match an account.' : 'No account yet. Create one with Sign up.')
    onSignIn({ name: u.name, email: u.email, phone: u.phone })
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3>Login</h3>
        <label>Email<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
        <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" /></label>
        {err && <p className="err" role="alert">{err}</p>}
        <div className="act"><button type="button" onClick={onClose}>Cancel</button><button type="button" className="p" onClick={go}>Login</button></div>
        <p className="mute" style={{ textAlign: 'center', margin: '12px 0 0' }}>
          New to BusBee? <button type="button" className="lnk" onClick={onSignUp}>Create an account</button>
        </p>
      </div>
    </div>
  )
}

export function TermsModal({ onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3>Terms &amp; Privacy Policy</h3>
        <p className="mute">This is a demo site. Your details are only used to create your account and to show your bookings in this browser tab. Nothing is saved on a server or shared with anyone.</p>
        <div className="act"><button type="button" className="p" onClick={onClose}>Close</button></div>
      </div>
    </div>
  )
}
