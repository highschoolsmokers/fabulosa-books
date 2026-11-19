import { neon } from '@neondatabase/serverless'
import type { Day, Employee, Schedule, ShiftType, TimeOff, Unavailability } from '../types'
import type { Repository } from './repository'

interface EmployeeRow {
  id: string
  name: string
  kind: Employee['kind']
  key_holder: boolean
  max_shifts_per_week: number
}

interface AssignmentRow {
  week_start: string
  day: number
  shift: ShiftType
  employee_id: string
}

function groupByWeek(rows: AssignmentRow[]): Schedule[] {
  const weeks = new Map<string, Schedule>()
  for (const r of rows) {
    const week = weeks.get(r.week_start) ?? { weekStart: r.week_start, assignments: [] }
    week.assignments.push({ day: r.day as Day, shift: r.shift, employeeId: r.employee_id })
    weeks.set(r.week_start, week)
  }
  return [...weeks.values()]
}

// #region neon
export function createNeonRepository(databaseUrl = process.env.DATABASE_URL): Repository {
  if (!databaseUrl) throw new Error('DATABASE_URL is not set. Run `vercel env pull`.')
  const sql = neon(databaseUrl)

  return {
    async listStaff() {
      const rows = (await sql`
        SELECT id, name, kind, key_holder, max_shifts_per_week
        FROM employees ORDER BY name`) as EmployeeRow[]
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        kind: r.kind,
        keyHolder: r.key_holder,
        maxShiftsPerWeek: r.max_shifts_per_week,
      }))
    },

    async listUnavailability() {
      const rows = (await sql`
        SELECT employee_id, day, shifts FROM unavailability`) as {
        employee_id: string
        day: number
        shifts: ShiftType[] | null
      }[]
      return rows.map(
        (r): Unavailability => ({
          employeeId: r.employee_id,
          day: r.day as Day,
          ...(r.shifts ? { shifts: r.shifts } : {}),
        }),
      )
    },

    async listTimeOff(from, to) {
      // Cast DATE to text so the driver never turns it into a JS Date.
      const rows = (await sql`
        SELECT employee_id, date::text AS date, reason FROM time_off
        WHERE date BETWEEN ${from} AND ${to}`) as {
        employee_id: string
        date: string
        reason: string | null
      }[]
      return rows.map(
        (r): TimeOff => ({
          employeeId: r.employee_id,
          date: r.date,
          ...(r.reason ? { reason: r.reason } : {}),
        }),
      )
    },

    async getSchedule(weekStart) {
      const rows = (await sql`
        SELECT week_start::text AS week_start, day, shift, employee_id
        FROM assignments WHERE week_start = ${weekStart}`) as AssignmentRow[]
      return groupByWeek(rows)[0] ?? null
    },

    async listSchedulesBefore(weekStart, count) {
      const rows = (await sql`
        SELECT week_start::text AS week_start, day, shift, employee_id
        FROM assignments
        WHERE week_start < ${weekStart}
          AND week_start >= ${weekStart}::date - ${count * 7}::int`) as AssignmentRow[]
      return groupByWeek(rows).sort((a, b) => b.weekStart.localeCompare(a.weekStart))
    },

    // Replace the whole week in one transaction, so a failed save never
    // leaves half a schedule behind.
    async saveSchedule(schedule) {
      await sql.transaction([
        sql`DELETE FROM assignments WHERE week_start = ${schedule.weekStart}`,
        ...schedule.assignments.map(
          (a) => sql`
            INSERT INTO assignments (week_start, day, shift, employee_id)
            VALUES (${schedule.weekStart}, ${a.day}, ${a.shift}, ${a.employeeId})`,
        ),
      ])
    },
  }
}
// #endregion neon
