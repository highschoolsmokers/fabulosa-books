# Fabulosa Books — Tutorial Series

A series of tutorials built around **Fabulosa Books**, an LGBTQIA+ bookstore in San Francisco's Castro neighborhood. Each tutorial teaches a modern development concept by solving a real problem for the store.

## Tutorials

### 01 — Multi-Agent Orchestration

Build a scheduling agent for the store's weekly staff schedule: one agent with seven tools, a fairness subagent, and rules in code that the model can't break. The tutorial covers agent design, safe writes with human approval, testing an agent with a scripted model, and evals.

**Stack:** Next.js 16, AI SDK 7, Neon (serverless Postgres), Vercel AI Gateway

[Start the tutorial →](01-multi-agent-orchestration/tutorial.md) · [HTML version](html/index.html) · [The app](01-multi-agent-orchestration/scheduling-agent/)

## Editing the tutorial

`html/` is the source of truth. After editing it, rebuild the Markdown, Word and PDF copies:

```
scripts/build-docs.sh
```

`scripts/build-docs.sh --check` fails if `tutorial.md` is behind `html/`. The build needs `pandoc` and `weasyprint` (`brew install pandoc weasyprint`). The public copy on ws-gong.com picks up changes through that repo's `pnpm sync:tutorial`.

## Deployment

The app under `01-multi-agent-orchestration/scheduling-agent/` deploys to the Vercel project **`fabulosa-scheduler`**. Vercel can't infer this layout from any file in the repo. When re-importing the project, or fixing a misconfigured one, set the project's **Root Directory** to:

```
01-multi-agent-orchestration/scheduling-agent
```

Without this, `next build` runs at the repo root and fails with `Couldn't find any 'pages' or 'app' directory`.
