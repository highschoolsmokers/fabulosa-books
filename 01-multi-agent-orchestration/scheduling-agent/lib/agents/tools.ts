// #region tools-top
import { tool } from 'ai'
import { z } from 'zod'
import type { Repository } from '../db/repository'
import { addDays, isWeekStart } from '../dates'
import { type RuleContext, validateSchedule } from '../rules'
import { DAY_NAMES, formatHour, shiftTimes } from '../store'
import type { Schedule } from '../types'

const weekStart = z
  .string()
  .refine(isWeekStart, 'Must be a Sunday in YYYY-MM-DD format.')
  .describe('The Sunday that starts the week, YYYY-MM-DD.')

const assignment = z.object({
  day: z.number().int().min(0).max(6).describe('0 = Sunday … 6 = Saturday'),
  shift: z.enum(['opening', 'mid', 'closing']),
  employeeId: z.string().describe('An id from getStaff, such as "rosa".'),
})

export const scheduleInput = z.object({
  weekStart,
  assignments: z.array(assignment).describe('One entry per filled shift; 21 for a full week.'),
})

// Zod checks the range; this narrows `number` to the `Day` type.
export const toSchedule = (input: z.infer<typeof scheduleInput>) => input as Schedule

export async function ruleContext(repo: Repository, week: string): Promise<RuleContext> {
  const [staff, unavailability, timeOff] = await Promise.all([
    repo.listStaff(),
    repo.listUnavailability(),
    repo.listTimeOff(week, addDays(week, 6)),
  ])
  return { staff, unavailability, timeOff }
}
// #endregion tools-top

// #region read-tools
export function createReadTools(repo: Repository) {
  return {
    getStaff: tool({
      description:
        'List every employee with their id, whether they are regular or on-call, ' +
        'whether they hold keys, and their weekly shift limit.',
      inputSchema: z.object({}),
      execute: () => repo.listStaff(),
    }),

    getAvailability: tool({
      description:
        'Standing unavailability and time-off requests that affect one week. ' +
        'Call this before proposing a schedule.',
      inputSchema: z.object({ weekStart }),
      execute: async ({ weekStart }) => {
        const { unavailability, timeOff } = await ruleContext(repo, weekStart)
        return {
          standing: unavailability.map((u) => ({
            employeeId: u.employeeId,
            day: DAY_NAMES[u.day],
            shifts: u.shifts ?? 'all day',
          })),
          timeOff,
        }
      },
    }),

    getSchedule: tool({
      description: 'The saved schedule for a week, or null if none is saved.',
      inputSchema: z.object({ weekStart }),
      execute: async ({ weekStart }) => {
        const schedule = await repo.getSchedule(weekStart)
        if (!schedule) return null
        return {
          weekStart,
          assignments: schedule.assignments.map((a) => {
            const t = shiftTimes(a.day, a.shift)
            return { ...a, when: `${DAY_NAMES[a.day]} ${formatHour(t.start)}–${formatHour(t.end)}` }
          }),
        }
      },
    }),
  }
}
// #endregion read-tools

// #region write-tools
export function createWriteTools(repo: Repository) {
  return {
    // Dry run. Returns the violations so the agent can fix them and try again.
    proposeSchedule: tool({
      description:
        'Check a full week against the store rules without saving it. ' +
        'Returns every violation. Fix them and propose again until the list is empty.',
      inputSchema: scheduleInput,
      execute: async (input) => {
        const schedule = toSchedule(input)
        const violations = validateSchedule(schedule, await ruleContext(repo, schedule.weekStart))
        return { valid: violations.length === 0, violations }
      },
    }),

    // The only tool that writes. The agent config requires a person to approve
    // each call, and the tool validates again before it writes: the model's
    // earlier dry run proves nothing about the input it sends now.
    saveSchedule: tool({
      description:
        'Save a week that proposeSchedule has already accepted. ' +
        'The store manager must approve the save.',
      inputSchema: scheduleInput,
      execute: async (input) => {
        const schedule = toSchedule(input)
        const violations = validateSchedule(schedule, await ruleContext(repo, schedule.weekStart))
        if (violations.length > 0) {
          return { saved: false as const, violations }
        }
        await repo.saveSchedule(schedule)
        return { saved: true as const, weekStart: schedule.weekStart }
      },
    }),
  }
}
// #endregion write-tools
