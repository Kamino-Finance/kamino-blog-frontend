import { useState } from 'react'
import clsx from 'clsx'
import { tokenize, type TokenKind } from '../../../lib/highlight'
import { CopyIcon, CheckIcon } from '../../../design/icons'
import type { CodeBlock as CodeBlockType } from '../../../content/types'

const KIND_CLASS: Record<TokenKind, string> = {
  plain: 'text-foreground/90',
  comment: 'text-muted-foreground italic',
  string: 'text-success',
  number: 'text-warning',
  keyword: 'text-secondary',
}

const LANG_LABEL: Record<CodeBlockType['language'], string> = {
  ts: 'TypeScript',
  tsx: 'TSX',
  bash: 'Shell',
  json: 'JSON',
  rust: 'Rust',
  text: 'Text',
}

/**
 * Code block — a filename/language tab, a copy button, and lightweight
 * token colouring. Sits on the canvas surface with a hairline border so it
 * reads as a distinct panel in the prose flow.
 */
export function CodeBlock({ block }: { block: CodeBlockType }) {
  const [copied, setCopied] = useState(false)
  const tokens = tokenize(block.code)

  async function copy() {
    try {
      await navigator.clipboard.writeText(block.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <figure className="overflow-hidden rounded-[14px] border-[0.5px] border-border bg-canvas">
      <div className="flex items-center justify-between border-b border-border px-[16px] py-[9px]">
        <span className="font-mono text-[12px] text-muted-foreground">
          {block.filename ?? LANG_LABEL[block.language]}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-[6px] rounded-[7px] px-[8px] py-[4px] text-[12px] font-medium text-muted-foreground transition-hover-colors hover:bg-background hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? <CheckIcon size={14} strokeWidth={2.2} className="text-success" /> : <CopyIcon size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-[16px] text-[13px] leading-[1.65]">
        <code className="font-mono">
          {tokens.map((t, i) => (
            <span key={i} className={clsx(KIND_CLASS[t.kind])}>
              {t.value}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  )
}
