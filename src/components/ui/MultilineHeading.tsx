import { Fragment } from 'react'

/** Renders "\n" in translated headings as deliberate editorial line breaks. */
export function Lines({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          <span className="block">{line}</span>
        </Fragment>
      ))}
    </>
  )
}
