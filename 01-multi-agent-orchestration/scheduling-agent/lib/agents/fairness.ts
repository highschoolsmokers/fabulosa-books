import { type LanguageModel, Output, ToolLoopAgent, tool } from 'ai'
import { z } from 'zod'
import type { Repository } from '../db/repository'
import type { Employee, Schedule } from '../types'
import { scheduleInput, toSchedule } from './tools'

// #region fairness-stats
// The counting happens in code. The model only judges what the counts mean.
export interface FairnessStats {
  employeeId: string
  name: string
  kind: Employee['kind']
  thisWeek: { shifts: number; closings: number; weekendShifts: number }
  lastFourWeeks: { shifts: number; closings: number; weekendShifts: number }
}

function tally(schedules: Schedule[], employeeId: string) {
  const mine = schedules.flatMap((s) => s.assignments).filter((a) => a.employeeId === employeeId)
  return {
    shifts: mine.length,
    closings: mine.filter((a) => a.shift === 'closing').length,
    weekendShifts: mine.filter((a) => a.day === 0 || a.day === 6).length,
  }
}

export function fairnessStats(
  proposed: Schedule,
  history: Schedule[],
  staff: Employee[],
): FairnessStats[] {
  return staff.map((e) => ({
    employeeId: e.id,
    name: e.name,
    kind: e.kind,
    thisWeek: tally([proposed], e.id),
    lastFourWeeks: tally(history, e.id),
  }))
}
// #endregion fairness-stats

// #region fairness-agent
export const fairnessReport = z.object({
  findings: z.array(
    z.object({
      severity: z.enum(['concern', 'note']),
      employeeId: z.string(),
      message: z.string().describe('One sentence, with the numbers that support it.'),
    }),
  ),
  summary: z.string().describe('Two sentences at most.'),
})

export function createFairnessAgent(model: LanguageModel) {
  return new ToolLoopAgent({
    id: 'fairness',
    model,
    instructions: `You review a proposed bookstore schedule for fairness.
You receive shift counts for each employee: this week and the four weeks before it.
Raise a "concern" when one regular employee carries clearly more closings or
weekend shifts than the others, or when on-call staff fill shifts while regulars
sit well under their limit. Raise a "note" for smaller imbalances.
Cite the counts. Do not suggest changes that break a weekly limit.
If the week looks even, return no findings and say so in the summary.`,
    output: Output.object({ schema: fairnessReport }),
  })
}
// #endregion fairness-agent

// #region fairness-tool
export function createFairnessTool(repo: Repository, model: LanguageModel) {
  const agent = createFairnessAgent(model)

  return tool({
    description:
      'Ask the fairness reviewer about a proposed week. Use it after proposeSchedule ' +
      'accepts a week and before you ask the manager to save it.',
    inputSchema: scheduleInput,
    execute: async (input, { abortSignal }) => {
      const proposed = toSchedule(input)
      const [staff, history] = await Promise.all([
        repo.listStaff(),
        repo.listSchedulesBefore(proposed.weekStart, 4),
      ])
      const stats = fairnessStats(proposed, history, staff)
      // Pass the abort signal through, so a cancelled chat also stops the subagent.
      const { output } = await agent.generate({
        prompt: JSON.stringify(stats),
        abortSignal,
      })
      return output
    },
    // The scheduler sees the findings, not the subagent's whole transcript.
    toModelOutput: ({ output }) => ({
      type: 'text',
      value:
        output.findings.length === 0
          ? `Fairness: no findings. ${output.summary}`
          : [
              `Fairness: ${output.summary}`,
              ...output.findings.map((f) => `- [${f.severity}] ${f.employeeId}: ${f.message}`),
            ].join('\n'),
    }),
  })
}
// #endregion fairness-tool
