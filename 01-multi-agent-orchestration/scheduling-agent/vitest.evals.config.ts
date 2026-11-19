import { existsSync } from 'node:fs'
import { defineConfig } from 'vitest/config'
import base from './vitest.config'

// Evals call the real model through the AI Gateway. `vercel env pull .env.local`
// writes the credentials this loads.
if (existsSync('.env.local')) process.loadEnvFile('.env.local')

// Not mergeConfig: it would add the unit tests' include pattern to this one.
export default defineConfig({
  resolve: base.resolve,
  test: {
    include: ['evals/**/*.eval.ts'],
    testTimeout: 180_000,
  },
})
