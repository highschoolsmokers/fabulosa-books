import type { Employee, Schedule, TimeOff, Unavailability } from '../types'

// #region repository
// The agent's tools talk to this interface, never to Postgres directly.
// Tests and evals use the in-memory version; the app uses Neon.
export interface Repository {
  listStaff(): Promise<Employee[]>
  listUnavailability(): Promise<Unavailability[]>
  listTimeOff(from: string, to: string): Promise<TimeOff[]>
  getSchedule(weekStart: string): Promise<Schedule | null>
  listSchedulesBefore(weekStart: string, count: number): Promise<Schedule[]>
  saveSchedule(schedule: Schedule): Promise<void>
}
// #endregion repository

export function createMemoryRepository(seed: {
  staff: Employee[]
  unavailability?: Unavailability[]
  timeOff?: TimeOff[]
  schedules?: Schedule[]
}): Repository & { saved: Schedule[] } {
  const schedules = new Map((seed.schedules ?? []).map((s) => [s.weekStart, s]))
  const saved: Schedule[] = []
  return {
    saved,
    async listStaff() {
      return seed.staff
    },
    async listUnavailability() {
      return seed.unavailability ?? []
    },
    async listTimeOff(from, to) {
      return (seed.timeOff ?? []).filter((t) => t.date >= from && t.date <= to)
    },
    async getSchedule(weekStart) {
      return schedules.get(weekStart) ?? null
    },
    async listSchedulesBefore(weekStart, count) {
      return [...schedules.values()]
        .filter((s) => s.weekStart < weekStart)
        .sort((a, b) => b.weekStart.localeCompare(a.weekStart))
        .slice(0, count)
    },
    async saveSchedule(schedule) {
      schedules.set(schedule.weekStart, schedule)
      saved.push(schedule)
    },
  }
}
