// #region types
export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Sunday
export type ShiftType = 'opening' | 'mid' | 'closing'

export interface Employee {
  id: string
  name: string
  kind: 'regular' | 'on-call'
  keyHolder: boolean
  maxShiftsPerWeek: number
}

// A standing constraint: "Theo can't work Sundays."
// No `shifts` means the whole day.
export interface Unavailability {
  employeeId: string
  day: Day
  shifts?: ShiftType[]
}

// A one-off request for a specific date.
export interface TimeOff {
  employeeId: string
  date: string // YYYY-MM-DD
  reason?: string
}

export interface Assignment {
  day: Day
  shift: ShiftType
  employeeId: string
}

export interface Schedule {
  weekStart: string // YYYY-MM-DD, always a Sunday
  assignments: Assignment[]
}
// #endregion types
