import { addDays } from './dates'
import { DAY_NAMES, DAYS, needsKeyHolder, SHIFT_TYPES } from './store'
import type { Day, Employee, Schedule, ShiftType, TimeOff, Unavailability } from './types'

// #region violation
export type Rule =
  | 'unfilled'
  | 'double-filled'
  | 'unknown-employee'
  | 'double-booked'
  | 'unavailable'
  | 'time-off'
  | 'over-max'
  | 'needs-key-holder'

export interface Violation {
  rule: Rule
  message: string
  day?: Day
  shift?: ShiftType
  employeeId?: string
}

export interface RuleContext {
  staff: Employee[]
  unavailability: Unavailability[]
  timeOff: TimeOff[]
}
// #endregion violation

// #region validate
// Every hard rule lives here, in code. The agent never decides whether a
// schedule is legal; it proposes one and reads back the violations.
export function validateSchedule(schedule: Schedule, ctx: RuleContext): Violation[] {
  const violations: Violation[] = []
  const staffById = new Map(ctx.staff.map((e) => [e.id, e]))

  // Coverage: each of the 21 slots has exactly one person.
  for (const day of DAYS) {
    for (const shift of SHIFT_TYPES) {
      const filled = schedule.assignments.filter((a) => a.day === day && a.shift === shift)
      const label = `${DAY_NAMES[day]} ${shift}`
      if (filled.length === 0) {
        violations.push({ rule: 'unfilled', day, shift, message: `${label} has no one assigned.` })
      } else if (filled.length > 1) {
        violations.push({
          rule: 'double-filled',
          day,
          shift,
          message: `${label} has ${filled.length} people assigned; it needs exactly one.`,
        })
      }
    }
  }

  const shiftsPerEmployee = new Map<string, number>()
  const seenPerDay = new Set<string>()

  for (const a of schedule.assignments) {
    const label = `${DAY_NAMES[a.day]} ${a.shift}`
    const employee = staffById.get(a.employeeId)
    if (!employee) {
      violations.push({
        rule: 'unknown-employee',
        ...a,
        message: `${label}: no employee has the id "${a.employeeId}".`,
      })
      continue
    }

    const dayKey = `${a.employeeId}:${a.day}`
    if (seenPerDay.has(dayKey)) {
      violations.push({
        rule: 'double-booked',
        ...a,
        message: `${employee.name} has more than one shift on ${DAY_NAMES[a.day]}.`,
      })
    }
    seenPerDay.add(dayKey)

    const blocked = ctx.unavailability.some(
      (u) =>
        u.employeeId === a.employeeId &&
        u.day === a.day &&
        (!u.shifts || u.shifts.includes(a.shift)),
    )
    if (blocked) {
      violations.push({
        rule: 'unavailable',
        ...a,
        message: `${employee.name} is not available for ${label}.`,
      })
    }

    const date = addDays(schedule.weekStart, a.day)
    if (ctx.timeOff.some((t) => t.employeeId === a.employeeId && t.date === date)) {
      violations.push({
        rule: 'time-off',
        ...a,
        message: `${employee.name} has the day off on ${date}.`,
      })
    }

    if (needsKeyHolder(a.shift) && !employee.keyHolder) {
      violations.push({
        rule: 'needs-key-holder',
        ...a,
        message: `${label} needs a key holder; ${employee.name} is not one.`,
      })
    }

    shiftsPerEmployee.set(a.employeeId, (shiftsPerEmployee.get(a.employeeId) ?? 0) + 1)
  }

  for (const [employeeId, count] of shiftsPerEmployee) {
    const employee = staffById.get(employeeId)
    if (employee && count > employee.maxShiftsPerWeek) {
      violations.push({
        rule: 'over-max',
        employeeId,
        message: `${employee.name} has ${count} shifts; the limit is ${employee.maxShiftsPerWeek}.`,
      })
    }
  }

  return violations
}
// #endregion validate
