import { ARTWORKS, MOODS } from '../lib/data'
import { ArtCard } from '../components/Shell'
import { Framed } from '../components/Framed'

const FRAME_CYCLE = ['ebony', 'copper', 'chalk', 'mvule', 'walnut', 'ebony', 'gilt']

const RIBBON = ['aic-28560', 'tulip-veil', 'aic-24645', 'sun-hat', 'aic-16568', 'word-legend', 'aic-14655', 'savannah', 'aic-61128', 'tulip-hound', 'aic-27992', 'manifesto']
  .map(id => ARTWORKS.find(a => a.id === id))
  .filter((a): a is (typeof ARTWORKS)[number] => !!a)

export function Home() {
  const featured = ['tulip-hound', 'savannah', 'sun-hat', 'flame-tree', 'word-legend', 'arches', 'tulip-veil']
    .map(id => ARTWORKS.find(a => a.id === id)!)

  return (
    <>
      <section className="hero">
        <p className="eyebrow eyebrow--center">Nairobi framing studio</p>
        <h1>
          Your walls, <span className="t-red">framed</span>
          <br />
          the <span className="t-copper">Zetu</span> way.
        </h1>
        <p className="lede lede--center">
          Gallery prints, your own photos, and full house makeovers. We print, cut, mitre and hang every piece by hand.
        </p>
        <div className="hero__cta">
          <a className="btn btn--red btn--lg" href="#/shop">Shop the wall</a>
          <a className="btn btn--ghost btn--lg" href="#/studio">Frame your photo</a>
        </div>
        <dl className="stats">
          <div><dt>5.3k+</dt><dd>followers on IG</dd></div>
          <div><dt>350+</dt><dd>walls styled</dd></div>
          <div><dt>48h</dt><dd>turnaround</dd></div>
        </dl>
      </section>

      <div className="ribbon" aria-label="Featured pieces">
        <div className="ribbon__track">
          {RIBBON.map((a, i) => (
              <a key={a.id} href={`#/art/${a.id}`} className="ribbon__item" style={{ width: [300, 250, 330, 270][i % 4] * Math.min(Math.max(a.ratio, 0.6), 1.3) }}>
                <Framed art={a.art} ratio={Math.min(Math.max(a.ratio, 0.6), 1.3)} frameId={FRAME_CYCLE[i % FRAME_CYCLE.length]} thickness={9} mat={i % 3 !== 2} alt={a.title} />
                <span>{a.title}</span>
              </a>
            ))}
        </div>
      </div>

      <div className="marquee">
        <div>
          <span>
            Print <i>◆</i> Frame <i>◆</i> Inspire <i>◆</i> House makeovers <i>◆</i> M-Pesa accepted <i>◆</i> Countrywide delivery
          </span>
        </div>
      </div>

      <section className="sec">
        <header className="sec__head">
          <div>
            <p className="eyebrow">The salon wall</p>
            <h2>Hung the way a gallery would</h2>
          </div>
          <a href="#/shop" className="link-arrow">See all pieces →</a>
        </header>
        <div className="salon">
          {featured.map((a, i) => (
            <div key={a.id} className="salon__slot">
              <ArtCard a={a} tilt={[-1.2, 0.8, -0.4, 1, -0.8, 0.6, -1][i]} fit={0.78} />
            </div>
          ))}
          <a href="#/studio" className="salon__slot salon__cta">
            <span className="drop__frame" aria-hidden />
            <b>Your photo here</b>
            <span>Upload any picture and we'll print and frame it.</span>
            <em>Open Frame Studio →</em>
          </a>
        </div>
      </section>

      <section className="sec moods">
        <header className="sec__head">
          <div>
            <p className="eyebrow">Shop by feeling</p>
            <h2>What should the room feel like?</h2>
          </div>
        </header>
        <div className="moods__row">
          {MOODS.map((m, i) => {
            const pick = ARTWORKS.filter(a => a.mood === m)
            return (
              <a key={m} href={`#/shop?mood=${m}`} className={`mood mood--${i}`}>
                <div className="mood__stack">
                  {pick.slice(0, 3).map((a, k) => (
                    <div key={a.id} style={{ ['--k' as string]: k }}>
                      <Framed art={a.art} ratio={a.ratio} thickness={5} mat={false} frameId={k === 0 ? 'copper' : 'ebony'} />
                    </div>
                  ))}
                </div>
                <b>{m}</b>
                <small>{pick.length} pieces</small>
              </a>
            )
          })}
        </div>
      </section>

      <section className="process">
        <div className="process__inner">
          <p className="eyebrow eyebrow--light">How it works</p>
          <h2>Three steps from screen to wall</h2>
          <ol>
            <li>
              <span className="n">01</span>
              <h3>Print</h3>
              <p>Pick from our wall or upload your own photo. We print on archival matte or satin paper with true-to-screen colour.</p>
            </li>
            <li>
              <span className="n">02</span>
              <h3>Frame</h3>
              <p>Choose ebony, copper, oak, walnut, white or gilt. Each corner is cut at 45° and joined by hand, just like our logo.</p>
            </li>
            <li>
              <span className="n">03</span>
              <h3>Inspire</h3>
              <p>We deliver countrywide, or our team comes over with a level and tape measure and hangs the whole wall for you.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="sec promo">
        <div className="promo__photos">
          <img src="/art/installer.jpg" alt="A Frame Zetu installer measuring a wall before hanging frames" />
          <img src="/art/makeover-wall.jpg" alt="Framed prints lined up in the Frame Zetu shop" />
        </div>
        <div className="promo__copy">
          <p className="eyebrow">House makeover</p>
          <h2>Book us. We bring the frames, the level, and the vibe.</h2>
          <p className="lede">
            Living rooms, offices, salons and graduation surprises. Tell us the room and the mood, and we'll style, print, frame and hang a full gallery wall in an afternoon.
          </p>
          <a href="#/makeover" className="btn btn--red btn--lg">Book a makeover</a>
        </div>
      </section>

      <section className="sec ig">
        <header className="sec__head">
          <div>
            <p className="eyebrow">@framezetu</p>
            <h2>Fresh off the workshop floor</h2>
          </div>
          <a href="https://instagram.com/framezetu" target="_blank" rel="noreferrer" className="link-arrow">Follow on Instagram →</a>
        </header>
        <div className="ig__strip">
          {['shop-floor', 'tulip-veil', 'word-legend', 'sun-hat', 'tulip-hound'].map(n => (
            <a key={n} href="https://instagram.com/framezetu" target="_blank" rel="noreferrer">
              <img src={`/art/${n}.jpg`} alt="" loading="lazy" />
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
