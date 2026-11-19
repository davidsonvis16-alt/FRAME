import { useEffect, useState, type FormEvent } from 'react'
import { useStore } from '../lib/store'
import { go } from '../lib/router'
import { FRAMES, SIZES, ksh, type Artwork } from '../lib/data'
import { Framed } from './Framed'

const NAV = [
  { href: '/shop', label: 'The Wall', note: 'Shop framed art' },
  { href: '/studio', label: 'Frame Studio', note: 'Frame your own photo' },
  { href: '/makeover', label: 'House Makeover', note: 'We hang it for you' },
  { href: '/pinned', label: 'Pinned', note: 'Your moodboard' },
]

export function Header({ path }: { path: string }) {
  const { user, cartCount, wishlist, setCartOpen, setAuthOpen, signOut } = useStore()
  const [menu, setMenu] = useState(false)
  const [acct, setAcct] = useState(false)

  useEffect(() => {
    setMenu(false)
    setAcct(false)
  }, [path])

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
  }, [menu])

  return (
    <>
      <header className="hdr">
        <nav className="hdr__nav" aria-label="Main">
          {NAV.map(n => (
            <a key={n.href} href={'#' + n.href} className={path.startsWith(n.href) ? 'is-on' : ''}>
              {n.label}
              {n.href === '/pinned' && wishlist.length > 0 && <i className="dot">{wishlist.length}</i>}
            </a>
          ))}
        </nav>

        <a href="#/" className="hdr__brand" aria-label="Frame Zetu home">
          <img src="/mark.png" alt="" />
          <span className="brandname">
            <b>Frame</b> <b>Zetu</b>
          </span>
        </a>

        <div className="hdr__actions">
          {user ? (
            <div className="acct">
              <button className="chip" onClick={() => setAcct(a => !a)} aria-expanded={acct}>
                <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span>
                <span className="hide-sm">{user.name.split(' ')[0]}</span>
              </button>
              {acct && (
                <div className="acct__menu" role="menu">
                  <a href="#/account">My orders</a>
                  <a href="#/pinned">Pinned wall</a>
                  <button onClick={signOut}>Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <button className="chip hide-sm" onClick={() => setAuthOpen('in')}>
              Sign in
            </button>
          )}
          <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label={`Cart, ${cartCount} items`}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 4h2l2.4 11h10.2L20 7H6.2" />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="17" cy="20" r="1.4" />
            </svg>
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
          <button className="burger" onClick={() => setMenu(true)} aria-label="Open menu">
            <i />
            <i />
          </button>
        </div>
      </header>

      {menu && (
        <div className="menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="menu__corner" aria-hidden />
          <button className="menu__close" onClick={() => setMenu(false)} aria-label="Close menu">
            ✕
          </button>
          <ol className="menu__list">
            <li>
              <a href="#/">
                <em>00</em>Home<small>Start here</small>
              </a>
            </li>
            {NAV.map((n, i) => (
              <li key={n.href}>
                <a href={'#' + n.href}>
                  <em>0{i + 1}</em>
                  {n.label}
                  <small>{n.note}</small>
                </a>
              </li>
            ))}
          </ol>
          <div className="menu__foot">
            {user ? (
              <>
                <a href="#/account">My orders</a>
                <button onClick={signOut}>Sign out</button>
              </>
            ) : (
              <>
                <button onClick={() => { setMenu(false); setAuthOpen('in') }}>Sign in</button>
                <button onClick={() => { setMenu(false); setAuthOpen('up') }}>Create account</button>
              </>
            )}
            <a href="https://instagram.com/framezetu" target="_blank" rel="noreferrer">@framezetu</a>
          </div>
        </div>
      )}
    </>
  )
}

export function ArtCard({ a, tilt = 0, size = 'md', fit }: { a: Artwork; tilt?: number; size?: 'sm' | 'md' | 'lg'; fit?: number }) {
  const { wishlist, toggleWish } = useStore()
  const pinned = wishlist.includes(a.id)
  return (
    <article className={`card card--${size}`} style={{ ['--tilt' as string]: `${tilt}deg` }}>
      <a href={`#/art/${a.id}`} className="card__hang" aria-label={a.title}>
        <span className="card__wire" aria-hidden />
        <Framed art={a.art} ratio={fit ?? a.ratio} alt={a.title} thickness={size === 'lg' ? 16 : 11} frameId={a.bestseller ? 'copper' : 'ebony'} />
      </a>
      <div className="card__plate">
        <div>
          <span className="card__cat">{a.category}</span>
          <h3>
            <a href={`#/art/${a.id}`}>{a.title}</a>
          </h3>
          <p>{a.artist}</p>
        </div>
        <div className="card__side">
          <b>from {ksh(SIZES[0].price)}</b>
          <button className={`pin ${pinned ? 'is-on' : ''}`} onClick={() => toggleWish(a.id)} aria-pressed={pinned} aria-label={pinned ? 'Unpin' : 'Pin to wall'}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill={pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-4.4-9.3-9C1.2 8.8 3.3 5 7 5c2 0 3.4 1.2 5 3 1.6-1.8 3-3 5-3 3.7 0 5.8 3.8 4.3 7-2.3 4.6-9.3 9-9.3 9z" />
            </svg>
          </button>
        </div>
      </div>
      {a.bestseller && <span className="card__ribbon">Bestseller</span>}
    </article>
  )
}

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, removeFromCart, subtotal } = useStore()
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [setCartOpen])

  return (
    <div className={`drawer ${cartOpen ? 'is-open' : ''}`} aria-hidden={!cartOpen}>
      <div className="drawer__scrim" onClick={() => setCartOpen(false)} />
      <aside className="drawer__panel" role="dialog" aria-label="Cart">
        <div className="drawer__head">
          <h2>Your cart</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart">✕</button>
        </div>
        {cart.length === 0 ? (
          <div className="empty">
            <Framed art={{ kind: 'svg', id: 'manifesto' }} ratio={0.75} thickness={8} frameId="copper" />
            <p>Your walls are waiting. Nothing in the cart yet.</p>
            <button className="btn btn--red" onClick={() => { setCartOpen(false); go('/shop') }}>Browse the wall</button>
          </div>
        ) : (
          <>
            <ul className="lines">
              {cart.map(it => {
                const frame = FRAMES.find(f => f.id === it.frameId)!
                const size = SIZES.find(s => s.id === it.sizeId)!
                return (
                  <li key={it.key}>
                    <div className="lines__thumb">
                      <Framed art={it.art} ratio={it.ratio} frameId={it.frameId} mat={it.mat} thickness={5} />
                    </div>
                    <div className="lines__info">
                      <b>{it.title}</b>
                      <small>
                        {size.label} · {frame.name}
                        {it.mat ? ' · Mat' : ''}
                      </small>
                      <div className="qty">
                        <button onClick={() => setQty(it.key, it.qty - 1)} aria-label="Decrease">−</button>
                        <span>{it.qty}</span>
                        <button onClick={() => setQty(it.key, it.qty + 1)} aria-label="Increase">+</button>
                        <button className="link" onClick={() => removeFromCart(it.key)}>Remove</button>
                      </div>
                    </div>
                    <b className="lines__price">{ksh(it.price * it.qty)}</b>
                  </li>
                )
              })}
            </ul>
            <div className="drawer__foot">
              <div className="row">
                <span>Subtotal</span>
                <b>{ksh(subtotal)}</b>
              </div>
              <small>Delivery and payment are chosen at checkout. We accept M-Pesa, cards, and pay on delivery in Nairobi.</small>
              <button className="btn btn--red btn--block" onClick={() => { setCartOpen(false); go('/checkout') }}>
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export function AuthModal() {
  const { authOpen, setAuthOpen, signIn, signUp, notify } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setErr(null)
  }, [authOpen])

  if (!authOpen) return null
  const up = authOpen === 'up'

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (up && name.trim().length < 2) return setErr('Tell us your name.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email.')
    if (pw.length < 6) return setErr('Password must be at least 6 characters.')
    setBusy(true)
    const res = up ? await signUp(name, email, pw) : await signIn(email, pw)
    setBusy(false)
    if (res) return setErr(res)
    setAuthOpen(false)
    setPw('')
    notify(up ? `Karibu, ${name.split(' ')[0]}! Account created.` : 'Welcome back!')
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={up ? 'Create account' : 'Sign in'}>
      <div className="modal__scrim" onClick={() => setAuthOpen(false)} />
      <form className="modal__card" onSubmit={submit}>
        <div className="modal__art" aria-hidden>
          <img src="/art/tulip-veil.jpg" alt="" />
          <p>“Print and frame your inspiration with us.”</p>
        </div>
        <div className="modal__body">
          <button type="button" className="modal__x" onClick={() => setAuthOpen(false)} aria-label="Close">✕</button>
          <img src="/logo.png" alt="Frame Zetu" className="modal__logo" />
          <h2>{up ? 'Create your account' : 'Welcome back'}</h2>
          <p className="muted">{up ? 'Track orders, save pinned pieces, and check out faster.' : 'Sign in to see your orders and pinned wall.'}</p>
          {up && (
            <label>
              Full name
              <input value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
            </label>
          )}
          <label>
            Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label>
            Password
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete={up ? 'new-password' : 'current-password'} />
          </label>
          {err && <p className="err">{err}</p>}
          <button className="btn btn--red btn--block" disabled={busy}>
            {busy ? 'One moment…' : up ? 'Create account' : 'Sign in'}
          </button>
          <p className="switch">
            {up ? 'Already have an account?' : 'New to Frame Zetu?'}{' '}
            <button type="button" onClick={() => setAuthOpen(up ? 'in' : 'up')}>
              {up ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

export function Toast() {
  const { toast } = useStore()
  return (
    <div className={`toast ${toast ? 'is-on' : ''}`} role="status" aria-live="polite">
      {toast}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr__band">
        <span>Print.</span>
        <span>Frame.</span>
        <span>Inspire.</span>
      </div>
      <div className="ftr__grid">
        <div>
          <img src="/logo-white.png" alt="Frame Zetu" className="ftr__logo" />
          <p>Custom printing, framing and wall styling from our Nairobi workshop. Every frame is cut, mitred and hung by hand.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <a href="#/shop">The Wall</a>
          <a href="#/studio">Frame Studio</a>
          <a href="#/pinned">Pinned</a>
        </div>
        <div>
          <h4>Services</h4>
          <a href="#/makeover">House makeover</a>
          <a href="#/studio">Photo printing</a>
          <a href="#/makeover">Corporate walls</a>
        </div>
        <div>
          <h4>Visit</h4>
          <p>Nairobi, Kenya</p>
          <a href="https://instagram.com/framezetu" target="_blank" rel="noreferrer">Instagram @framezetu</a>
          <p className="muted">Mon to Sat · 8am to 7pm</p>
        </div>
      </div>
      <small className="ftr__legal">© {new Date().getFullYear()} Frame Zetu. All rights reserved.</small>
    </footer>
  )
}
