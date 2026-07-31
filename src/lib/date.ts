/**
 * Date formatting. Posts store an ISO `YYYY-MM-DD`; we render a warm, editorial
 * long form ("May 28, 2026") and a compact form for dense meta rows.
 *
 * Parsing note: we construct the Date from parts (not `new Date(iso)`) so the
 * value is interpreted in local time and never shifts a day across timezones.
 */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function parts(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m, d }
}

/** "May 28, 2026" */
export function formatDate(iso: string): string {
  const { y, m, d } = parts(iso)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

/** "May 28" — no year, for tight rows where the year is redundant. */
export function formatDateShort(iso: string): string {
  const { m, d } = parts(iso)
  return `${MONTHS[m - 1].slice(0, 3)} ${d}`
}

/** ISO 8601 for `<time dateTime>` + machine-readable feeds. */
export function isoDateTime(iso: string): string {
  return `${iso}T09:00:00.000Z`
}
