'use client'

import { useChat } from '@ai-sdk/react'
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai'
import { useState } from 'react'
import type { SchedulerUIMessage } from '@/lib/agents/scheduler'
import { WeekTable } from './WeekTable'

// #region chat
export function Chat() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, addToolApprovalResponse, status } = useChat<SchedulerUIMessage>({
    // After the manager approves or rejects a save, send the answer back
    // to the agent so it can finish the turn.
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  })
  const busy = status === 'submitted' || status === 'streaming'

  return (
    <>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message" data-role={message.role}>
            {message.parts.map((part, i) => {
              const key = `${message.id}-${i}`
              switch (part.type) {
                case 'text':
                  return <p key={key}>{part.text}</p>

                case 'tool-saveSchedule':
                  if (part.state === 'approval-requested') {
                    return (
                      <div key={key} className="approval">
                        <p>Save this schedule for the week of {part.input.weekStart}?</p>
                        <WeekTable assignments={part.input.assignments} />
                        <button
                          type="button"
                          onClick={() => addToolApprovalResponse({ id: part.approval.id, approved: true })}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => addToolApprovalResponse({ id: part.approval.id, approved: false })}
                        >
                          Not yet
                        </button>
                      </div>
                    )
                  }
                  if (part.state === 'output-available') {
                    return (
                      <p key={key} className="tool">
                        {part.output.saved ? 'Saved.' : 'Not saved: the week broke a rule.'}
                      </p>
                    )
                  }
                  if (part.state === 'output-denied') {
                    return <p key={key} className="tool">Save declined.</p>
                  }
                  return null

                case 'tool-proposeSchedule':
                  return part.state === 'output-available' ? (
                    <p key={key} className="tool">
                      {part.output.valid
                        ? 'Checked the week: no rule violations.'
                        : `Checked the week: ${part.output.violations.length} violations to fix.`}
                    </p>
                  ) : null

                default:
                  return null
              }
            })}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!input.trim() || busy) return
          sendMessage({ text: input })
          setInput('')
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Schedule next week"
          aria-label="Message"
        />
        <button type="submit" disabled={busy}>
          Send
        </button>
      </form>
    </>
  )
}
// #endregion chat
