# Fabulosa Books scheduling agent

The reference app for the eight-part tutorial in [`../../html`](../../html/index.html). A store manager types "Schedule next week"; one scheduling agent proposes a week, reads back every rule it breaks, fixes them, asks a fairness subagent for a review, and waits for the manager's approval before it saves.

Next.js 16, AI SDK 7, Neon Postgres, and the Vercel AI Gateway. The staff are fictional.

## Run it

```bash
npm install
vercel link
vercel env pull .env.local   # DATABASE_URL and VERCEL_OIDC_TOKEN
npm run db:setup
npm run dev
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm test` | Unit tests, agent tests with a scripted model, and the tutorial drift test. No model calls. |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run eval` | Runs the real agent on four scenarios and grades each week with `validateSchedule`. Costs money; needs `.env.local`. |
| `npm run db:setup` | Creates the tables and loads the staff. Safe to rerun. |
| `npm run snippets` | Rewrites the tutorial's code blocks from this app's source. |
| `npm run snippets:check` | Exits 1 if any tutorial block is out of date. |

## Layout

```
lib/rules.ts             validateSchedule: every hard rule
lib/agents/tools.ts      read tools, proposeSchedule, saveSchedule
lib/agents/scheduler.ts  the agent, its instructions, approval and step limit
lib/agents/fairness.ts   fairness counts and the fairness subagent
lib/agents/communication.ts  staff announcement draft
lib/db/                  repository interface, Neon and in-memory versions, schema
app/api/chat/route.ts    streams the agent to the chat
components/Chat.tsx      chat UI with the approval card
tests/                   Vitest
evals/                   real-model scenarios
scripts/snippets.ts      tutorial code-block sync
```

## Tutorial code blocks

Every TypeScript, TSX, and SQL block in the tutorial carries `data-source="path#region"`. `#region` selects the lines between `// #region name` and `// #endregion name`. `tests/tutorial.test.ts` fails when a page and the source disagree, or when a page shows code that has no source.
