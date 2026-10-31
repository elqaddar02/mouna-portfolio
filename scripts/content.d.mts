/** Types for scripts/content.mjs, as used by vite.config.ts (the app imports the generated JSON instead). */
export const CONTENT_DIR: string
export const OUTPUT_FILE: string
export function writeContent(root?: string): { projects: { slug: string }[] }
