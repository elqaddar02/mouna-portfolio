/** Joins truthy class names. */
export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

/** "16:9" → 16 / 9 */
export const ratioValue = (ratio: string) => {
  const [w, h] = ratio.split(':').map(Number)
  return (w ?? 1) / (h ?? 1)
}
