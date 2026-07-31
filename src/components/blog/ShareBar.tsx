import { useState } from 'react'
import clsx from 'clsx'
import { SocialGlyph } from '../../design/BrandMarks'
import { LinkIcon, CheckIcon } from '../../design/icons'

/**
 * Share row — copy link (with inline confirmation) plus X and LinkedIn intents.
 * Uses the live page URL, so it works wherever the post is mounted.
 */
export function ShareBar({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  const xHref = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const liHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  return (
    <div className={clsx('flex items-center gap-[8px]', className)}>
      <span className="mr-[2px] text-[13px] font-medium text-muted-foreground">Share</span>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className="inline-flex h-[34px] items-center gap-[6px] rounded-full border-[0.5px] border-border px-[12px] text-[13px] font-medium text-muted-foreground transition-[color,background-color,border-color] duration-150 hover:border-foreground/20 hover:text-foreground"
      >
        {copied ? <CheckIcon size={15} strokeWidth={2.2} className="text-success" /> : <LinkIcon size={15} />}
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <ShareIconLink href={xHref} label="Share on X">
        <SocialGlyph name="x" size={14} />
      </ShareIconLink>
      <ShareIconLink href={liHref} label="Share on LinkedIn">
        <SocialGlyph name="linkedin" size={15} />
      </ShareIconLink>
    </div>
  )
}

function ShareIconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border-[0.5px] border-border text-muted-foreground transition-[color,background-color,border-color] duration-150 hover:border-foreground/20 hover:text-foreground"
    >
      {children}
    </a>
  )
}
