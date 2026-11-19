import { useEffect, useState, type FormEvent } from 'react'
import { useStore, type Order } from '../lib/store'
import { DELIVERY, FRAMES, SIZES, ksh } from '../lib/data'
import { Framed } from '../components/Framed'

type Method = 'mpesa' | 'card' | 'cod'
type Zone = 'nairobi' | 'countrywide' | 'pickup'

const ZONES: { id: Zone; label: string; note: string; fee: number }[] = [
  { id: 'nairobi', label: 'Nairobi delivery', note: 'Same or next day', fee: DELIVERY.nairobi },
  { id: 'countrywide', label: 'Countrywide', note: '2 to 4 days via courier', fee: DELIVERY.countrywide },
  { id: 'pickup', label: 'Pick up at the shop', note: 'Free', fee: 0 },
]

const digits = (s: string) => s.replace(/\D/g, '')

function luhn(num: string) {
  let sum = 0
  num.split('').reverse().forEach((d, i) => {
    let n = +d
    if (i % 2) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
  })
  return num.length >= 13 && sum % 10 === 0
}

function normalisePhone(p: string) {
  const d = digits(p)
  if (/^0[17]\d{8}$/.test(d)) return '254' + d.slice(1)
  if (/^254[17]\d{8}$/.test(d)) return d
  if (/^[17]\d{8}$/.test(d)) return '254' + d
  return null
}

