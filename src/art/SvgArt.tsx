import type { SvgArtId } from '../lib/data'

/* Original house pieces drawn in Frame Zetu's palette: brand red, copper, olive, cream. */
const C = { red: '#d7282f', wine: '#8e1b22', copper: '#b8693a', clay: '#d08452', olive: '#7d7a2f', sand: '#efe2c9', cream: '#f8f1e4', ink: '#1a1412' }

function Arches() {
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill={C.sand} />
      <rect y="250" width="300" height="150" fill={C.clay} />
      {[0, 1, 2].map(i => (
        <g key={i} transform={`translate(${20 + i * 90} 0)`}>
          <path d="M0 330 V150 a40 40 0 0 1 80 0 V330 Z" fill={[C.red, C.copper, C.wine][i]} />
          <path d="M14 330 V160 a26 26 0 0 1 52 0 V330 Z" fill={C.cream} opacity={0.9} />
          <path d="M26 330 V175 a14 14 0 0 1 28 0 V330 Z" fill={[C.olive, C.wine, C.copper][i]} />
        </g>
      ))}
      <circle cx="232" cy="64" r="26" fill={C.red} />
      <rect y="330" width="300" height="70" fill={C.ink} opacity={0.9} />
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={20 + i * 37} cy="365" r="9" fill={C.sand} />
      ))}
    </svg>
  )
}

function Savannah() {
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3c58c" />
          <stop offset="1" stopColor={C.clay} />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#sky)" />
      <circle cx="150" cy="190" r="78" fill={C.red} />
      <path d="M0 250 Q80 210 150 245 T300 230 V400 H0Z" fill={C.copper} />
      <path d="M0 290 Q100 260 190 290 T300 280 V400 H0Z" fill={C.wine} />
      <path d="M0 330 Q120 310 300 335 V400 H0Z" fill={C.ink} />
      <g fill={C.ink}>
        <rect x="206" y="236" width="6" height="60" />
        <path d="M209 240 l-30 -14 M209 246 l26 -18" stroke={C.ink} strokeWidth="4" />
        <ellipse cx="190" cy="222" rx="34" ry="9" />
        <ellipse cx="232" cy="226" rx="28" ry="8" />
      </g>
      <g stroke={C.ink} strokeWidth="2" fill="none">
        <path d="M60 120 q6 -6 12 0 q6 -6 12 0" />
        <path d="M92 100 q5 -5 10 0 q5 -5 10 0" />
      </g>
    </svg>
  )
}

function Manifesto() {
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill={C.cream} />
      <path d="M0 0 H300 L250 50 H50 Z" fill={C.copper} />
      <path d="M0 0 L50 50 V400 H0 Z" fill={C.red} />
      <g fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fill={C.ink}>
        <text x="66" y="140" fontSize="54">Print.</text>
        <text x="66" y="210" fontSize="54" fill={C.copper}>Frame.</text>
        <text x="66" y="280" fontSize="46" fill={C.red}>Inspire.</text>
      </g>
      <line x1="66" y1="310" x2="270" y2="310" stroke={C.ink} strokeWidth="2" />
      <text x="66" y="336" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="12" letterSpacing="3" fill={C.ink}>
        NAIROBI · KENYA · EST. ZETU
      </text>
    </svg>
  )
}

function Skyline() {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#1c1513" />
      <circle cx="310" cy="80" r="34" fill={C.clay} />
      <circle cx="322" cy="72" r="30" fill="#1c1513" />
      <path
        d="M0 240 H30 V190 H50 V170 H62 V200 H80 V150 H96 V140 H104 V150 H118 V210 H140 V120 H150 V100 h4 v-14 h4 v14 H170 V120 H180 V200 H196 V160 a18 18 0 0 1 36 0 V200 H244 V138 H262 V180 H280 V130 H300 V200 H320 V170 H344 V220 H370 V190 H400"
        fill="none"
        stroke={C.sand}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <rect x="0" y="240" width="400" height="60" fill={C.wine} />
      <path d="M0 252 H400" stroke={C.red} strokeWidth="3" />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={104 + (i % 7) * 26} y={160 + Math.floor(i / 7) * 22} width="4" height="6" fill={C.clay} opacity={0.8} />
      ))}
    </svg>
  )
}

function FlameTree() {
  const petals = [
    [90, 110], [140, 80], [200, 120], [70, 180], [230, 190], [130, 160], [180, 210], [100, 240],
  ]
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill="#f4e8d2" />
      <path d="M150 400 V260 Q150 220 110 190 M150 270 Q160 220 210 200" stroke={C.ink} strokeWidth="10" fill="none" strokeLinecap="round" />
      {petals.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${i * 40})`}>
          <ellipse rx="34" ry="18" fill={C.olive} transform="rotate(30)" />
          {[0, 72, 144, 216, 288].map(r => (
            <ellipse key={r} rx="9" ry="20" cy="-14" fill={i % 2 ? C.red : '#e8541e'} transform={`rotate(${r})`} />
          ))}
          <circle r="6" fill="#f3c04b" />
        </g>
      ))}
      <rect y="360" width="300" height="40" fill={C.copper} />
    </svg>
  )
}

function Kanga() {
  const cells = Array.from({ length: 16 }, (_, i) => i)
  return (
    <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="300" fill={C.cream} />
      {cells.map(i => {
        const x = (i % 4) * 75
        const y = Math.floor(i / 4) * 75
        const t = (i * 7) % 4
        const fill = [C.red, C.copper, C.ink, C.olive][(i * 3) % 4]
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            {t === 0 && <circle cx="37.5" cy="37.5" r="28" fill={fill} />}
            {t === 1 && <path d="M37.5 6 L69 37.5 L37.5 69 L6 37.5Z" fill={fill} />}
            {t === 2 && <path d="M0 75 A75 75 0 0 1 75 0 V75Z" fill={fill} />}
            {t === 3 && [0, 1, 2, 3].map(k => <rect key={k} y={k * 19} width="75" height="9" fill={fill} />)}
          </g>
        )
      })}
      <rect x="6" y="6" width="288" height="288" fill="none" stroke={C.ink} strokeWidth="3" strokeDasharray="10 6" />
    </svg>
  )
}

const MAP: Record<SvgArtId, () => JSX.Element> = {
  arches: Arches,
  savannah: Savannah,
  manifesto: Manifesto,
  skyline: Skyline,
  'flame-tree': FlameTree,
  kanga: Kanga,
}

export function SvgArt({ id }: { id: SvgArtId }) {
  const Art = MAP[id]
  return <Art />
}
