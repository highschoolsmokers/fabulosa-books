export interface Employee {
  id: number
  name: string
  is_on_call: number
}

export interface ScheduleEntry {
  id: number
  day_of_week: number
  shift_type: string
  employee_name: string | null
  week_start_date: string
}

export interface ShiftSlot {
  dayOfWeek: number
  shiftType: string
  employeeName: string | null
}
