import type { LanguageModelV4CallOptions, LanguageModelV4GenerateResult } from '@ai-sdk/provider'
import { MockLanguageModelV4 } from 'ai/test'

const usage = {
  inputTokens: { total: 100, noCache: 100, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 50, text: 50, reasoning: 0 },
}

export type Turn =
  | { text: string }
  | { toolCalls: { toolName: string; input: unknown }[] }

// #region scripted-model
// A model that plays back a script, one turn per call, and records what it was sent.
export function scriptedModel(turns: Turn[]) {
  let i = 0
  const calls: LanguageModelV4CallOptions[] = []
  const model = new MockLanguageModelV4({
    doGenerate: async (options): Promise<LanguageModelV4GenerateResult> => {
      calls.push(options)
      const turn = turns[i++]
      if (!turn) throw new Error(`Script ran out after ${turns.length} turns.`)
      if ('text' in turn) {
        return {
          content: [{ type: 'text', text: turn.text }],
          finishReason: { unified: 'stop', raw: 'end_turn' },
          usage,
          warnings: [],
        }
      }
      return {
        content: turn.toolCalls.map((c, n) => ({
          type: 'tool-call',
          toolCallId: `call-${i}-${n}`,
          toolName: c.toolName,
          input: JSON.stringify(c.input),
        })),
        finishReason: { unified: 'tool-calls', raw: 'tool_use' },
        usage,
        warnings: [],
      }
    },
  })
  return { model, calls }
}
// #endregion scripted-model

// The text of the last tool result the model was sent, for assertions.
export function lastToolResult(options: LanguageModelV4CallOptions): unknown {
  const tool = options.prompt.filter((m) => m.role === 'tool').at(-1)
  const part = tool?.content.at(-1)
  return part && 'output' in part ? part.output : undefined
}
