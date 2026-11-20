import { describe, expect, it } from 'vitest'
import { createSchedulingAgent } from '@/lib/agents/scheduler'
import { createMemoryRepository } from '@/lib/db/repository'
import { STAFF, UNAVAILABILITY } from '@/lib/seed'
import { validSchedule, withAssignment } from './fixtures'
import { lastToolResult, scriptedModel } from './mock-model'

const TODAY = '2026-11-18' // a Wednesday; next week starts 2026-11-22

const repo = () => createMemoryRepository({ staff: STAFF, unavailability: UNAVAILABILITY })

describe('scheduling agent', () => {
  it("puts the store's date and next week's start in the instructions", async () => {
    const { model, calls } = scriptedModel([{ text: 'Hello.' }])
    const agent = createSchedulingAgent({ repo: repo(), today: TODAY, model })
    await agent.generate({ prompt: 'Hi' })
    const [system] = calls[0].prompt
    if (system.role !== 'system') throw new Error('expected a system message first')
    expect(system.content).toContain('Today is Wednesday, 2026-11-18.')
    expect(system.content).toContain('"Next week" starts 2026-11-22.')
  })

// #region retry-test
  it('reads violations back and retries until the week is valid', async () => {
    const broken = withAssignment(validSchedule(), 0, 'closing', 'marcus') // Marcus is off Sundays
    const { model, calls } = scriptedModel([
      { toolCalls: [{ toolName: 'proposeSchedule', input: broken }] },
      { toolCalls: [{ toolName: 'proposeSchedule', input: validSchedule() }] },
      { text: 'Here is the week.' },
    ])
    const agent = createSchedulingAgent({ repo: repo(), today: TODAY, model })
    const result = await agent.generate({ prompt: 'Schedule next week.' })

    expect(lastToolResult(calls[1])).toMatchObject({
      type: 'json',
      value: { valid: false, violations: [{ rule: 'unavailable', employeeId: 'marcus' }] },
    })
    expect(lastToolResult(calls[2])).toMatchObject({ value: { valid: true, violations: [] } })
    expect(result.text).toBe('Here is the week.')
  })
// #endregion retry-test

// #region approval-test
  it('stops for approval before saveSchedule runs', async () => {
    const store = repo()
    const { model } = scriptedModel([
      { toolCalls: [{ toolName: 'saveSchedule', input: validSchedule() }] },
    ])
    const agent = createSchedulingAgent({ repo: store, today: TODAY, model })
    const result = await agent.generate({ prompt: 'Save it.' })

    const approvals = result.finalStep.content.filter((p) => p.type === 'tool-approval-request')
    expect(approvals).toHaveLength(1)
    expect(store.saved).toEqual([])
  })
// #endregion approval-test

  it('passes only the fairness summary back to the scheduler', async () => {
    const { model: specialist, calls: specialistCalls } = scriptedModel([
      {
        text: JSON.stringify({
          findings: [{ severity: 'concern', employeeId: 'dylan', message: 'Dylan closes 3 of 7 nights.' }],
          summary: 'Dylan carries most closings.',
        }),
      },
    ])
    const { model, calls } = scriptedModel([
      { toolCalls: [{ toolName: 'reviewFairness', input: validSchedule() }] },
      { text: 'Done.' },
    ])
    const agent = createSchedulingAgent({ repo: repo(), today: TODAY, model, specialistModel: specialist })
    await agent.generate({ prompt: 'Is next week fair?' })

    // The subagent got the counts, computed in code.
    expect(JSON.stringify(specialistCalls[0].prompt)).toContain('closings')
    // The scheduler got a short text summary, not the subagent's transcript.
    expect(lastToolResult(calls[1])).toEqual({
      type: 'text',
      value: 'Fairness: Dylan carries most closings.\n- [concern] dylan: Dylan closes 3 of 7 nights.',
    })
  })

  it('rejects a bad week start before any tool runs', async () => {
    const { model, calls } = scriptedModel([
      { toolCalls: [{ toolName: 'getSchedule', input: { weekStart: '2026-11-23' } }] },
      { text: 'Sorry.' },
    ])
    const agent = createSchedulingAgent({ repo: repo(), today: TODAY, model })
    await agent.generate({ prompt: 'Show Monday’s week.' })
    expect(JSON.stringify(lastToolResult(calls[1]))).toContain('Must be a Sunday')
  })
})
