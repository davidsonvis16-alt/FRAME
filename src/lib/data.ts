import { STOCK } from './stock'

export type ArtSource = { kind: 'img'; src: string } | { kind: 'svg'; id: SvgArtId }

export type SvgArtId = 'arches' | 'savannah' | 'manifesto' | 'skyline' | 'flame-tree' | 'kanga'

export type Category = 'Portraits' | 'Botanical' | 'Posters' | 'Typography' | 'Abstract' | 'City' | 'Japanese' | 'Pop'
export type Mood = 'Warm' | 'Bold' | 'Calm' | 'Playful'

export interface Artwork {
  id: string
  title: string
  artist: string
  category: Category
  mood: Mood
  art: ArtSource
  /** width / height */
  ratio: number
  blurb: string
  bestseller?: boolean
}

export interface FrameStyle {
  id: string
  name: string
  /** CSS colors for the four moulding faces: top, right, bottom, left */
  faces: [string, string, string, string]
  extra: number
  wood?: boolean
}

export interface PrintSize {
  id: string
  label: string
  cm: string
  price: number
}

export const FRAMES: FrameStyle[] = [
  { id: 'ebony', name: 'Ebony Black', faces: ['#2a2422', '#141110', '#0b0908', '#1d1817'], extra: 0 },
  { id: 'copper', name: 'Zetu Copper', faces: ['#d08452', '#b8693a', '#93512a', '#a85e33'], extra: 900, wood: true },
  { id: 'mvule', name: 'Mvule Oak', faces: ['#c9a06b', '#b08655', '#8f6a40', '#a37b4b'], extra: 600, wood: true },
  { id: 'walnut', name: 'Walnut', faces: ['#6b4128', '#56321e', '#3e2314', '#4c2c1a'], extra: 800, wood: true },
  { id: 'chalk', name: 'Chalk White', faces: ['#ffffff', '#eeeae4', '#dcd6ce', '#f4f1ec'], extra: 0 },
  { id: 'gilt', name: 'Gilt Gold', faces: ['#f1d28a', '#d4ac5a', '#a9822f', '#c79d4b'], extra: 1400 },
]

export const SIZES: PrintSize[] = [
  { id: 'a4', label: 'A4', cm: '21 × 30 cm', price: 1800 },
  { id: 'a3', label: 'A3', cm: '30 × 42 cm', price: 2900 },
  { id: 'a2', label: 'A2', cm: '42 × 59 cm', price: 4600 },
  { id: 'a1', label: 'A1', cm: '59 × 84 cm', price: 7200 },
]

export const MAT_PRICE = 450
export const DELIVERY = { nairobi: 300, countrywide: 650 }

