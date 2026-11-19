import { createAgentUIStreamResponse } from 'ai'
import { createSchedulingAgent } from '@/lib/agents/scheduler'
import { storeToday } from '@/lib/dates'
import { createNeonRepository } from '@/lib/db/neon'

// #region route
export const maxDuration = 60

export async function POST(request: Request) {
  const { messages } = await request.json()

  // Build the agent per request, so "today" is always the store's today.
  const agent = createSchedulingAgent({
    repo: createNeonRepository(),
    today: storeToday(),
  })

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
    abortSignal: request.signal,
  })
}
// #endregion route
