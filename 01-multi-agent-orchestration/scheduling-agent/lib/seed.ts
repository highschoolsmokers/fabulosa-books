import type { Employee, Unavailability } from './types'

// #region staff
// The real Fabulosa crew, by first name. Availability and shift limits are examples.
export const STAFF: Employee[] = [
  { id: 'alvin', name: 'Alvin', kind: 'regular', keyHolder: true, maxShiftsPerWeek: 5 },
  { id: 'marcus', name: 'Marcus', kind: 'regular', keyHolder: true, maxShiftsPerWeek: 5 },
  { id: 'dylan', name: 'Dylan', kind: 'regular', keyHolder: true, maxShiftsPerWeek: 5 },
  { id: 'joel', name: 'Joel', kind: 'regular', keyHolder: true, maxShiftsPerWeek: 4 },
  { id: 'violet', name: 'Violet', kind: 'regular', keyHolder: false, maxShiftsPerWeek: 5 },
  { id: 'johnny', name: 'Johnny', kind: 'regular', keyHolder: false, maxShiftsPerWeek: 4 },
  { id: 'melissa', name: 'Melissa', kind: 'on-call', keyHolder: false, maxShiftsPerWeek: 2 },
  { id: 'billy', name: 'Billy', kind: 'on-call', keyHolder: true, maxShiftsPerWeek: 2 },
]

export const UNAVAILABILITY: Unavailability[] = [
  { employeeId: 'marcus', day: 0 }, // Sundays off
  { employeeId: 'joel', day: 4 }, // Thursday class
  { employeeId: 'dylan', day: 2, shifts: ['closing'] }, // Tuesday evenings
  { employeeId: 'violet', day: 1 },
  { employeeId: 'johnny', day: 5, shifts: ['mid', 'closing'] },
  { employeeId: 'johnny', day: 6, shifts: ['mid', 'closing'] },
]
// #endregion staff
