import type { ToolExecutionOptions } from 'ai'
import { describe, expect, it } from 'vitest'
import { createReadTools, createWriteTools } from '@/lib/agents/tools'
import { createMemoryRepository } from '@/lib/db/repository'
import { STAFF, UNAVAILABILITY } from '@/lib/seed'
import { validSchedule, WEEK, withAssignment } from './fixtures'

const opts = { toolCallId: 't1', messages: [] } as unknown as ToolExecutionOptions<never>

// Call a tool's execute function directly. These tools return plain values, not streams.
async function run<I, O>(t: { execute?: (input: I, o: typeof opts) => O | PromiseLike<O> | AsyncIterable<O> }, input: I): Promise<O> {
  const out = await t.execute?.(input, opts)
  if (out === undefined || (typeof out === 'object' && out !== null && Symbol.asyncIterator in out)) {
    throw new Error('expected a plain result')
  }
  return out as O
}

function setup(timeOff = [] as { employeeId: string; date: string }[]) {
  const repo = createMemoryRepository({ staff: STAFF, unavailability: UNAVAILABILITY, timeOff })
  return { repo, ...createReadTools(repo), ...createWriteTools(repo) }
}

describe('saveSchedule', () => {
  it('writes a valid week', async () => {
    const { repo, saveSchedule } = setup()
    const result = await run(saveSchedule, validSchedule())
    expect(result).toEqual({ saved: true, weekStart: WEEK })
    expect(repo.saved).toHaveLength(1)
  })

// #region save-tests
  it('refuses an invalid week even after approval', async () => {
    const { repo, saveSchedule } = setup()
    const bad = withAssignment(validSchedule(), 0, 'opening', 'violet') // not a key holder
    const result = await run(saveSchedule, bad)
    expect(result).toMatchObject({ saved: false, violations: [{ rule: 'needs-key-holder' }] })
    expect(repo.saved).toEqual([])
  })

  it('checks time off recorded after the proposal', async () => {
    // Joel asks for Wednesday off between the dry run and the save.
    const { saveSchedule } = setup([{ employeeId: 'joel', date: '2026-11-25' }])
    const result = await run(saveSchedule, validSchedule())
    expect(result).toMatchObject({ saved: false, violations: [{ rule: 'time-off' }] })
  })
// #endregion save-tests
})

describe('getAvailability', () => {
  it('returns only time off inside the week', async () => {
    const { getAvailability } = setup([
      { employeeId: 'joel', date: '2026-11-25' },
      { employeeId: 'alvin', date: '2026-12-02' },
    ])
    const result = await run(getAvailability, { weekStart: WEEK })
    expect(result.timeOff).toEqual([{ employeeId: 'joel', date: '2026-11-25' }])
    expect(result.standing).toContainEqual({ employeeId: 'marcus', day: 'Sunday', shifts: 'all day' })
  })
})
