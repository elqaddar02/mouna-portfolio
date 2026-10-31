import { Maximize2 } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'
import type { ArchImage } from '../../data/types'
import { fmt, useI18n } from '../../i18n/useI18n'
import { cn } from '../../lib/cn'

interface FigureProps {
  image: ArchImage
  className?: string
  imgClassName?: string
  /** CSS aspect-ratio for the frame; defaults to the image's own ratio. */
  aspect?: string
  /** Load immediately with high priority (above-the-fold images only). */
  priority?: boolean
  sizes?: string
  showCaption?: boolean
  /** When provided, the image becomes a button that opens the gallery. */
  onOpen?: () => void
  /** Index used in the "open image n" label. */
  index?: number
  reveal?: boolean
}

/**
 * Architectural image with intrinsic dimensions (no layout shift), lazy
 * loading, a clip-path reveal and an optional gallery trigger.
 */
export function Figure({
  image,
  className,
  imgClassName,
  aspect,
  priority = false,
  sizes = '(min-width: 768px) 60vw, 100vw',
  showCaption = false,
  onOpen,
  index,
  reveal = true,
}: FigureProps) {
  const { l, t } = useI18n()
  const reduce = useReducedMotion()
  const animate = reveal && !reduce && !priority
  const frameStyle: CSSProperties = { aspectRatio: aspect ?? image.aspectRatio.replace(':', ' / ') }

  const img = (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      alt={l(image.alt)}
      width={image.width}
      height={image.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn('size-full object-cover', imgClassName)}
    />
  )

  const inner = animate ? (
    <motion.div
      className="size-full"
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {img}
    </motion.div>
  ) : (
    img
  )

  return (
    <figure className={cn('group/fig', className)}>
      <div className="relative overflow-hidden bg-paper-2" style={frameStyle}>
        {onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            className="block size-full cursor-zoom-in focus-visible:outline-offset-[-3px]"
            aria-label={`${fmt(t.common.openImage, { n: (index ?? 0) + 1 })} — ${l(image.alt)}`}
          >
            {inner}
            <span
              aria-hidden="true"
              className="absolute right-3 top-3 grid size-9 place-items-center bg-ink text-paper opacity-0 transition-opacity duration-200 group-hover/fig:opacity-100 group-focus-within/fig:opacity-100"
            >
              <Maximize2 className="size-4" strokeWidth={2} />
            </span>
          </button>
        ) : (
          inner
        )}
      </div>
      {showCaption && image.caption && (
        <figcaption className="text-label mt-3 flex gap-3 text-[0.68rem] text-concrete-ink">
          {index !== undefined && <span className="text-ink">{String(index + 1).padStart(2, '0')}</span>}
          <span>{l(image.caption)}</span>
        </figcaption>
      )}
    </figure>
  )
}
