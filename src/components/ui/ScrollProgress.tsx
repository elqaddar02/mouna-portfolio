import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'

/** Thin orange line along the top edge that tracks how far the page has been read. */
export function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  if (reduce) return null
  return <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[45] h-[3px] origin-left bg-orange" style={{ scaleX }} />
}
