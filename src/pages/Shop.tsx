import { useMemo, useState, type ChangeEvent } from 'react'
import { ARTWORKS, CATEGORIES, MOODS, type Category, type Mood } from '../lib/data'
import { ArtCard } from '../components/Shell'
import { Configurator } from '../components/Configurator'
import { useStore } from '../lib/store'

export function Shop({ query }: { query: URLSearchParams }) {
  const [cat, setCat] = useState<Category | 'All'>((query.get('cat') as Category) || 'All')
  const [mood, setMood] = useState<Mood | 'Any'>((query.get('mood') as Mood) || 'Any')
  const [q, setQ] = useState('')

  const list = useMemo(
    () =>
      ARTWORKS.filter(
        a =>
          (cat === 'All' || a.category === cat) &&
          (mood === 'Any' || a.mood === mood) &&
          (q === '' || (a.title + a.artist + a.category).toLowerCase().includes(q.toLowerCase())),
      ),
    [cat, mood, q],
  )

  return (
    <section className="sec shop">
      <header className="shop__head">
        <div>
          <p className="eyebrow">The Wall · {ARTWORKS.length} pieces</p>
          <h1 className="h1">Every piece, framed and ready</h1>
        </div>
        <input className="search" placeholder="Search art, artists…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search" />
      </header>

      <div className="filters">
        <div className="chips" role="group" aria-label="Category">
          {(['All', ...CATEGORIES] as const).map(c => (
            <button key={c} className={cat === c ? 'is-on' : ''} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="chips chips--mood" role="group" aria-label="Mood">
          {(['Any', ...MOODS] as const).map(m => (
            <button key={m} className={mood === m ? 'is-on' : ''} onClick={() => setMood(m)}>{m === 'Any' ? 'Any mood' : m}</button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <p className="empty-line">Nothing matches that yet. Try another mood, or <a href="#/studio">frame your own photo</a>.</p>
      ) : (
        <div className="wall">
          {list.map((a, i) => (
            <ArtCard key={a.id} a={a} tilt={((i * 37) % 5) * 0.5 - 1} />
          ))}
        </div>
      )}
    </section>
  )
}

export function ArtDetail({ id }: { id: string }) {
  const a = ARTWORKS.find(x => x.id === id)
  const { wishlist, toggleWish } = useStore()
  if (!a) return <NotFound />
  const related = ARTWORKS.filter(x => x.id !== a.id && (x.category === a.category || x.mood === a.mood)).slice(0, 4)
  const pinned = wishlist.includes(a.id)

  return (
    <>
      <section className="sec detail">
        <nav className="crumbs">
          <a href="#/shop">The Wall</a> / <a href={`#/shop?cat=${a.category}`}>{a.category}</a> / <span>{a.title}</span>
        </nav>
        <div className="detail__head">
          <div>
            <h1 className="h1">{a.title}</h1>
            <p className="muted">
              by <b>{a.artist}</b> · {a.category} · {a.mood} mood
            </p>
          </div>
          <button className={`btn btn--ghost ${pinned ? 'is-on' : ''}`} onClick={() => toggleWish(a.id)}>
            {pinned ? '♥ Pinned' : '♡ Pin to my wall'}
          </button>
        </div>
        <p className="lede detail__blurb">{a.blurb}</p>
        <Configurator artworkId={a.id} title={a.title} art={a.art} ratio={a.ratio} />
      </section>
      {related.length > 0 && (
        <section className="sec">
          <header className="sec__head">
            <h2>Hangs well next to</h2>
          </header>
          <div className="wall wall--row">
            {related.map((r, i) => (
              <ArtCard key={r.id} a={r} tilt={i % 2 ? 0.8 : -0.8} size="sm" />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

/** Downscale an uploaded photo so it fits comfortably in local storage. */
function shrink(file: File, max = 900): Promise<{ src: string; ratio: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k)
      c.height = Math.round(img.height * k)
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(img.src)
      resolve({ src: c.toDataURL('image/jpeg', 0.82), ratio: img.width / img.height })
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export function Studio() {
  const [photo, setPhoto] = useState<{ src: string; ratio: number; name: string; id: string } | null>(null)
  const [drag, setDrag] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const take = async (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return setErr('Please choose an image file (JPG, PNG, HEIC exported as JPG).')
    setErr(null)
    try {
      const s = await shrink(file)
      setPhoto({ ...s, name: file.name.replace(/\.[^.]+$/, ''), id: 'custom-' + Date.now().toString(36) })
    } catch {
      setErr("We couldn't read that image. Try another one.")
    }
  }

  return (
    <section className="sec studio">
      <header className="studio__head">
        <p className="eyebrow">Frame Studio</p>
        <h1 className="h1">Your photo, our frame.</h1>
        <p className="lede">Graduation, wedding, the first family portrait, or your best IG post. Upload it, choose a moulding, and see it on a wall before we print.</p>
      </header>

      {!photo ? (
        <label
          className={`drop ${drag ? 'is-drag' : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files[0]) }}
        >
          <input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => take(e.target.files?.[0])} />
          <span className="drop__frame" aria-hidden />
          <b>Drop a photo here</b>
          <span>or tap to choose from your phone</span>
          <small className="muted">For sharp prints up to A1, use the original file, not a WhatsApp copy.</small>
          {err && <p className="err">{err}</p>}
        </label>
      ) : (
        <>
          <div className="studio__bar">
            <span>
              Framing <b>{photo.name}</b>
            </span>
            <button className="link" onClick={() => setPhoto(null)}>Use a different photo</button>
          </div>
          <Configurator artworkId={photo.id} title={`Custom: ${photo.name}`} art={{ kind: 'img', src: photo.src }} ratio={photo.ratio} />
        </>
      )}
    </section>
  )
}

export function Pinned() {
  const { wishlist } = useStore()
  const list = ARTWORKS.filter(a => wishlist.includes(a.id))
  return (
    <section className="sec">
      <header className="shop__head">
        <div>
          <p className="eyebrow">Your moodboard</p>
          <h1 className="h1">Pinned wall</h1>
        </div>
      </header>
      {list.length === 0 ? (
        <p className="empty-line">
          Tap the ♡ on any piece to pin it here and build your wall before you buy. <a href="#/shop">Start pinning →</a>
        </p>
      ) : (
        <div className="wall">
          {list.map((a, i) => (
            <ArtCard key={a.id} a={a} tilt={i % 2 ? 1 : -1} />
          ))}
        </div>
      )}
    </section>
  )
}

export function NotFound() {
  return (
    <section className="sec nf">
      <h1 className="h1">This frame is empty.</h1>
      <p className="lede">The page you were looking for isn't on our wall.</p>
      <a className="btn btn--red" href="#/">Back home</a>
    </section>
  )
}
