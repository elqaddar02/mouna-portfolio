import type { ArchImage, AspectRatio, ImageType, Localized } from './types'

/** Intrinsic sizes of the generated placeholder files (see scripts/generate-placeholders.mjs). */
const SIZES: Record<AspectRatio, [number, number]> = {
  '16:9': [1600, 900],
  '21:9': [1680, 720],
  '3:2': [1500, 1000],
  '4:3': [1600, 1200],
  '1:1': [1200, 1200],
  '4:5': [1200, 1500],
  '3:4': [1200, 1600],
  '2:3': [1100, 1650],
}

/**
 * Builds an image entry. When replacing a placeholder with a real file, pass
 * its real pixel `size` and set `placeholder: false` (or omit it).
 */
export function image(
  src: string,
  imageType: ImageType,
  aspectRatio: AspectRatio,
  alt: Localized,
  caption?: Localized,
  opts: { size?: [number, number]; placeholder?: boolean; srcSet?: string } = {},
): ArchImage {
  const [width, height] = opts.size ?? SIZES[aspectRatio]
  return {
    src,
    srcSet: opts.srcSet,
    imageType,
    aspectRatio,
    alt,
    caption,
    width,
    height,
    placeholder: opts.placeholder ?? true,
  }
}
