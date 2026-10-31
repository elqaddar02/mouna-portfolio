import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

interface SplitRevealProps {
  /** Text with "\n" for deliberate line breaks. */
  text: string
  as?: 'h1' | 'h2' | 'p'
  id?: string
  className?: string
  /** Animate when scrolled into view (default) or as soon as it mounts. */
  trigger?: 'inView' | 'mount'
  delay?: number
  /** Appended to the last line, e.g. an orange full stop. */
  suffix?: ReactNode
}

/**
 * Headline whose lines rise from behind a mask, one after another.
 * Screen readers get the plain text; reduced-motion users get static text.
 */
export function SplitReveal({ text, as: Tag = 'h2', id, className, trigger = 'inView', delay = 0, suffix }: SplitRevealProps) {
  const reduce = useReducedMotion()
  const lines = text.split('\n')

  if (reduce)
    return (
      <Tag id={id} className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
            {i === lines.length - 1 && suffix}
          </span>
        ))}
      </Tag>
    )

  const play = trigger === 'inView'
    ? { whileInView: 'show', viewport: { once: true, margin: '0px 0px -12% 0px' } }
    : { animate: 'show' }

  return (
    <Tag id={id} className={className} aria-label={text.replace(/\n/g, ' ')}>
      <motion.span
        className="block"
        aria-hidden="true"
        initial="hidden"
        {...play}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: delay } } }}
      >
        {lines.map((line, i) => (
          <span key={i} className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block"
              variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.95, ease: EASE } } }}
            >
              {line}
              {i === lines.length - 1 && suffix}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
