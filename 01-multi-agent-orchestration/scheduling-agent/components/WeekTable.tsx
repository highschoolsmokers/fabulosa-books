import { DAY_NAMES, DAYS, SHIFT_TYPES } from '@/lib/store'
import type { Assignment } from '@/lib/types'

export function WeekTable({ assignments }: { assignments: { day: number; shift: string; employeeId: string }[] }) {
  const who = (day: number, shift: Assignment['shift']) =>
    assignments.find((a) => a.day === day && a.shift === shift)?.employeeId ?? '—'

  return (
    <table className="week">
      <thead>
        <tr>
          <th scope="col">Day</th>
          {SHIFT_TYPES.map((s) => (
            <th key={s} scope="col">
              {s}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {DAYS.map((d) => (
          <tr key={d}>
            <th scope="row">{DAY_NAMES[d].slice(0, 3)}</th>
            {SHIFT_TYPES.map((s) => (
              <td key={s}>{who(d, s)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
