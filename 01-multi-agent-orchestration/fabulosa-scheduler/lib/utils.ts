export function getWeekStartDate(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const weekStart = new Date(d.setDate(diff))
  return weekStart.toISOString().split('T')[0]
}

export function getDateFromDayOfWeek(weekStart: string, dayOfWeek: number): Date {
  const date = new Date(weekStart)
  date.setDate(date.getDate() + dayOfWeek)
  return date
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const SHIFTS = [
  { type: 'opening', label: 'Opening', time: '10am–4pm' },
  { type: 'mid', label: 'Mid', time: '12pm–6pm' },
  { type: 'closing', label: 'Closing', time: '2pm–8pm' },
]

export const SHIFTS_SATURDAY = [
  { type: 'opening', label: 'Opening', time: '10am–4pm' },
  { type: 'mid', label: 'Mid', time: '12pm–6pm' },
  { type: 'closing', label: 'Closing', time: '2pm–9pm' },
]

export function getShiftsForDay(dayOfWeek: number) {
  return dayOfWeek === 6 ? SHIFTS_SATURDAY : SHIFTS
}
