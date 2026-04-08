import { neon } from '@neondatabase/serverless'

// ---- Neon (production) helpers ----

function getSQL() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return neon(url)
}

async function initializeNeonSchema() {
  const sql = getSQL()

  await sql`
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      is_on_call BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS schedule (
      id SERIAL PRIMARY KEY,
      day_of_week INTEGER NOT NULL,
      shift_type TEXT NOT NULL,
      employee_name TEXT,
      week_start_date TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(week_start_date, day_of_week, shift_type)
    )
  `

  // Seed employees if table is empty
  const existing = await sql`SELECT count(*) as cnt FROM employees`
  if (Number(existing[0].cnt) === 0) {
    const employees = [
      { name: 'Alvin', isOnCall: false },
      { name: 'Melissa', isOnCall: false },
      { name: 'Marcus', isOnCall: false },
      { name: 'Dylan', isOnCall: false },
      { name: 'Joel', isOnCall: false },
      { name: 'Billy', isOnCall: false },
      { name: 'Johnny Ray', isOnCall: true },
      { name: 'Carly', isOnCall: true },
    ]
    for (const emp of employees) {
      await sql`
        INSERT INTO employees (name, is_on_call)
        VALUES (${emp.name}, ${emp.isOnCall})
        ON CONFLICT (name) DO NOTHING
      `
    }
  }
}

let schemaInitialized = false

async function ensureNeonSchema() {
  if (!schemaInitialized) {
    await initializeNeonSchema()
    schemaInitialized = true
  }
}

// ---- sql.js (local dev) helpers ----

import initSqlJs, { Database as SqlJsDatabase } from 'sql.js'
import fs from 'fs'
import path from 'path'

let localDb: SqlJsDatabase | null = null

const getDbPath = () => {
  const dbDir = path.join(process.cwd(), 'data')
  const dbFile = path.join(dbDir, 'schedule.db.json')
  return { dbDir, dbFile }
}

function saveLocalDb() {
  if (!localDb) return
  const { dbDir, dbFile } = getDbPath()
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
  const data = localDb.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(dbFile, JSON.stringify(Array.from(buffer)))
}

function initializeLocalSchema() {
  if (!localDb) return

  localDb.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      is_on_call BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  localDb.run(`
    CREATE TABLE IF NOT EXISTS schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_of_week INTEGER NOT NULL,
      shift_type TEXT NOT NULL,
      employee_name TEXT,
      week_start_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(week_start_date, day_of_week, shift_type)
    )
  `)

  const employees = [
    { name: 'Alvin', isOnCall: false },
    { name: 'Melissa', isOnCall: false },
    { name: 'Marcus', isOnCall: false },
    { name: 'Dylan', isOnCall: false },
    { name: 'Joel', isOnCall: false },
    { name: 'Billy', isOnCall: false },
    { name: 'Johnny Ray', isOnCall: true },
    { name: 'Carly', isOnCall: true },
  ]

  employees.forEach((emp) => {
    try {
      localDb!.run(
        'INSERT INTO employees (name, is_on_call) VALUES (?, ?)',
        [emp.name, emp.isOnCall ? 1 : 0]
      )
    } catch {
      // already exists
    }
  })

  saveLocalDb()
}

async function getLocalDb(): Promise<SqlJsDatabase> {
  if (localDb) return localDb

  const SQL = await initSqlJs()
  const { dbDir, dbFile } = getDbPath()

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  if (fs.existsSync(dbFile)) {
    try {
      const content = fs.readFileSync(dbFile, 'utf-8')
      const data = JSON.parse(content)
      localDb = new SQL.Database(new Uint8Array(data))
    } catch {
      localDb = new SQL.Database()
      initializeLocalSchema()
    }
  } else {
    localDb = new SQL.Database()
    initializeLocalSchema()
  }

  return localDb!
}

// ---- Detect which backend to use ----

const useNeon = !!process.env.DATABASE_URL

// ---- Public API ----

export async function getAllEmployees() {
  if (useNeon) {
    await ensureNeonSchema()
    const sql = getSQL()
    const rows = await sql`SELECT id, name, is_on_call FROM employees ORDER BY name`
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      is_on_call: r.is_on_call,
    }))
  } else {
    const db = await getLocalDb()
    const result = db.exec(
      'SELECT id, name, is_on_call FROM employees ORDER BY name'
    )
    if (result.length === 0) return []
    return result[0].values.map((row: any) => ({
      id: row[0],
      name: row[1],
      is_on_call: row[2],
    }))
  }
}

export async function getWeekSchedule(weekStartDate: string) {
  if (useNeon) {
    await ensureNeonSchema()
    const sql = getSQL()
    const rows = await sql`
      SELECT id, day_of_week, shift_type, employee_name, week_start_date
      FROM schedule
      WHERE week_start_date = ${weekStartDate}
      ORDER BY day_of_week, shift_type
    `
    return rows.map((r: any) => ({
      id: r.id,
      day_of_week: r.day_of_week,
      shift_type: r.shift_type,
      employee_name: r.employee_name,
      week_start_date: r.week_start_date,
    }))
  } else {
    const db = await getLocalDb()
    const result = db.exec(
      'SELECT id, day_of_week, shift_type, employee_name, week_start_date FROM schedule WHERE week_start_date = ? ORDER BY day_of_week, shift_type',
      [weekStartDate]
    )
    if (result.length === 0) return []
    return result[0].values.map((row: any) => ({
      id: row[0],
      day_of_week: row[1],
      shift_type: row[2],
      employee_name: row[3],
      week_start_date: row[4],
    }))
  }
}

export async function updateSchedule(
  weekStartDate: string,
  dayOfWeek: number,
  shiftType: string,
  employeeName: string | null
) {
  if (useNeon) {
    await ensureNeonSchema()
    const sql = getSQL()

    if (!employeeName) {
      await sql`
        DELETE FROM schedule
        WHERE week_start_date = ${weekStartDate}
          AND day_of_week = ${dayOfWeek}
          AND shift_type = ${shiftType}
      `
    } else {
      // Upsert
      await sql`
        INSERT INTO schedule (week_start_date, day_of_week, shift_type, employee_name)
        VALUES (${weekStartDate}, ${dayOfWeek}, ${shiftType}, ${employeeName})
        ON CONFLICT (week_start_date, day_of_week, shift_type)
        DO UPDATE SET employee_name = ${employeeName}, updated_at = NOW()
      `
    }
  } else {
    const db = await getLocalDb()

    if (!employeeName) {
      db.run(
        'DELETE FROM schedule WHERE week_start_date = ? AND day_of_week = ? AND shift_type = ?',
        [weekStartDate, dayOfWeek, shiftType]
      )
    } else {
      const check = db.exec(
        'SELECT id FROM schedule WHERE week_start_date = ? AND day_of_week = ? AND shift_type = ?',
        [weekStartDate, dayOfWeek, shiftType]
      )

      if (check.length > 0 && check[0].values.length > 0) {
        db.run(
          'UPDATE schedule SET employee_name = ?, updated_at = CURRENT_TIMESTAMP WHERE week_start_date = ? AND day_of_week = ? AND shift_type = ?',
          [employeeName, weekStartDate, dayOfWeek, shiftType]
        )
      } else {
        db.run(
          'INSERT INTO schedule (week_start_date, day_of_week, shift_type, employee_name) VALUES (?, ?, ?, ?)',
          [weekStartDate, dayOfWeek, shiftType, employeeName]
        )
      }
    }

    saveLocalDb()
  }
}
