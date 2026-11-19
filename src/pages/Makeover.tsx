import { useState, type FormEvent } from 'react'
import { useStore } from '../lib/store'
import { ksh } from '../lib/data'

const PACKAGES = [
  { id: 'wall', name: 'Feature Wall', price: 15000, pieces: '3 to 5 frames', perks: ['Style consult on WhatsApp', 'Prints and frames included', 'Hung and levelled on site'] },
  { id: 'room', name: 'Full Room', price: 35000, pieces: '8 to 12 frames', perks: ['In-home measurement visit', 'Mood board of 2 options', 'Gallery-wall layout plan', 'Installation team'], hot: true },
  { id: 'office', name: 'Office & Salon', price: 60000, pieces: '15+ frames', perks: ['Brand-matched artwork', 'Reception and boardroom walls', 'After-hours install', 'Logo and signage printing'] },
]

export function Makeover() {
  const { user, notify } = useStore()
  const [pkg, setPkg] = useState('room')
  const [form, setForm] = useState({ name: user?.name ?? '', phone: '', area: '', date: '', notes: '' })
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const today = new Date().toISOString().slice(0, 10)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (form.name.trim().length < 2 || form.phone.replace(/\D/g, '').length < 9 || !form.area || !form.date) {
      return setErr('Name, phone, area and a preferred date are required.')
    }
    setErr(null)
    try {
      const all = JSON.parse(localStorage.getItem('fz.bookings') || '[]')
      localStorage.setItem('fz.bookings', JSON.stringify([...all, { ...form, pkg, at: Date.now() }]))
    } catch {
      /* ignore */
    }
    setSent(true)
    notify('Booking received. We will WhatsApp you shortly!')
  }

  return (
    <>
      <section className="mk-hero">
        <img src="/art/installer.jpg" alt="Frame Zetu installer measuring a wall" />
        <div className="mk-hero__copy">
          <p className="eyebrow eyebrow--light">House makeover</p>
          <h1>Book us now for your house makeover.</h1>
          <p>Tell us the room and the vibe, and we'll handle the rest: art selection, printing, framing and a perfectly level gallery wall.</p>
          <a href="#book" className="btn btn--red btn--lg" onClick={e => { e.preventDefault(); document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' }) }}>
            Pick a package ↓
          </a>
        </div>
      </section>

      <section className="sec">
        <div className="packages">
          {PACKAGES.map(p => (
            <button key={p.id} className={`pkg ${pkg === p.id ? 'is-on' : ''} ${p.hot ? 'pkg--hot' : ''}`} onClick={() => setPkg(p.id)} aria-pressed={pkg === p.id}>
              {p.hot && <span className="pkg__flag">Most booked</span>}
              <h3>{p.name}</h3>
              <small>{p.pieces}</small>
              <b>from {ksh(p.price)}</b>
              <ul>
                {p.perks.map(x => <li key={x}>{x}</li>)}
              </ul>
            </button>
          ))}
        </div>
      </section>

      <section className="sec book" id="book">
        <div className="book__photo">
          <img src="/art/makeover-wall.jpg" alt="Framed prints ready to hang" />
          <img src="/art/shop-floor.jpg" alt="Two framed portraits in the Frame Zetu shop" />
        </div>
        {sent ? (
          <div className="box book__done">
            <div className="stamp">✓</div>
            <h2>We've got your booking!</h2>
            <p className="lede">
              {form.name.split(' ')[0]}, our stylist will WhatsApp you on {form.phone} to confirm {new Date(form.date).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' })}.
            </p>
            <a href="#/shop" className="btn btn--ghost">Browse art while you wait</a>
          </div>
        ) : (
          <form className="box book__form" onSubmit={submit}>
            <h2>Book a visit</h2>
            <p className="muted">Package: <b>{PACKAGES.find(p => p.id === pkg)!.name}</b></p>
            <div className="two">
              <label>Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
              <label>Phone / WhatsApp<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} inputMode="tel" placeholder="0712 345 678" /></label>
            </div>
            <div className="two">
              <label>Area<input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="e.g. Westlands" /></label>
              <label>Preferred date<input type="date" min={today} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
            </div>
            <label>Tell us about the space<textarea rows={4} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Wall size, colours, the mood you want, or a surprise you're planning…" /></label>
            {err && <p className="err">{err}</p>}
            <button className="btn btn--red btn--block btn--lg">Request booking</button>
          </form>
        )}
      </section>
    </>
  )
}
