export const CITIES = {
  Hyderabad: [17.38, 78.48], Bengaluru: [12.97, 77.59], Chennai: [13.08, 80.27],
  Mumbai: [19.08, 72.88], Pune: [18.52, 73.86], Vijayawada: [16.51, 80.65],
  Goa: [15.5, 73.83], Visakhapatnam: [17.69, 83.22], Tirupati: [13.63, 79.42],
}

export const STATES = {
  Hyderabad: 'Telangana', Bengaluru: 'Karnataka', Chennai: 'Tamil Nadu', Mumbai: 'Maharashtra', Pune: 'Maharashtra',
  Vijayawada: 'Andhra Pradesh', Goa: 'Goa', Visakhapatnam: 'Andhra Pradesh', Tirupati: 'Andhra Pradesh',
}

// [operator, type, price per km]
const OPS = [
  ['Orange Travels', 'AC Sleeper', 1.7], ['VRL Travels', 'AC Sleeper', 1.9],
  ['SRS Express', 'Non-AC Seater', 1.0], ['Kaveri Lines', 'AC Seater', 1.3],
  ['Neeta Tours', 'Non-AC Sleeper', 1.35], ['Sharma Travels', 'AC Seater', 1.25],
]
const TIMES = [5.5, 8, 13.5, 17.5, 19.25, 20.5, 21.5, 22.75]

const rng = (s) => () => (s = (s * 9301 + 49297) % 233280) / 233280
// Seat next to this one in the same row (null = none, e.g. across the aisle)
export const buddy = (sleeper, i) =>
  sleeper ? (i % 3 === 0 ? i + 1 : i % 3 === 1 ? i - 1 : null) : i % 2 === 0 ? i + 1 : i - 1

const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)

export const fmt = (h) => {
  h = ((h % 24) + 24) % 24
  const m = Math.round((h % 1) * 60) % 60
  return String(Math.floor(h)).padStart(2, '0') + ':' + String(m).padStart(2, '0')
}

const distance = (a, b) => {
  const R = Math.PI / 180
  const [x, y] = CITIES[a], [u, v] = CITIES[b]
  const k = Math.sin(((u - x) * R) / 2) ** 2 +
    Math.cos(x * R) * Math.cos(u * R) * Math.sin(((v - y) * R) / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(k)) * 1.28
}

export function buildBuses(from, to, date) {
  if (!CITIES[from] || !CITIES[to] || from === to) return null
  const km = distance(from, to), dur = km / 58, key = from + to + date, r = rng(hash(key))
  return TIMES.map((dep, i) => {
    const [op, type, rate] = OPS[(i + hash(key)) % 6]
    const id = key + i, g = rng(hash(id)), sold = new Map()
    for (let n = 0; n < 14; n++) sold.set(Math.floor(g() * 36), g() < 0.4 ? 'F' : 'M')
    // neighbours must share a gender
    const isSl = type.includes('Sleeper')
    ;[...sold.keys()].sort((a, b) => a - b).forEach((k) => {
      const d = isSl && k >= 18 ? 18 : 0, j = buddy(isSl, k - d)
      if (j !== null && d + j < k && sold.has(d + j)) sold.set(k, sold.get(d + j))
    })
    return {
      id, op, type, dep, dur, km, sold,
      sleeper: type.includes('Sleeper'),
      rating: (3.6 + r() * 1.3).toFixed(1),
      price: Math.round((km * rate * (0.9 + r() * 0.25)) / 10) * 10,
    }
  })
}

// Seat ids: sleeper "L1".."L18" / "U1".."U18", seater "1".."36"
export const seatId = (bus, deck, i) => (bus.sleeper ? deck + (i + 1) : String(i + 1))
export const seatIndex = (bus, id) =>
  bus.sleeper ? (id[0] === 'U' ? 18 : 0) + Number(id.slice(1)) - 1 : Number(id) - 1
