import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

/**
 * Renders the restricted inline markdown carried by content strings:
 *   **bold**, _italic_ / *italic*, `code`, and [label](href).
 *
 * Parses recursively, so marks nest correctly — a bold word inside a link
 * ([**label**](href)), italic inside bold (**_x_**), etc. The Sanity adapter
 * emits these same strings from portable-text spans (which can carry stacked
 * marks), so this renderer is the shared path. `code` is treated as literal and
 * not re-parsed. Internal paths use the router; external / mailto open in a new
 * tab.
 */
const RE = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_/

const LINK_CLASS =
  'font-medium text-secondary underline decoration-secondary/30 underline-offset-[3px] transition-[color,text-decoration-color] duration-150 hover:decoration-secondary'

function renderLink(children: ReactNode, href: string, key: string): ReactNode {
  const external = href.startsWith('http') || href.startsWith('mailto:')
  if (external) {
    return (
      <a key={key} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} className={LINK_CLASS}>
        {children}
      </a>
    )
  }
  return (
    <Link key={key} to={href} className={LINK_CLASS}>
      {children}
    </Link>
  )
}

function parse(text: string, prefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let rest = text
  let i = 0
  while (rest.length > 0) {
    const m = RE.exec(rest)
    if (!m) {
      nodes.push(<Fragment key={`${prefix}-${i}`}>{rest}</Fragment>)
      break
    }
    if (m.index > 0) nodes.push(<Fragment key={`${prefix}-${i}t`}>{rest.slice(0, m.index)}</Fragment>)
    const key = `${prefix}-${i}`
    if (m[1] !== undefined) nodes.push(renderLink(parse(m[1], `${key}l`), m[2], key))
    else if (m[3] !== undefined)
      nodes.push(
        <code key={key} className="rounded-[5px] bg-canvas px-[6px] py-[2px] font-mono text-[0.86em] text-foreground">
          {m[3]}
        </code>,
      )
    else if (m[4] !== undefined) nodes.push(<strong key={key} className="font-semibold text-foreground">{parse(m[4], `${key}b`)}</strong>)
    else if (m[5] !== undefined) nodes.push(<em key={key}>{parse(m[5], `${key}i`)}</em>)
    else if (m[6] !== undefined) nodes.push(<em key={key}>{parse(m[6], `${key}u`)}</em>)
    rest = rest.slice(m.index + m[0].length)
    i++
  }
  return nodes
}

export function InlineText({ text }: { text: string }): ReactNode {
  return <>{parse(text, 'it')}</>
}
