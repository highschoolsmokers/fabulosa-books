import { STORE_TIME_ZONE } from './store'
import type { Day } from './types'

// #region dates
// Dates are plain YYYY-MM-DD strings. Arithmetic happens in UTC so the
// server's own time zone never shifts a date by a day.

// Today's date at the store, not on the server.
export function storeToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: STORE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

function toUTC(date: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

function fromUTC(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function addDays(date: string, days: number): string {
  const d = toUTC(date)
  d.setUTCDate(d.getUTCDate() + days)
  return fromUTC(d)
}

export function dayOfWeek(date: string): Day {
  return toUTC(date).getUTCDay() as Day
}

// The Sunday on or before `date`.
export function weekStartFor(date: string): string {
  return addDays(date, -dayOfWeek(date))
}

export function isWeekStart(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && dayOfWeek(date) === 0
}
// #endregion dates
