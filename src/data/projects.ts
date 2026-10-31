/**
 * PROJECT ARCHIVE — Mouna's academic projects.
 *
 * Content is edited in /content/projects/*.json, through the editor at /admin
 * or by hand, and compiled by scripts/content.mjs. No component needs to change
 * to add, edit or remove a project.
 */
import content from './generated/content.json'
import type { Project } from './types'

export const projects = content.projects as unknown as Project[]

export const sortedProjects = [...projects].sort((a, b) => a.order - b.order)
export const featuredProjects = sortedProjects.filter((p) => p.featured)
export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