export const ARTWORKS: Artwork[] = [
  {
    id: 'tulip-veil',
    title: 'Tulip Veil',
    artist: 'Studio Zetu',
    category: 'Portraits',
    mood: 'Warm',
    art: { kind: 'img', src: '/art/tulip-veil.jpg' },
    ratio: 0.8,
    blurb: 'Deep-red tulips held close against an olive-striped robe. Quiet, romantic, and the piece everyone asks about in the shop.',
    bestseller: true,
  },
  {
    id: 'sun-hat',
    title: 'Afternoon in Lamu',
    artist: 'Studio Zetu',
    category: 'Portraits',
    mood: 'Warm',
    art: { kind: 'img', src: '/art/sun-hat.jpg' },
    ratio: 0.8,
    blurb: 'Sun hat, stripes, a sleepy dog and a bowl of cherries under coastal arches. Pairs perfectly with Tulip Veil.',
    bestseller: true,
  },
  {
    id: 'word-legend',
    title: 'The Word Legend',
    artist: 'Typeface Collective',
    category: 'Typography',
    mood: 'Bold',
    art: { kind: 'img', src: '/art/word-legend.jpg' },
    ratio: 0.45,
    blurb: 'A basketball icon built entirely out of words: dedication, dominance, legacy. Typographic portrait for the hustle wall.',
  },
  {
    id: 'tulip-hound',
    title: 'Tulip Hound',
    artist: 'Wanjiru K.',
    category: 'Pop',
    mood: 'Playful',
    art: { kind: 'img', src: '/art/tulip-hound.jpg' },
    ratio: 0.42,
    blurb: 'A Great Dane bringing you pink tulips against a brick-red backdrop. A playful pop piece for entryways.',
    bestseller: true,
  },
  {
    id: 'arches',
    title: 'Arches of Old Town',
    artist: 'Studio Zetu',
    category: 'Abstract',
    mood: 'Calm',
    art: { kind: 'svg', id: 'arches' },
    ratio: 0.75,
    blurb: 'Mombasa Old Town doorways reduced to arches of clay, rust and sand.',
  },
  {
    id: 'savannah',
    title: 'Savannah Hour',
    artist: 'Otieno M.',
    category: 'Abstract',
    mood: 'Warm',
    art: { kind: 'svg', id: 'savannah' },
    ratio: 0.75,
    blurb: 'An acacia, a big copper sun and layered hills at golden hour in the Mara.',
  },
  {
    id: 'manifesto',
    title: 'Print. Frame. Inspire.',
    artist: 'Frame Zetu',
    category: 'Typography',
    mood: 'Bold',
    art: { kind: 'svg', id: 'manifesto' },
    ratio: 0.75,
    blurb: 'Our motto as a poster, set in heavy display type and finished in brand red.',
  },
  {
    id: 'skyline',
    title: 'Nairobi After Dark',
    artist: 'Line & Ink',
    category: 'City',
    mood: 'Calm',
    art: { kind: 'svg', id: 'skyline' },
    ratio: 1.33,
    blurb: 'KICC and the CBD skyline drawn as one continuous line under a warm moon.',
  },
  {
    id: 'flame-tree',
    title: 'Flame Tree',
    artist: 'Achieng O.',
    category: 'Botanical',
    mood: 'Playful',
    art: { kind: 'svg', id: 'flame-tree' },
    ratio: 0.75,
    blurb: 'Nandi flame blossoms in paper-cut style with bold leaves and loud colour.',
  },
  {
    id: 'kanga',
    title: 'Kanga Grid',
    artist: 'Studio Zetu',
    category: 'Abstract',
    mood: 'Bold',
    art: { kind: 'svg', id: 'kanga' },
    ratio: 1,
    blurb: 'A geometric study of kanga borders: circles, diamonds and stripes in red and copper.',
  },
]

const tidy = (t: string) => t.replace(/\s*\((?:[^()]*)\)?\s*$/, '').replace(/,? from the series.*$/i, '').replace(/,? also known as.*$/i, '').trim()

const seenTitles = new Set<string>()
const MUSEUM: Artwork[] = STOCK.filter(a => {
  const t = tidy(a.title)
  if (seenTitles.has(t)) return false
  seenTitles.add(t)
  return true
}).map((a, i) => ({
  id: a.id,
  title: tidy(a.title),
  artist: a.artist,
  category: (a.category === 'Typography' ? 'Posters' : a.category) as Category,
  mood: a.mood as Mood,
  art: { kind: 'img', src: `/art/stock/${a.id}.jpg` },
  ratio: a.ratio,
  blurb: `A museum classic by ${a.artist}, printed on archival matte paper and framed by hand in Nairobi.`,
  bestseller: i % 9 === 4,
}))

ARTWORKS.push(...MUSEUM)

export const CATEGORIES: Category[] = ['Portraits', 'Botanical', 'Posters', 'Typography', 'Abstract', 'City', 'Japanese', 'Pop']
export const MOODS: Mood[] = ['Warm', 'Bold', 'Calm', 'Playful']

export const ksh = (n: number) => 'KSh ' + n.toLocaleString('en-KE')

export function unitPrice(sizeId: string, frameId: string, mat: boolean) {
  const size = SIZES.find(s => s.id === sizeId) ?? SIZES[0]
  const frame = FRAMES.find(f => f.id === frameId) ?? FRAMES[0]
  return size.price + frame.extra + (mat ? MAT_PRICE : 0)
}
