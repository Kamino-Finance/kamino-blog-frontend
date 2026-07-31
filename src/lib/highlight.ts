/**
 * Minimal, dependency-free syntax tokenizer for the few languages the blog
 * shows (ts/tsx/json/bash/rust). Deliberately lightweight — it colours
 * comments, strings, numbers, and a small keyword set, which is enough to make
 * a snippet read as code without shipping a full highlighter. Token kinds map
 * to design-system colours in `CodeBlock`, so no raw hex enters the app.
 *
 * It assumes the well-formed snippets we author; it is not a full lexer (e.g. an
 * unquoted `//` in a URL would read as a comment). Fine for curated content.
 */
export type TokenKind = 'plain' | 'comment' | 'string' | 'number' | 'keyword'
export interface Token {
  value: string
  kind: TokenKind
}

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'await', 'async', 'import', 'from', 'export',
  'default', 'new', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'type', 'interface',
  'true', 'false', 'null', 'undefined', 'void', 'class', 'extends', 'implements', 'public', 'private',
  'protected', 'readonly', 'fn', 'let', 'mut', 'pub', 'struct', 'impl', 'use', 'match', 'Some', 'None',
])

const MASTER =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(\b\d[\d_.]*\b)|([A-Za-z_$][\w$]*)/g

export function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let last = 0
  let m: RegExpExecArray | null
  MASTER.lastIndex = 0
  while ((m = MASTER.exec(code)) !== null) {
    if (m.index > last) tokens.push({ value: code.slice(last, m.index), kind: 'plain' })
    if (m[1] !== undefined) tokens.push({ value: m[1], kind: 'comment' })
    else if (m[2] !== undefined) tokens.push({ value: m[2], kind: 'string' })
    else if (m[3] !== undefined) tokens.push({ value: m[3], kind: 'number' })
    else if (m[4] !== undefined) tokens.push({ value: m[4], kind: KEYWORDS.has(m[4]) ? 'keyword' : 'plain' })
    last = m.index + m[0].length
  }
  if (last < code.length) tokens.push({ value: code.slice(last), kind: 'plain' })
  return tokens
}
