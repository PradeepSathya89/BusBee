import logo from './assets/logo.png'

const ROUTES = [['Hyderabad', 'Bengaluru'], ['Hyderabad', 'Chennai'], ['Bengaluru', 'Goa'], ['Mumbai', 'Pune']]

export default function Footer({ onRoute, onContact, showContact = true }) {
  return (
    <footer className="foot" id="help">
      <div className="wrap fgrid">
        <div><div className="logo"><img src={logo} alt="" />BusBee</div><p>Simple, safe intercity bus tickets for every journey.</p></div>
        <div id="routes">
          <h4>Popular routes</h4>
          {ROUTES.map(([a, b]) => <button type="button" key={a + b} onClick={() => onRoute(a, b)}>{a} to {b}</button>)}
        </div>
        <div><h4>Help</h4><p>help@busbee.example</p>{showContact && <button type="button" onClick={onContact}>Contact us</button>}<p>Every day, 6 am to 11 pm</p><p>Refunds in 5 to 7 working days</p></div>
        <div><h4>Company</h4><p>About us</p><p>Terms of use</p><p>Privacy policy</p></div>
      </div>
      <div className="wrap copy">© 2026 BusBee. Demo site: bookings are simulated and nothing is charged.</div>
    </footer>
  )
}
