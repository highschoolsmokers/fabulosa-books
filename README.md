# Fabulosa Books — Tutorial Series

A series of tutorials built around **Fabulosa Books**, an LGBTQIA+ bookstore in San Francisco's Castro neighborhood. Each tutorial teaches a modern development concept by solving a real problem for the store.

## Tutorials

### 01 — Multi-Agent Orchestration

Build an AI-powered employee scheduling system using multiple coordinated agents. Learn how to design, build, and orchestrate specialized AI agents with the Vercel AI SDK.

**Stack:** Next.js, Vercel AI SDK, Neon (serverless Postgres), Vercel

[Start the tutorial →](01-multi-agent-orchestration/tutorial.md)

## Deployment

The runnable scheduler app under `01-multi-agent-orchestration/fabulosa-scheduler/` is deployed to the Vercel project **`fabulosa-scheduler`**. Vercel can't infer this layout from any file in the repo — when re-importing the project (or fixing a misconfigured one), set the project's **Root Directory** to:

```
01-multi-agent-orchestration/fabulosa-scheduler
```

Without this, `next build` runs at the repo root and fails with `Couldn't find any 'pages' or 'app' directory`.
