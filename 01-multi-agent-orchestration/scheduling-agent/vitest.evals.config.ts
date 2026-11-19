import { existsSync } from 'node:fs'
import { defineConfig, mergeConfig } from 'vitest/config'
import base from './vitest.config'

// Evals call the real model through the AI Gateway. `vercel env pull .env.local`
// writes the credentials this loads.
if (existsSync('.env.local')) process.loadEnvFile('.env.local')

export default mergeConfig(
  base,
  defineConfig({
    test: {
      include: ['evals/**/*.eval.ts'],
      testTimeout: 180_000,
    },
  }),
)
