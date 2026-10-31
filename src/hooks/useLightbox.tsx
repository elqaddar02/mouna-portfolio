import { useCallback, useState } from 'react'
import { Lightbox } from '../components/gallery/Lightbox'
import type { ArchImage } from '../data/types'

/** Page-level gallery state: any image on the page can open the shared lightbox at its index. */
export function useLightbox(images: ArchImage[], captionPrefix?: (image: ArchImage) => string | undefined) {
  const [index, setIndex] = useState<number | null>(null)
  const open = useCallback((i: number) => setIndex(i), [])
  const indexOf = useCallback((img: ArchImage) => images.indexOf(img), [images])

  const lightbox = (
    <Lightbox
      images={images}
      index={index}
      onIndexChange={setIndex}
      onClose={() => setIndex(null)}
      captionPrefix={captionPrefix}
    />
  )
  return { open, indexOf, lightbox }
}
