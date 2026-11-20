# Fabulosa Books scheduling agent

The reference app for the eight-part tutorial in [`../../html`](../../html/index.html). A store manager types "Schedule next week"; one scheduling agent proposes a week, reads back every rule it breaks, fixes them, asks a fairness subagent for a review, and waits for the manager's approval before it saves.

Next.js 16, AI SDK 7, Neon Postgres, and the Vercel AI Gateway. The staff are the store's real crew, by first name; their availability is made up.

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
| `npm run snippets` | Rewrites the code blocks in the tutorial HTML and `tutorial.md` from this app's source. |
| `npm run snippets:check` | Exits 1 if any block in either copy is out of date. |

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

Every TypeScript, TSX, and SQL block in the tutorial names its source. In the HTML pages the `<code>` element carries `data-source="path#region"`; in [`../tutorial.md`](../tutorial.md) a `<!-- source: path#region -->` comment sits on the line above the fence. `#region` selects the lines between `// #region name` and `// #endregion name`. `tests/tutorial.test.ts` fails when either copy and the source disagree, or when either shows code that has no source.
