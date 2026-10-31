import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ArchImage } from '../../data/types'
import { fmt, useI18n } from '../../i18n/useI18n'

interface LightboxProps {
  images: ArchImage[]
  /** Index of the open image, or null when closed. */
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Optional prefix per image for captions (e.g. a concept number). */
  captionPrefix?: (image: ArchImage) => string | undefined
}

const SWIPE = 70

export function Lightbox({ images, index, onIndexChange, onClose, captionPrefix }: LightboxProps) {
  return createPortal(
    <AnimatePresence>
      {index !== null && images[index] && (
        <LightboxDialog
          images={images}
          index={index}
          onIndexChange={onIndexChange}
          onClose={onClose}
          captionPrefix={captionPrefix}
        />
      )}
    </AnimatePresence>,
    document.body,
  )
}

function LightboxDialog({ images, index, onIndexChange, onClose, captionPrefix }: LightboxProps & { index: number }) {
  const { t, l } = useI18n()
  const reduce = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [direction, setDirection] = useState(0)
  const image = images[index]!
  const count = images.length

  const go = useCallback(
    (delta: number) => {
      setDirection(delta)
      onIndexChange((index + delta + count) % count)
    },
    [index, count, onIndexChange],
  )

  // Scroll lock, focus management and keyboard controls.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab' && dialogRef.current) {
        // Only visible buttons — the mobile and desktop controls are swapped with CSS.
        const items = [...dialogRef.current.querySelectorAll<HTMLElement>('button')].filter((el) => el.offsetParent !== null)
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onClose])

  // Preload neighbours for instant navigation.
  useEffect(() => {
    for (const d of [1, -1]) {
      const next = images[(index + d + count) % count]
      if (next) new Image().src = next.src
    }
  }, [index, images, count])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE) go(1)
    else if (info.offset.x > SWIPE) go(-1)
  }

  const prefix = captionPrefix?.(image)
  const caption = image.caption ? l(image.caption) : l(image.alt)
  const btn =
    'grid size-11 shrink-0 place-items-center border-2 border-paper text-paper transition-colors hover:bg-orange hover:border-orange hover:text-ink'

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.gallery.label}
      className="fixed inset-0 z-[70] flex flex-col bg-ink text-paper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="frame flex h-16 shrink-0 items-center justify-between border-b border-paper/20">
        <p className="text-label text-[0.72rem]" aria-live="polite">
          {fmt(t.gallery.counter, { i: String(index + 1).padStart(2, '0'), n: String(count).padStart(2, '0') })}
        </p>
        <button type="button" onClick={onClose} className={btn} aria-label={t.gallery.close} data-autofocus>
          <X className="size-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-6 md:px-24">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.img
            key={image.src}
            src={image.src}
            alt={l(image.alt)}
            width={image.width}
            height={image.height}
            className="max-h-full max-w-full touch-pan-y select-none object-contain"
            draggable={false}
            drag={count > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={onDragEnd}
            custom={direction}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -80 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>

        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className={`${btn} absolute left-4 top-1/2 hidden -translate-y-1/2 md:grid`} aria-label={t.gallery.previous}>
              <ArrowLeft className="size-5" />
            </button>
            <button type="button" onClick={() => go(1)} className={`${btn} absolute right-4 top-1/2 hidden -translate-y-1/2 md:grid`} aria-label={t.gallery.next}>
              <ArrowRight className="size-5" />
            </button>
          </>
        )}
      </div>

      <div className="frame flex shrink-0 items-center justify-between gap-4 border-t border-paper/20 py-4">
        <p className="min-w-0 text-sm text-paper/90">
          {prefix && <span className="text-label mr-3 text-orange">{prefix}</span>}
          {caption}
        </p>
        {count > 1 && (
          <div className="flex gap-2 md:hidden">
            <button type="button" onClick={() => go(-1)} className={btn} aria-label={t.gallery.previous}>
              <ArrowLeft className="size-5" />
            </button>
            <button type="button" onClick={() => go(1)} className={btn} aria-label={t.gallery.next}>
              <ArrowRight className="size-5" />
            </button>
          </div>
        )}
        <p className="text-label hidden shrink-0 text-[0.65rem] text-paper/50 md:block">{t.gallery.hint}</p>
      </div>
    </motion.div>
  )
}
