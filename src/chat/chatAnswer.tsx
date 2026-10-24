/* Rendering for the chat assistant's answers.
   The model tends to write `**Book now** (/book-now)` or a bare `/about`.
   Neither is useful on screen, so any page path becomes a real button that
   navigates there, and the surrounding prose keeps its emphasis. */

import type { ReactNode } from "react"
import { SITE_PAGES } from "./chatbotEngine"

/** Turn a page path into a friendly button label. */
function linkLabel(page: { path: string; label: string }): string {
  if (page.path === '/') return 'Home'
  if (page.path === '/book-now') return 'Book a Session'
  if (page.path === '/contact') return 'Contact'
  if (page.path === '/career') return 'Explore Careers'
  if (page.path === '/events') return 'View Events'
  if (page.path === '/insights') return 'Read Insights'
  return `Go to ${page.label}`
}

/** Resolve a raw token (with or without a leading slash) to a page. */
function pageFor(raw: string) {
  const slug = raw.replace(/^\//, '')
  if (!slug) return undefined
  return SITE_PAGES.find((p) => p.path === `/${slug}`)
}

/**
 * Render an assistant answer.
 *
 * A path may appear as `/about`, `(/about)`, `[Contact](/contact)` or
 * `[Contact](Contact)`. In every case the whole run collapses to one button,
 * so no label or bracket is left dangling in the prose.
 */
export function renderAnswer(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const re = /\[([^\]]*)\]\(([^)]*)\)|\(([^)]*)\)|\/([a-z0-9-]+)/g
  let last = 0
  let m: RegExpExecArray | null
  let k = 0

  while ((m = re.exec(text)) !== null) {
    // Groups: 1 link label, 2 link target, 3 parenthesised, 4 bare path.
    const page = pageFor(m[2] ?? '') ?? pageFor(m[3] ?? '') ?? pageFor(m[4] ?? '')
    if (!page) continue

    // The model often writes "the About page (/about)" — the label duplicates
    // the button, so drop a trailing "<Label> page" and any preposition left
    // hanging in front of it.
    const escaped = page.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const before = text
      .slice(last, m.index)
      .replace(new RegExp(`(^|\\s)(?:the\\s+)?${escaped}\\s+page\\s*$`, 'i'), '$1')
      .replace(/[,\s]*(?:on|in|at|via|through|using|from|see|visit|read|go to|find|learn more)\s*$/i, '')
    if (before.trim()) {
      // Keep a separating space so the prose does not run into the button.
      const prose = stripListMarkers(before)
      nodes.push(...renderEmphasis(prose.endsWith(' ') ? prose : `${prose} `, k))
      k += 100
    }
    nodes.push(
      <a key={k++} className="chat-link" href={page.path}>
        {linkLabel(page)}
      </a>,
    )
    last = m.index + m[0].length
  }

  if (last < text.length) {
    nodes.push(...renderEmphasis(text.slice(last), k))
  }
  return nodes
}

/** Split a run of prose into bold/italic/plain spans. */
function renderEmphasis(text: string, seed: number): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g
  let last = 0
  let m: RegExpExecArray | null
  let k = seed
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('**')) out.push(<strong key={k++}>{tok.slice(2, -2)}</strong>)
    else out.push(<em key={k++}>{tok.slice(1, -1)}</em>)
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/** Strip markdown list bullets the model leaves behind. */
function stripListMarkers(text: string): string {
  return text
    .replace(/^\s*[-*+]\s*/, '')
    .replace(/\s*[-*+]\s*$/, '')
    .replace(/\s{2,}/g, ' ')
}
