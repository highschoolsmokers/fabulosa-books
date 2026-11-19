import { describe, expect, it } from 'vitest'
import { validateSchedule } from '@/lib/rules'
import { ctx, validSchedule, WEEK, withAssignment } from './fixtures'

const rules = (schedule = validSchedule(), context = ctx) =>
  validateSchedule(schedule, context).map((v) => v.rule)

describe('validateSchedule', () => {
  it('accepts the fixture week', () => {
    expect(validateSchedule(validSchedule(), ctx)).toEqual([])
  })

  it('flags an empty slot', () => {
    const s = validSchedule()
    s.assignments = s.assignments.filter((a) => !(a.day === 3 && a.shift === 'mid'))
    const [v] = validateSchedule(s, ctx)
    expect(v).toMatchObject({ rule: 'unfilled', day: 3, shift: 'mid' })
    expect(v.message).toBe('Wednesday mid has no one assigned.')
  })

  it('flags two people on one slot', () => {
    const s = validSchedule()
    s.assignments.push({ day: 3, shift: 'mid', employeeId: 'kenji' })
    expect(rules(s)).toContain('double-filled')
  })

  it('flags an id that is not on staff', () => {
    expect(rules(withAssignment(validSchedule(), 3, 'mid', 'alvin'))).toEqual(['unknown-employee'])
  })

  it('flags two shifts on one day', () => {
    // Desmond already has Wednesday mid.
    expect(rules(withAssignment(validSchedule(), 3, 'closing', 'desmond'))).toContain('double-booked')
  })

// #region rules-tests
  it('flags a whole-day unavailability', () => {
    // Theo doesn't work Sundays.
    expect(rules(withAssignment(validSchedule(), 0, 'closing', 'theo'))).toContain('unavailable')
  })

  it('respects shift-specific unavailability', () => {
    // June can open on Tuesday but can't close.
    expect(rules(withAssignment(validSchedule(), 2, 'closing', 'june'))).toContain('unavailable')
    expect(rules()).not.toContain('unavailable')
  })
// #endregion rules-tests

  it('flags a time-off request on the right date', () => {
    const timeOff = [{ employeeId: 'priya', date: '2026-11-25' }] // Wednesday
    expect(rules(validSchedule(), { ...ctx, timeOff })).toEqual(['time-off'])
  })

  it('flags a non-key-holder on opening or closing', () => {
    expect(rules(withAssignment(validSchedule(), 0, 'opening', 'kenji'))).toContain('needs-key-holder')
  })

  it('flags anyone over their weekly limit', () => {
    // Mara is on-call with a limit of 2.
    let s = validSchedule()
    s = withAssignment(s, 1, 'mid', 'mara')
    s = withAssignment(s, 3, 'mid', 'mara')
    const over = validateSchedule(s, ctx).filter((v) => v.rule === 'over-max')
    expect(over).toEqual([
      { rule: 'over-max', employeeId: 'mara', message: 'Mara Lindqvist has 3 shifts; the limit is 2.' },
    ])
  })

  it('reports every problem, not just the first', () => {
    const s = { weekStart: WEEK, assignments: [] }
    expect(validateSchedule(s, ctx)).toHaveLength(21)
  })
})
