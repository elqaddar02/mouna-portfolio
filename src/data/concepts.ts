/**
 * PERSONAL CONCEPTS — self-initiated explorations, kept apart from the
 * academic archive so their origin is always clear.
 *
 * Content is edited in /content/concepts/*.json (or at /admin).
 */
import content from './generated/content.json'
import type { Concept } from './types'

export const concepts = content.concepts as unknown as Concept[]

export const sortedConcepts = [...concepts].sort((a, b) => a.order - b.order)
