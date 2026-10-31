import { useEffect, useRef, useState } from 'react'

/** Copies text to the clipboard; `copied` stays true for two seconds after a success. */
export function useCopy() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = async (text: string | null) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — the link itself still works */
    }
  }
  return { copied, copy }
}
