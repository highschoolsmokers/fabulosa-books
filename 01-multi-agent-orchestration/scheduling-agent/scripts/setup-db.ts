// Create the tables and load the staff.
// Run with: npm run db:setup  (reads DATABASE_URL from .env.local)
import { readFile } from 'node:fs/promises'
import { neon } from '@neondatabase/serverless'
import { STAFF, UNAVAILABILITY } from '../lib/seed.ts'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set. Run `vercel env pull .env.local` first.')
  process.exit(1)
}
const sql = neon(url)

const schema = await readFile(new URL('../lib/db/schema.sql', import.meta.url), 'utf8')
for (const statement of schema.split(';').map((s) => s.replace(/--.*$/gm, '').trim()).filter(Boolean)) {
  await sql.query(statement)
}

await sql.transaction([
  ...STAFF.map(
    (e) => sql`
      INSERT INTO employees (id, name, kind, key_holder, max_shifts_per_week)
      VALUES (${e.id}, ${e.name}, ${e.kind}, ${e.keyHolder}, ${e.maxShiftsPerWeek})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name, kind = EXCLUDED.kind,
        key_holder = EXCLUDED.key_holder, max_shifts_per_week = EXCLUDED.max_shifts_per_week`,
  ),
  sql`DELETE FROM unavailability`,
  ...UNAVAILABILITY.map(
    (u) => sql`
      INSERT INTO unavailability (employee_id, day, shifts)
      VALUES (${u.employeeId}, ${u.day}, ${u.shifts ?? null})`,
  ),
])

console.log(`Loaded ${STAFF.length} employees and ${UNAVAILABILITY.length} standing constraints.`)