export function Checkout() {
  const { cart, subtotal, user, setAuthOpen, placeOrder, clearCart } = useStore()
  const [zone, setZone] = useState<Zone>('nairobi')
  const [method, setMethod] = useState<Method>('mpesa')
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [address, setAddress] = useState('')
  const [card, setCard] = useState({ num: '', exp: '', cvc: '' })
  const [err, setErr] = useState<string | null>(null)
  const [stage, setStage] = useState<'form' | 'stk' | 'processing' | 'done'>('form')
  const [done, setDone] = useState<Order | null>(null)
  const [secs, setSecs] = useState(0)

  useEffect(() => {
    if (user && !name) setName(user.name)
  }, [user, name])

  const fee = ZONES.find(z => z.id === zone)!.fee
  const total = subtotal + fee

  useEffect(() => {
    if (stage !== 'stk') return
    setSecs(0)
    const t = window.setInterval(() => setSecs(s => s + 1), 1000)
    return () => window.clearInterval(t)
  }, [stage])

  const finish = (m: Method) => {
    const order = placeOrder({
      items: cart,
      total,
      method: m,
      delivery: ZONES.find(z => z.id === zone)!.label + (zone !== 'pickup' ? ` · ${address}` : ''),
      status: m === 'cod' ? 'Pay on delivery' : 'Paid',
    })
    clearCart()
    setDone(order)
    setStage('done')
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (name.trim().length < 2) return setErr('Please enter your name.')
    if (!normalisePhone(phone)) return setErr('Enter a Kenyan phone number like 0712 345 678.')
    if (zone !== 'pickup' && address.trim().length < 4) return setErr('Where should we deliver? Add an estate, street or building.')
    if (method === 'card') {
      if (!luhn(digits(card.num))) return setErr('That card number does not look right.')
      const [mm, yy] = card.exp.split('/').map(Number)
      const now = new Date()
      if (!mm || mm > 12 || !yy || new Date(2000 + yy, mm) <= now) return setErr('Card expiry is invalid or has passed.')
      if (!/^\d{3,4}$/.test(card.cvc)) return setErr('Enter the 3 or 4 digit CVC.')
      setStage('processing')
      window.setTimeout(() => finish('card'), 1800)
      return
    }
    if (method === 'mpesa') {
      setStage('stk')
      return
    }
    finish('cod')
  }

  if (stage === 'done' && done) {
    return (
      <section className="sec success">
        <div className="success__card">
          <div className="stamp">✓</div>
          <p className="eyebrow">Order {done.id}</p>
          <h1 className="h1">Asante! Your frames are on the bench.</h1>
          <p className="lede">
            {done.method === 'cod'
              ? `Pay ${ksh(done.total)} when your order arrives.`
              : `We received ${ksh(done.total)} via ${done.method === 'mpesa' ? 'M-Pesa' : 'card'}.`}{' '}
            We'll WhatsApp you on {phone} when it's ready, usually within 48 hours.
          </p>
          <div className="success__cta">
            {user ? <a className="btn btn--red" href="#/account">View my orders</a> : <button className="btn btn--red" onClick={() => setAuthOpen('up')}>Create an account to track it</button>}
            <a className="btn btn--ghost" href="#/shop">Keep browsing</a>
          </div>
        </div>
      </section>
    )
  }

  if (cart.length === 0) {
    return (
      <section className="sec nf">
        <h1 className="h1">Your cart is empty.</h1>
        <p className="lede">Find a piece you love first. We'll frame it beautifully.</p>
        <a className="btn btn--red" href="#/shop">Shop the wall</a>
      </section>
    )
  }

  return (
    <section className="sec checkout">
      <h1 className="h1">Checkout</h1>
      {!user && (
        <div className="notice">
          <span>Have an account? Sign in to save this order to your history.</span>
          <button className="link" onClick={() => setAuthOpen('in')}>Sign in</button>
          <button className="link" onClick={() => setAuthOpen('up')}>Create account</button>
        </div>
      )}
      <form className="checkout__grid" onSubmit={submit}>
        <div className="checkout__main">
          <fieldset className="box">
            <legend><span className="step">1</span> Contact</legend>
            <div className="two">
              <label>Full name<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></label>
              <label>Phone (M-Pesa)<input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0712 345 678" inputMode="tel" autoComplete="tel" /></label>
            </div>
          </fieldset>

          <fieldset className="box">
            <legend><span className="step">2</span> Delivery</legend>
            <div className="radios">
              {ZONES.map(z => (
                <label key={z.id} className={`radio ${zone === z.id ? 'is-on' : ''}`}>
                  <input type="radio" name="zone" checked={zone === z.id} onChange={() => setZone(z.id)} />
                  <span><b>{z.label}</b><small>{z.note}</small></span>
                  <em>{z.fee ? ksh(z.fee) : 'Free'}</em>
                </label>
              ))}
            </div>
            {zone !== 'pickup' && (
              <label>Delivery address<input value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. Kilimani, Argwings Kodhek Rd, Apt 4B" autoComplete="street-address" /></label>
            )}
          </fieldset>

          <fieldset className="box">
            <legend><span className="step">3</span> Payment</legend>
            <div className="pay-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={method === 'mpesa'} onClick={() => setMethod('mpesa')}>
                <span className="mpesa">M-PESA</span>
              </button>
              <button type="button" role="tab" aria-selected={method === 'card'} onClick={() => setMethod('card')}>
                Card
              </button>
              <button type="button" role="tab" aria-selected={method === 'cod'} onClick={() => setMethod('cod')}>
                Cash on delivery
              </button>
            </div>
            {method === 'mpesa' && (
              <p className="muted pay-note">
                We'll send an STK push to <b>{phone || 'your phone'}</b>. Enter your M-Pesa PIN on your phone to approve {ksh(total)}.
              </p>
            )}
            {method === 'card' && (
              <div className="cardform">
                <label>
                  Card number
                  <input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    value={card.num}
                    onChange={e => setCard({ ...card, num: digits(e.target.value).slice(0, 19).replace(/(.{4})/g, '$1 ').trim() })}
                  />
                </label>
                <div className="two">
                  <label>
                    Expiry
                    <input
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={card.exp}
                      onChange={e => {
                        const d = digits(e.target.value).slice(0, 4)
                        setCard({ ...card, exp: d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d })
                      }}
                    />
                  </label>
                  <label>
                    CVC
                    <input inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={card.cvc} onChange={e => setCard({ ...card, cvc: digits(e.target.value).slice(0, 4) })} />
                  </label>
                </div>
                <small className="muted">Visa and Mastercard. Payments are encrypted and processed by our payment partner.</small>
              </div>
            )}
            {method === 'cod' && <p className="muted pay-note">Pay in cash or M-Pesa when the rider arrives. Available in Nairobi and for shop pickup.</p>}
          </fieldset>
          {err && <p className="err">{err}</p>}
        </div>

        <aside className="summary">
          <h2>Order summary</h2>
          <ul>
            {cart.map(it => (
              <li key={it.key}>
                <div className="summary__thumb">
                  <Framed art={it.art} ratio={it.ratio} frameId={it.frameId} mat={it.mat} thickness={4} />
                </div>
                <span>
                  <b>{it.title}</b>
                  <small>
                    {SIZES.find(s => s.id === it.sizeId)!.label} · {FRAMES.find(f => f.id === it.frameId)!.name} × {it.qty}
                  </small>
                </span>
                <em>{ksh(it.price * it.qty)}</em>
              </li>
            ))}
          </ul>
          <div className="row"><span>Subtotal</span><b>{ksh(subtotal)}</b></div>
          <div className="row"><span>Delivery</span><b>{fee ? ksh(fee) : 'Free'}</b></div>
          <div className="row row--total"><span>Total</span><b>{ksh(total)}</b></div>
          <button className="btn btn--red btn--block btn--lg" disabled={stage !== 'form'}>
            {method === 'mpesa' ? `Pay ${ksh(total)} with M-Pesa` : method === 'card' ? `Pay ${ksh(total)}` : 'Place order'}
          </button>
        </aside>
      </form>

      {(stage === 'stk' || stage === 'processing') && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Payment in progress">
          <div className="modal__scrim" />
          <div className="stk">
            {stage === 'stk' ? (
              <>
                <div className="stk__phone">
                  <div className="stk__screen">
                    <small>M-PESA</small>
                    <p>
                      Pay <b>{ksh(total)}</b> to <b>FRAME ZETU</b>?
                    </p>
                    <div className="stk__pin">• • • •</div>
                  </div>
                </div>
                <h3>Check your phone</h3>
                <p className="muted">
                  STK push sent to +{normalisePhone(phone)}. Enter your PIN to approve. <span className="tick">{secs}s</span>
                </p>
                <div className="stk__actions">
                  <button className="btn btn--red" onClick={() => finish('mpesa')}>I've entered my PIN</button>
                  <button className="btn btn--ghost" onClick={() => setStage('form')}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="spinner" aria-hidden />
                <h3>Processing your card…</h3>
                <p className="muted">Please don't close this window.</p>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export function Account() {
  const { user, orders, signOut, setAuthOpen, wishlist } = useStore()
  if (!user) {
    return (
      <section className="sec nf">
        <h1 className="h1">Sign in to see your orders</h1>
        <p className="lede">Track frames on the bench, re-order favourites, and keep your pinned wall.</p>
        <div className="success__cta">
          <button className="btn btn--red" onClick={() => setAuthOpen('in')}>Sign in</button>
          <button className="btn btn--ghost" onClick={() => setAuthOpen('up')}>Create account</button>
        </div>
      </section>
    )
  }
  return (
    <section className="sec account">
      <div className="account__card">
        <span className="avatar avatar--lg">{user.name.slice(0, 1).toUpperCase()}</span>
        <div>
          <h1 className="h1">Habari, {user.name.split(' ')[0]}</h1>
          <p className="muted">{user.email}</p>
        </div>
        <div className="account__stats">
          <div><b>{orders.length}</b><small>orders</small></div>
          <div><b>{wishlist.length}</b><small>pinned</small></div>
        </div>
        <button className="btn btn--ghost" onClick={signOut}>Sign out</button>
      </div>

      <h2>Order history</h2>
      {orders.length === 0 ? (
        <p className="empty-line">No orders yet. <a href="#/shop">Find your first piece →</a></p>
      ) : (
        <ul className="orders">
          {orders.map(o => (
            <li key={o.id}>
              <div className="orders__thumbs">
                {o.items.slice(0, 3).map(it => (
                  <div key={it.key}>
                    <Framed art={it.art} ratio={it.ratio} frameId={it.frameId} mat={false} thickness={4} />
                  </div>
                ))}
              </div>
              <div>
                <b>{o.id}</b>
                <small>
                  {new Date(o.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })} · {o.items.reduce((n, i) => n + i.qty, 0)} item(s) · {o.delivery}
                </small>
              </div>
              <span className={`badge ${o.status === 'Paid' ? 'badge--ok' : ''}`}>{o.status}</span>
              <b>{ksh(o.total)}</b>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
