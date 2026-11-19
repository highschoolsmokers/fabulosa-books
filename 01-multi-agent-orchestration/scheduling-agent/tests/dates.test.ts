import { describe, expect, it } from 'vitest'
import { addDays, dayOfWeek, isWeekStart, storeToday, weekStartFor } from '@/lib/dates'
import { shiftTimes } from '@/lib/store'

describe('dates', () => {
  it('uses the store date, not UTC', () => {
    // 11:30pm Saturday in San Francisco is already Sunday in UTC.
    const lateSaturday = new Date('2026-11-22T07:30:00Z')
    expect(storeToday(lateSaturday)).toBe('2026-11-21')
  })

  it('finds the Sunday that starts a week', () => {
    expect(weekStartFor('2026-11-25')).toBe('2026-11-22')
    expect(weekStartFor('2026-11-22')).toBe('2026-11-22')
  })

  it('crosses month and daylight-saving boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2026-03-07', 1)).toBe('2026-03-08')
    expect(dayOfWeek('2026-03-08')).toBe(0)
  })

  it('accepts only Sundays as week starts', () => {
    expect(isWeekStart('2026-11-22')).toBe(true)
    expect(isWeekStart('2026-11-23')).toBe(false)
    expect(isWeekStart('next week')).toBe(false)
  })
})

describe('shiftTimes', () => {
  it('ends closing at store close', () => {
    expect(shiftTimes(0, 'closing')).toEqual({ start: 14, end: 20 })
    expect(shiftTimes(5, 'closing')).toEqual({ start: 15, end: 21 })
    expect(shiftTimes(6, 'closing')).toEqual({ start: 16, end: 22 })
  })
})
