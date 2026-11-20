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
    s.assignments.push({ day: 3, shift: 'mid', employeeId: 'johnny' })
    expect(rules(s)).toContain('double-filled')
  })

  it('flags an id that is not on staff', () => {
    expect(rules(withAssignment(validSchedule(), 3, 'mid', 'nobody'))).toEqual(['unknown-employee'])
  })

  it('flags two shifts on one day', () => {
    // Violet already has Wednesday mid.
    expect(rules(withAssignment(validSchedule(), 3, 'closing', 'violet'))).toContain('double-booked')
  })

// #region rules-tests
  it('flags a whole-day unavailability', () => {
    // Marcus doesn't work Sundays.
    expect(rules(withAssignment(validSchedule(), 0, 'closing', 'marcus'))).toContain('unavailable')
  })

  it('respects shift-specific unavailability', () => {
    // Dylan can open on Tuesday but can't close.
    expect(rules(withAssignment(validSchedule(), 2, 'closing', 'dylan'))).toContain('unavailable')
    expect(rules()).not.toContain('unavailable')
  })
// #endregion rules-tests

  it('flags a time-off request on the right date', () => {
    const timeOff = [{ employeeId: 'joel', date: '2026-11-25' }] // Wednesday
    expect(rules(validSchedule(), { ...ctx, timeOff })).toEqual(['time-off'])
  })

  it('flags a non-key-holder on opening or closing', () => {
    expect(rules(withAssignment(validSchedule(), 0, 'opening', 'johnny'))).toContain('needs-key-holder')
  })

  it('flags anyone over their weekly limit', () => {
    // Melissa is on-call with a limit of 2.
    let s = validSchedule()
    s = withAssignment(s, 1, 'mid', 'melissa')
    s = withAssignment(s, 3, 'mid', 'melissa')
    const over = validateSchedule(s, ctx).filter((v) => v.rule === 'over-max')
    expect(over).toEqual([
      { rule: 'over-max', employeeId: 'melissa', message: 'Melissa has 3 shifts; the limit is 2.' },
    ])
  })

  it('reports every problem, not just the first', () => {
    const s = { weekStart: WEEK, assignments: [] }
    expect(validateSchedule(s, ctx)).toHaveLength(21)
  })
})
