import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ARTWORKS, unitPrice, type ArtSource } from './data'

export interface User {
  name: string
  email: string
  phone?: string
}

interface StoredUser extends User {
  /** Demo-only hash; a real deployment must authenticate on a server. */
  hash: string
}

export interface CartItem {
  key: string
  artworkId: string
  title: string
  art: ArtSource
  ratio: number
  sizeId: string
  frameId: string
  mat: boolean
  qty: number
  price: number
}

export interface Order {
  id: string
  date: string
  items: CartItem[]
  total: number
  method: 'mpesa' | 'card' | 'cod'
  delivery: string
  status: 'Paid' | 'Pay on delivery'
}

interface Store {
  user: User | null
  signUp: (name: string, email: string, password: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => void
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'key' | 'qty' | 'price'>, qty?: number) => void
  setQty: (key: string, qty: number) => void
  removeFromCart: (key: string) => void
  clearCart: () => void
  cartCount: number
  subtotal: number
  wishlist: string[]
  toggleWish: (id: string) => void
  orders: Order[]
  placeOrder: (o: Omit<Order, 'id' | 'date'>) => Order
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  authOpen: false | 'in' | 'up'
  setAuthOpen: (v: false | 'in' | 'up') => void
  toast: string | null
  notify: (msg: string) => void
}

const Ctx = createContext<Store | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — state stays in memory */
  }
}

async function hash(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('fz:' + text))
  return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('')
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => load('fz.session', null))
  const [cart, setCart] = useState<CartItem[]>(() => load('fz.cart', []))
  const [wishlist, setWishlist] = useState<string[]>(() => load('fz.wish', []))
  const [orders, setOrders] = useState<Order[]>(() => (user ? load('fz.orders.' + user.email, []) : []))
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState<false | 'in' | 'up'>(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => save('fz.cart', cart), [cart])
  useEffect(() => save('fz.wish', wishlist), [wishlist])
  useEffect(() => save('fz.session', user), [user])
  useEffect(() => {
    setOrders(user ? load('fz.orders.' + user.email, []) : [])
  }, [user])

  const notify = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(t => (t === msg ? null : t)), 2600)
  }, [])

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const users = load<StoredUser[]>('fz.users', [])
    const e = email.trim().toLowerCase()
    if (users.some(u => u.email === e)) return 'An account with that email already exists.'
    const u: StoredUser = { name: name.trim(), email: e, hash: await hash(password) }
    save('fz.users', [...users, u])
    setUser({ name: u.name, email: u.email })
    return null
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const users = load<StoredUser[]>('fz.users', [])
    const e = email.trim().toLowerCase()
    const u = users.find(x => x.email === e)
    if (!u || u.hash !== (await hash(password))) return 'Email or password is incorrect.'
    setUser({ name: u.name, email: u.email, phone: u.phone })
    return null
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    notify('Signed out. Karibu tena!')
  }, [notify])

  const addToCart: Store['addToCart'] = useCallback((item, qty = 1) => {
    const key = [item.artworkId, item.sizeId, item.frameId, item.mat ? 'm' : 'n'].join('|')
    const price = unitPrice(item.sizeId, item.frameId, item.mat)
    setCart(c => {
      const hit = c.find(x => x.key === key)
      if (hit) return c.map(x => (x.key === key ? { ...x, qty: x.qty + qty } : x))
      return [...c, { ...item, key, qty, price }]
    })
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setCart(c => (qty <= 0 ? c.filter(x => x.key !== key) : c.map(x => (x.key === key ? { ...x, qty } : x))))
  }, [])

  const removeFromCart = useCallback((key: string) => setCart(c => c.filter(x => x.key !== key)), [])
  const clearCart = useCallback(() => setCart([]), [])

  const toggleWish = useCallback(
    (id: string) => {
      setWishlist(w => {
        const on = w.includes(id)
        const title = ARTWORKS.find(a => a.id === id)?.title ?? 'Piece'
        notify(on ? `${title} removed from your wall` : `${title} pinned to your wall`)
        return on ? w.filter(x => x !== id) : [...w, id]
      })
    },
    [notify],
  )

  const placeOrder = useCallback(
    (o: Omit<Order, 'id' | 'date'>) => {
      const order: Order = { ...o, id: 'FZ-' + Math.random().toString(36).slice(2, 8).toUpperCase(), date: new Date().toISOString() }
      if (user) {
        const next = [order, ...load<Order[]>('fz.orders.' + user.email, [])]
        save('fz.orders.' + user.email, next)
        setOrders(next)
      }
      return order
    },
    [user],
  )

  const cartCount = cart.reduce((n, x) => n + x.qty, 0)
  const subtotal = cart.reduce((n, x) => n + x.qty * x.price, 0)

  const value = useMemo<Store>(
    () => ({
      user, signUp, signIn, signOut,
      cart, addToCart, setQty, removeFromCart, clearCart, cartCount, subtotal,
      wishlist, toggleWish, orders, placeOrder,
      cartOpen, setCartOpen, authOpen, setAuthOpen, toast, notify,
    }),
    [user, signUp, signIn, signOut, cart, addToCart, setQty, removeFromCart, clearCart, cartCount, subtotal, wishlist, toggleWish, orders, placeOrder, cartOpen, authOpen, toast, notify],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}
