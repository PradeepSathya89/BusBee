import { buddy, seatId } from './data'

// Draws ONE deck. For sleeper buses, render it twice: deck="L" and deck="U".
export default function SeatMap({ bus, deck, selected, soldExtra, genderOf, gender, onToggle }) {
  const idx = (i) => (bus.sleeper && deck === 'U' ? 18 : 0) + i
  const soldG = (i) => bus.sold.get(idx(i)) ?? soldExtra[idx(i)]
  const stateOf = (i) => {
    const id = seatId(bus, deck, i)
    return soldG(i) || (selected.includes(id) ? genderOf(id) : null)
  }

  const Seat = ({ i }) => {
    const id = seatId(bus, deck, i)
    const sg = soldG(i), sold = Boolean(sg), on = selected.includes(id)
    const bj = buddy(bus.sleeper, i), bg = bj === null ? null : stateOf(bj)
    const blocked = !sold && !on && bg && bg !== gender && bg !== 'P' && gender !== 'P'      // neighbour has the other gender
    const g = sold ? sg : genderOf(id), c = g === 'F' ? 'f' : g === 'P' ? 'p' : 'm'
    const tip = sold
      ? (sg === 'F' ? 'Booked by female' : sg === 'P' ? 'Booked by a family' : 'Booked by male')
      : blocked ? (bg === 'F' ? 'Next to a woman: women only' : 'Next to a man: men only') : 'Available'
    return (
      <button
        type="button"
        className={`s ${bus.sleeper ? 'sl' : ''} ${sold ? 'x ' + c : ''} ${on ? 'on ' + c : ''} ${blocked ? 'blk' : ''}`}
        disabled={sold || blocked}
        title={tip}
        aria-pressed={on}
        aria-label={`Seat ${id}. ${tip}`}
        onClick={() => onToggle(id)}
      >
        {id}
      </button>
    )
  }

  return bus.sleeper ? (
    <div className="bay" style={{ gridTemplateColumns: 'repeat(4, auto)' }}>
      {Array.from({ length: 6 }, (_, r) =>
        [0, 1, 'gap', 2].map((c) => (c === 'gap' ? <span key={r + c} style={{ width: 14 }} /> : <Seat key={r * 3 + c} i={r * 3 + c} />))
      )}
    </div>
  ) : (
    <div className="bay" style={{ gridTemplateColumns: 'repeat(5, auto)' }}>
      {Array.from({ length: 9 }, (_, r) =>
        [0, 1, 'gap', 2, 3].map((c) => (c === 'gap' ? <span key={r + c} /> : <Seat key={r * 4 + c} i={r * 4 + c} />))
      )}
    </div>
  )
}
