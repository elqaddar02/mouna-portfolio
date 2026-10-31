import type { CSSProperties } from 'react'
import type { ArchImage } from '../../data/types'
import { cn, ratioValue } from '../../lib/cn'
import { Figure } from '../ui/Figure'

/** CSS variable carrying the aspect ratio, used as flex-grow so paired images share a height. */
const ratioVar = (img: ArchImage) => ({ '--r': ratioValue(img.aspectRatio) }) as CSSProperties

type Row = { kind: 'wide' | 'single' | 'pair'; images: ArchImage[] }

/** Wide images take a full row; others pair up at equal height, or stand alone and offset. */
function composeRows(images: ArchImage[]): Row[] {
  const rows: Row[] = []
  for (let i = 0; i < images.length; i++) {
    const a = images[i]!
    const b = images[i + 1]
    if (ratioValue(a.aspectRatio) >= 1.7) rows.push({ kind: 'wide', images: [a] })
    else if (b && ratioValue(b.aspectRatio) < 1.7) {
      rows.push({ kind: 'pair', images: [a, b] })
      i++
    } else rows.push({ kind: 'single', images: [a] })
  }
  return rows
}

interface MediaRowsProps {
  images: ArchImage[]
  /** Maps an image to its position in the page-wide gallery. */
  indexOf: (image: ArchImage) => number
  onOpen: (index: number) => void
}

/**
 * Editorial image layout: rows keep each image's true proportion, so
 * drawings are never cropped, and alternate their alignment for rhythm.
 */
export function MediaRows({ images, indexOf, onOpen }: MediaRowsProps) {
  const rows = composeRows(images)
  return (
    <div className="space-y-8 md:space-y-14">
      {rows.map((row, r) => (
        <div
          key={row.images[0]!.src}
          className={cn(
            'flex flex-col gap-8 md:flex-row md:items-start md:gap-6',
            row.kind === 'single' && (r % 2 ? 'md:ml-[33%]' : 'md:mr-[33%]'),
            row.kind === 'pair' && r % 2 === 1 && 'md:pl-[8%]',
          )}
        >
          {row.images.map((img) => {
            const i = indexOf(img)
            return (
              <Figure
                key={img.src}
                image={img}
                index={i}
                onOpen={() => onOpen(i)}
                showCaption
                className="min-w-0 md:[flex:var(--r)_1_0%]"
                sizes={row.kind === 'wide' ? '(min-width: 768px) 75vw, 100vw' : '(min-width: 768px) 40vw, 100vw'}
                style={ratioVar(img)}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
