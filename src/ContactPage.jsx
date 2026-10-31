import { useState } from 'react'
import { emailOk, phoneOk } from './validate'
import { Ic } from './Icons'

const FAQS = [
  ['How do I cancel my ticket?', 'Open My Bookings, pick the ticket and choose Cancel. Cancellations made earlier get a bigger refund.'],
  ['When will I get my refund?', 'Refunds reach your original payment method in 5 to 7 working days.'],
  ['Can I change my travel date?', 'Yes. Contact us with your Booking ID and we will move you to another bus, subject to seat availability.'],
  ['How do I get my ticket?', 'Your PNR and ticket appear right after payment and under My Bookings.'],
  ['What if my bus is delayed?', 'We will message you with the new timing. If the delay is long you can ask for a refund.'],
]

function Field({ id, label, icon, required = true, full, children }) {
  return (
    <div className={full ? 'full' : ''}>
      <label className="lb" htmlFor={id}>{label} {required ? <span style={{ color: '#e11d48' }}>*</span> : <small>(Optional)</small>}</label>
      <div className="iw"><Ic n={icon} />{children}</div>
    </div>
  )
}

export default function ContactPage({ account }) {
  const [f, setF] = useState({ name: account?.name ?? '', email: account?.email ?? '', phone: account?.phone ?? '', subject: '', bid: '', msg: '' })
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(null)
  const [faq, setFaq] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const send = () => {
    const bid = f.bid.trim().toUpperCase()
    if (!f.name.trim()) return setErr('Enter your full name.')
    if (!emailOk(f.email.trim())) return setErr('Enter a valid email address.')
    if (f.phone.trim() && !phoneOk(f.phone.trim())) return setErr('Mobile number must be 10 digits, or leave it blank.')
    if (!f.subject) return setErr('Choose a subject so we know what this is about.')
    if (bid && !/^BB[A-Z0-9]{6}$/.test(bid)) return setErr('Booking IDs look like BB followed by 6 letters or numbers, or leave it blank.')
    if (f.msg.trim().length < 10) return setErr('Write a message of at least 10 characters.')
    setErr('')
    setSent({ name: f.name.trim(), email: f.email.trim(), bid, ref: 'CT' + Math.random().toString(36).slice(2, 7).toUpperCase() })
    setF({ ...f, subject: '', bid: '', msg: '' })
  }

  return (
    <main className="page cpg">
      <section className="chero">
        <div className="wrap">
          <h1>
            Contact <span className="us">Us
              <svg viewBox="0 0 120 16" preserveAspectRatio="none" aria-hidden="true"><path d="M2 12C30 2 80 2 118 8" fill="none" stroke="#f5a524" strokeWidth="5" strokeLinecap="round" /></svg>
            </span>
            <svg className="plane" viewBox="0 0 110 70" aria-hidden="true">
              <path d="M95 6L60 22l12 6 4 14 8-12z" fill="#fff" />
              <path d="M6 60C20 40 10 28 28 30s8 22 28 8" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round" />
            </svg>
          </h1>
          <h2>We’re Here to Help!</h2>
          <p>Have a question about your journey? Need help with a booking? Our support team is just a message away.</p>
        </div>
        <svg className="cwave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40C240 90 480 0 760 30S1220 90 1440 30V90H0Z" fill="#14b8a6" opacity=".55" />
          <path d="M0 62C300 22 560 90 860 55S1250 22 1440 62V90H0Z" fill="#eef6fc" />
        </svg>
      </section>

      <section className="cbody">
        <div className="wrap cgrid2">
          <div className="gcard">
            {sent ? (
              <>
                <div className="ghead"><span className="gic blue"><Ic n="mail" /></span><div><h3>Message sent</h3><p>Thanks, {sent.name}. We will reply to {sent.email} within 24 hours.{sent.bid ? ` Booking ID: ${sent.bid}.` : ''}</p></div></div>
                <div className="pnr">{sent.ref}</div>
                <p className="mute">Quote this reference if you write to us again.</p>
                <button type="button" className="sendbtn" onClick={() => setSent(null)}>Send another message</button>
              </>
            ) : (
              <>
                <div className="ghead"><span className="gic blue"><Ic n="mail" /></span><div><h3>Send Us a Message</h3><p>Fill out the form below, and we’ll get back to you soon.</p></div></div>
                <div className="cf">
                  <Field id="cf-name" label="Full Name" icon="user"><input id="cf-name" autoComplete="name" placeholder="Enter your name" value={f.name} onChange={set('name')} /></Field>
                  <Field id="cf-email" label="Email Address" icon="mail"><input id="cf-email" type="email" autoComplete="email" placeholder="Enter your email" value={f.email} onChange={set('email')} /></Field>
                  <Field id="cf-phone" label="Mobile Number" icon="phone" required={false}><input id="cf-phone" type="tel" inputMode="numeric" maxLength={10} placeholder="Enter your mobile number" value={f.phone} onChange={set('phone')} /></Field>
                  <Field id="cf-sub" label="Subject" icon="grid">
                    <select id="cf-sub" value={f.subject} onChange={set('subject')}>
                      <option value="">Select a subject</option><option>Booking help</option><option>Cancellation or refund</option><option>Payment issue</option><option>Feedback</option><option>Other</option>
                    </select>
                    <Ic n="down" className="chev" />
                  </Field>
                  <Field id="cf-bid" label="Booking ID" icon="ticket" required={false} full><input id="cf-bid" placeholder="Enter booking ID if applicable" value={f.bid} onChange={set('bid')} /></Field>
                  <Field id="cf-msg" label="Message" icon="chat" full><textarea id="cf-msg" placeholder="Type your message here..." value={f.msg} onChange={set('msg')} /></Field>
                </div>
                <p className="formerr" role="alert">{err}</p>
                <button type="button" className="sendbtn" onClick={send}><Ic n="plane" />Send Message<Ic n="right" /></button>
              </>
            )}
          </div>

          <div className="gcard">
            <div className="ghead"><span className="gic teal"><Ic n="headset" /></span><div><h3>Other Ways to Reach Us</h3><p>Choose the best way to get in touch.</p></div></div>
            <div className="rc"><span className="ci b"><Ic n="mail" /></span><div><b>Email Support</b><span className="v">support@busbee.com</span><small>For general inquiries and support.</small></div></div>
            <div className="rc"><span className="ci t"><Ic n="phone" /></span><div><b>Customer Assistance</b><span className="v">+91 98765 43210</span><small>Mon – Sun, 8 AM – 10 PM</small></div></div>
            <div className="rc"><span className="ci o"><Ic n="pin" /></span><div><b>Our Office</b><small style={{ color: '#0b1f4d', fontSize: 14.5 }}>123 Travel Plaza, Tech Park Road, Bengaluru – 560001, India</small></div></div>
            <div className="follow">
              <b>Follow Us</b>
              <div className="soc">
                <span style={{ background: '#1877f2' }}>f</span>
                <span style={{ background: '#000' }}>X</span>
                <span style={{ background: '#ff0000' }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7l8 5-8 5z" fill="currentColor" /></svg></span>
                <span style={{ background: 'linear-gradient(45deg,#f9a03f,#e1306c,#833ab4)' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.5" /></svg></span>
                <span style={{ background: '#0a66c2', fontSize: 15 }}>in</span>
              </div>
            </div>
            <svg className="rdeco" viewBox="0 0 400 260" aria-hidden="true">
              <g fill="#cfe2f7"><rect x="250" y="70" width="26" height="120" /><rect x="280" y="40" width="30" height="150" /><rect x="314" y="90" width="28" height="100" /><rect x="346" y="60" width="34" height="130" /></g>
              <path d="M0 250C120 220 200 230 400 150V260H0Z" fill="#cfe6f8" />
              <g transform="translate(60 120)"><rect width="190" height="80" rx="16" fill="#bcd9f3" /><g fill="#e6f1fb"><rect x="14" y="14" width="30" height="26" rx="4" /><rect x="52" y="14" width="30" height="26" rx="4" /><rect x="90" y="14" width="30" height="26" rx="4" /><rect x="128" y="14" width="48" height="36" rx="4" /></g><circle cx="46" cy="82" r="14" fill="#8db7e0" /><circle cx="146" cy="82" r="14" fill="#8db7e0" /></g>
            </svg>
          </div>
        </div>

        <div className="wrap">
          <div className="faqbar">
            <span className="gic">?</span>
            <div><b>Frequently Asked Questions</b><p>Find quick answers to common queries.</p></div>
            <button type="button" className="faqbtn" onClick={() => setFaq(!faq)}>{faq ? 'Hide FAQs ˄' : 'View FAQs ›'}</button>
          </div>
          {faq && (
            <div className="faqlist">
              {FAQS.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
            </div>
          )}
        </div>
        <svg className="cfoot" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 50C260 110 520 0 820 50S1260 100 1440 40V120H0Z" fill="#8fdad8" opacity=".6" />
          <path d="M0 80C300 30 600 120 900 80S1280 40 1440 80V120H0Z" fill="#1d6fd8" opacity=".85" />
        </svg>
      </section>
    </main>
  )
}
