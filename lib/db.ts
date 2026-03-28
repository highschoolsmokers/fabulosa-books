import initSqlJs, { Database as SqlJsDatabase } from 'sql.js'
import fs from 'fs'
import path from 'path'

let db: SqlJsDatabase | null = null
let SQL: any = null
let isInitializing = false
let initPromise: Promise<void> | null = null

const getDbPath = () => {
  const dbDir = path.join(process.cwd(), 'data')
  const dbFile = path.join(dbDir, 'schedule.db.json')
  return { dbDir, dbFile }
}

async function initializeDb() {
  if (isInitializing && initPromise) {
    return initPromise
  }

  if (db) return

  isInitializing = true

  initPromise = (async () => {
    try {
      if (!SQL) {
        SQL = await initSqlJs()
      }

      const { dbDir, dbFile } = getDbPath()

      // Create data directory if it doesn't exist
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true })
      }

      // Load existing database or create new one
      if (fs.existsSync(dbFile)) {
        try {
          const content = fs.readFileSync(dbFile, 'utf-8')
          const data = JSON.parse(content)
          db = new SQL.Database(new Uint8Array(data))
        } catch (error) {
          console.log('Could not load existing database, creating new one')
          db = new SQL.Database()
          initializeSchema()
        }
      } else {
        db = new SQL.Database()
        initializeSchema()
      }
    } finally {
      isInitializing = false
    }
  })()

  await initPromise
}

function initializeSchema() {
  if (!db) return

  // Create employees table
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      is_on_call BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create schedule table
  db.run(`
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

  // Initialize employees if they don't exist
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
      db!.run(
        'INSERT INTO employees (name, is_on_call) VALUES (?, ?)',
        [emp.name, emp.isOnCall ? 1 : 0]
      )
    } catch (error) {
      // Employee already exists, skip
    }
  })

  saveDb()
}

function saveDb() {
  if (!db) return

  const { dbDir, dbFile } = getDbPath()

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(dbFile, JSON.stringify(Array.from(buffer)))
}

export async function getDb(): Promise<SqlJsDatabase> {
  await initializeDb()
  return db!
}

export async function getAllEmployees() {
  const database = await getDb()
  const result = database.exec(
    'SELECT id, name, is_on_call FROM employees ORDER BY name'
  )
  if (result.length === 0) return []
  return result[0].values.map((row: any) => ({
    id: row[0],
    name: row[1],
    is_on_call: row[2],
  }))
}

export async function getWeekSchedule(weekStartDate: string) {
  const database = await getDb()
  const result = database.exec(
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

export async function updateSchedule(
  weekStartDate: string,
  dayOfWeek: number,
  shiftType: string,
  employeeName: string | null
) {
  const database = await getDb()

  if (!employeeName) {
    // Delete the schedule entry if no employee
    database.run(
      'DELETE FROM schedule WHERE week_start_date = ? AND day_of_week = ? AND shift_type = ?',
      [weekStartDate, dayOfWeek, shiftType]
    )
  } else {
    // Check if entry exists
    const check = database.exec(
      'SELECT id FROM schedule WHERE week_start_date = ? AND day_of_week = ? AND shift_type = ?',
      [weekStartDate, dayOfWeek, shiftType]
    )

    if (check.length > 0 && check[0].values.length > 0) {
      // Update existing
      database.run(
        'UPDATE schedule SET employee_name = ?, updated_at = CURRENT_TIMESTAMP WHERE week_start_date = ? AND day_of_week = ? AND shift_type = ?',
        [employeeName, weekStartDate, dayOfWeek, shiftType]
      )
    } else {
      // Insert new
      database.run(
        'INSERT INTO schedule (week_start_date, day_of_week, shift_type, employee_name) VALUES (?, ?, ?, ?)',
        [weekStartDate, dayOfWeek, shiftType, employeeName]
      )
    }
  }

  saveDb()
}
