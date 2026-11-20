import type { RuleContext } from '@/lib/rules'
import { STAFF, UNAVAILABILITY } from '@/lib/seed'
import type { Assignment, Day, Schedule, ShiftType } from '@/lib/types'

// The week of Sunday 2026-11-22. A legal schedule under the seed staff.
export const WEEK = '2026-11-22'

const grid: Record<Day, [string, string, string]> = {
  //  opening  mid        closing
  0: ['alvin', 'johnny', 'dylan'],
  1: ['marcus', 'johnny', 'alvin'],
  2: ['dylan', 'violet', 'marcus'],
  3: ['joel', 'violet', 'dylan'],
  4: ['alvin', 'violet', 'marcus'],
  5: ['dylan', 'melissa', 'joel'],
  6: ['alvin', 'violet', 'billy'],
}

const SHIFTS: ShiftType[] = ['opening', 'mid', 'closing']

export function validSchedule(): Schedule {
  const assignments: Assignment[] = []
  for (const [day, ids] of Object.entries(grid)) {
    ids.forEach((employeeId, i) => {
      assignments.push({ day: Number(day) as Day, shift: SHIFTS[i], employeeId })
    })
  }
  return { weekStart: WEEK, assignments }
}

export function withAssignment(schedule: Schedule, day: Day, shift: ShiftType, employeeId: string): Schedule {
  return {
    ...schedule,
    assignments: schedule.assignments.map((a) =>
      a.day === day && a.shift === shift ? { ...a, employeeId } : a,
    ),
  }
}

export const ctx: RuleContext = { staff: STAFF, unavailability: UNAVAILABILITY, timeOff: [] }
