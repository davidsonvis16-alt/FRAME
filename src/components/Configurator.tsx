import { useState } from 'react'
import { FRAMES, MAT_PRICE, SIZES, ksh, unitPrice, type ArtSource } from '../lib/data'
import { useStore } from '../lib/store'
import { Framed } from './Framed'

const WALLS = [
  { id: 'cream', name: 'Cream', color: '#efe6d8' },
  { id: 'clay', name: 'Clay', color: '#c98a62' },
  { id: 'sage', name: 'Sage', color: '#a9ad8c' },
  { id: 'night', name: 'Night', color: '#2a2422' },
]

/** Width of the hung piece relative to the room preview, per print size. */
const SCALE: Record<string, number> = { a4: 0.2, a3: 0.27, a2: 0.36, a1: 0.46 }

interface Props {
  artworkId: string
  title: string
  art: ArtSource
  ratio: number
}

export function Configurator({ artworkId, title, art, ratio }: Props) {
  const { addToCart, setCartOpen, notify } = useStore()
  const [sizeId, setSize] = useState('a3')
  const [frameId, setFrame] = useState('copper')
  const [mat, setMat] = useState(true)
  const [qty, setQty] = useState(1)
  const [wall, setWall] = useState(WALLS[0])
  const [view, setView] = useState<'room' | 'close'>('room')

  const price = unitPrice(sizeId, frameId, mat)
  const frame = FRAMES.find(f => f.id === frameId)!

  const add = () => {
    addToCart({ artworkId, title, art, ratio, sizeId, frameId, mat }, qty)
    notify(`${title} added to cart`)
    setCartOpen(true)
  }

  return (
    <div className="config">
      <div className="config__stage">
        <div className="seg" role="tablist" aria-label="Preview">
          <button role="tab" aria-selected={view === 'room'} onClick={() => setView('room')}>In a room</button>
          <button role="tab" aria-selected={view === 'close'} onClick={() => setView('close')}>Close-up</button>
        </div>
        {view === 'room' ? (
          <div className="room" style={{ background: wall.color }}>
            <div className="room__piece" style={{ width: `${(SCALE[sizeId] / Math.max(ratio, 0.6)) * 60}%` }}>
              <Framed art={art} ratio={ratio} frameId={frameId} mat={mat} thickness={10} alt={title} />
            </div>
            <div className="room__sofa" aria-hidden>
              <i />
              <i />
            </div>
            <div className="room__plant" aria-hidden />
            <div className="room__floor" aria-hidden />
            <div className="room__walls">
              {WALLS.map(w => (
                <button key={w.id} title={`${w.name} wall`} aria-label={`${w.name} wall`} style={{ background: w.color }} className={w.id === wall.id ? 'is-on' : ''} onClick={() => setWall(w)} />
              ))}
            </div>
          </div>
        ) : (
          <div className="close">
            <Framed art={art} ratio={ratio} frameId={frameId} mat={mat} thickness={26} alt={title} />
          </div>
        )}
      </div>

      <div className="config__panel">
        <fieldset>
          <legend>Size</legend>
          <div className="sizes">
            {SIZES.map(s => (
              <button key={s.id} className={s.id === sizeId ? 'is-on' : ''} onClick={() => setSize(s.id)} aria-pressed={s.id === sizeId}>
                <b>{s.label}</b>
                <small>{s.cm}</small>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>
            Frame <span className="muted">· {frame.name}</span>
          </legend>
          <div className="swatches">
            {FRAMES.map(f => (
              <button
                key={f.id}
                className={f.id === frameId ? 'is-on' : ''}
                onClick={() => setFrame(f.id)}
                aria-label={f.name}
                aria-pressed={f.id === frameId}
                title={`${f.name}${f.extra ? ` (+${ksh(f.extra)})` : ''}`}
                style={{ borderColor: f.faces.join(' ') }}
              />
            ))}
          </div>
        </fieldset>

        <label className="toggle">
          <input type="checkbox" checked={mat} onChange={e => setMat(e.target.checked)} />
          <span />
          Add a mount board <small className="muted">(+{ksh(MAT_PRICE)})</small>
        </label>

        <div className="buy">
          <div className="qty qty--lg">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease">−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} aria-label="Increase">+</button>
          </div>
          <div className="buy__price">
            <small>Price</small>
            <b>{ksh(price * qty)}</b>
          </div>
        </div>
        <button className="btn btn--red btn--block btn--lg" onClick={add}>
          Add to cart
        </button>
        <ul className="ticks">
          <li>Hand-mitred in our Nairobi workshop</li>
          <li>Ready in 2 to 3 days · delivered countrywide</li>
          <li>Pay with M-Pesa, card, or cash on delivery</li>
        </ul>
      </div>
    </div>
  )
}
