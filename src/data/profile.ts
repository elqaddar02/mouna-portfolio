/**
 * PROFILE — personal information shown on Home, About and Contact.
 *
 * Content is edited in /content/profile.json (or at /admin). Empty contact
 * fields become null, and the UI then shows "to be added" instead of a link.
 */
import content from './generated/content.json'
import type { Profile } from './types'

export const profile = content.profile as unknown as Profile
