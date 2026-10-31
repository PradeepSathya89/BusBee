import { useState } from 'react'
import { CITIES, STATES } from './data'

const Pin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
)

// Text field that shows matching cities (with address hints) while you type.
export default function CityInput({ id, label, placeholder, value, onChange, onPick, onEnter }) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(-1)
  const [all, setAll] = useState(false)   // on focus show every city; filter once the user types
  const q = all ? '' : value.trim().toLowerCase()
  const items = Object.keys(CITIES)
    .filter((c) => !q || c.toLowerCase().includes(q) || STATES[c].toLowerCase().includes(q))
    .sort((a, b) => (a.toLowerCase().startsWith(q) ? 0 : 1) - (b.toLowerCase().startsWith(q) ? 0 : 1))

  const choose = (c) => { onChange(c); setOpen(false); setIdx(-1); onPick?.() }
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { setOpen(true); setIdx(Math.min(idx + 1, items.length - 1)); e.preventDefault() }
    else if (e.key === 'ArrowUp') { setIdx(Math.max(idx - 1, 0)); e.preventDefault() }
    else if (e.key === 'Enter') { if (open && items[idx]) choose(items[idx]); else { setOpen(false); onEnter?.() } e.preventDefault() }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className="fld">
      <label htmlFor={id}>{label}</label>
      <div className="inw">
        <Pin />
        <input
          id={id} autoComplete="off" placeholder={placeholder} value={value}
          role="combobox" aria-expanded={open} aria-controls={id + '-list'}
          onChange={(e) => { onChange(e.target.value); setAll(false); setIdx(-1); setOpen(true) }}
          onFocus={(e) => { e.target.select(); setAll(true); setIdx(-1); setOpen(true) }}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
        />
      </div>
      {open && (
        <ul className="sug" id={id + '-list'} role="listbox">
          {items.length ? items.map((c, i) => (
            <li key={c} role="option" aria-selected={i === idx} className={i === idx ? 'on' : ''}
                onMouseDown={(e) => { e.preventDefault(); choose(c) }}>
              <Pin />
              <b>{c}</b>
            </li>
          )) : <li className="none">No matching city. Try {Object.keys(CITIES).slice(0, 3).join(', ')}.</li>}
        </ul>
      )}
    </div>
  )
}
