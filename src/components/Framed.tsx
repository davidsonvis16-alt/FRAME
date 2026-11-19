import type { CSSProperties } from 'react'
import { FRAMES, type ArtSource } from '../lib/data'
import { SvgArt } from '../art/SvgArt'

interface Props {
  art: ArtSource
  ratio: number
  frameId?: string
  mat?: boolean
  /** moulding thickness in px */
  thickness?: number
  alt?: string
  className?: string
  style?: CSSProperties
}

/**
 * A picture frame built with four differently-shaded CSS borders, which
 * meet at 45° — the same mitred joint that shapes the FZ logo.
 */
export function Framed({ art, ratio, frameId = 'ebony', mat = true, thickness = 14, alt = '', className = '', style }: Props) {
  const f = FRAMES.find(x => x.id === frameId) ?? FRAMES[0]
  const [t, r, b, l] = f.faces
  return (
    <div
      className={`framed ${f.wood ? 'framed--wood' : ''} ${className}`}
      style={{
        borderWidth: thickness,
        borderColor: `${t} ${r} ${b} ${l}`,
        ...style,
      }}
    >
      <div className="framed__mat" style={{ padding: mat ? `${Math.max(8, thickness * 1.1)}px` : 0 }}>
        <div className="framed__art" style={{ aspectRatio: String(ratio) }}>
          {art.kind === 'img' ? <img src={art.src} alt={alt} loading="lazy" draggable={false} /> : <SvgArt id={art.id} />}
        </div>
      </div>
    </div>
  )
}
