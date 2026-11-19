import type { Employee, Unavailability } from './types'

// #region staff
// The staff are fictional. The real Fabulosa crew stays private.
export const STAFF: Employee[] = [
  { id: 'rosa', name: 'Rosa Alvarez', kind: 'regular', keyHolder: true, maxShiftsPerWeek: 5 },
  { id: 'theo', name: 'Theo Park', kind: 'regular', keyHolder: true, maxShiftsPerWeek: 5 },
  { id: 'june', name: 'June Okafor', kind: 'regular', keyHolder: true, maxShiftsPerWeek: 5 },
  { id: 'priya', name: 'Priya Shah', kind: 'regular', keyHolder: true, maxShiftsPerWeek: 4 },
  { id: 'desmond', name: 'Desmond Reyes', kind: 'regular', keyHolder: false, maxShiftsPerWeek: 5 },
  { id: 'kenji', name: 'Kenji Ito', kind: 'regular', keyHolder: false, maxShiftsPerWeek: 4 },
  { id: 'mara', name: 'Mara Lindqvist', kind: 'on-call', keyHolder: false, maxShiftsPerWeek: 2 },
  { id: 'felix', name: 'Felix Moreau', kind: 'on-call', keyHolder: true, maxShiftsPerWeek: 2 },
]

export const UNAVAILABILITY: Unavailability[] = [
  { employeeId: 'theo', day: 0 }, // Sundays off
  { employeeId: 'priya', day: 4 }, // Thursday class
  { employeeId: 'june', day: 2, shifts: ['closing'] }, // Tuesday evenings
  { employeeId: 'desmond', day: 1 },
  { employeeId: 'kenji', day: 5, shifts: ['mid', 'closing'] },
  { employeeId: 'kenji', day: 6, shifts: ['mid', 'closing'] },
]
// #endregion staff
