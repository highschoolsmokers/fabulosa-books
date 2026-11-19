import type { Day, ShiftType } from './types'

export const STORE_TIME_ZONE = 'America/Los_Angeles'

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

export const DAYS: Day[] = [0, 1, 2, 3, 4, 5, 6]
export const SHIFT_TYPES: ShiftType[] = ['opening', 'mid', 'closing']

// #region shifts
// Store hours: 10–8 Sunday through Thursday, 10–9 Friday, 10–10 Saturday.
// Every shift is six hours. Closing ends when the store closes.
export interface ShiftTimes {
  start: number // hour, 24-hour clock
  end: number
}

export function shiftTimes(day: Day, shift: ShiftType): ShiftTimes {
  switch (shift) {
    case 'opening':
      return { start: 10, end: 16 }
    case 'mid':
      return { start: 12, end: 18 }
    case 'closing': {
      const close = day === 6 ? 22 : day === 5 ? 21 : 20
      return { start: close - 6, end: close }
    }
  }
}

// Opening and closing need someone with keys.
export function needsKeyHolder(shift: ShiftType): boolean {
  return shift !== 'mid'
}
// #endregion shifts

export function formatHour(hour: number): string {
  const suffix = hour >= 12 ? 'pm' : 'am'
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h}${suffix}`
}
