'use client'

import { useEffect, useState, useCallback } from 'react'
import { Employee, ScheduleEntry } from '@/types'
import {
  getWeekStartDate,
  getDateFromDayOfWeek,
  formatDate,
  DAYS_OF_WEEK,
  getShiftsForDay,
} from '@/lib/utils'
import ShiftCell from './ShiftCell'

export default function ScheduleGrid({ employees }: { employees: Employee[] }) {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [weekStart, setWeekStart] = useState<string>(getWeekStartDate())
  const [isLoading, setIsLoading] = useState(true)

  const fetchSchedule = useCallback(async () => {
    try {
      const response = await fetch(`/api/schedule?weekStart=${weekStart}`)
      if (!response.ok) throw new Error('Failed to fetch schedule')
      const data = await response.json()
      setSchedule(data.schedule)
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setIsLoading(false)
    }
  }, [weekStart])

  useEffect(() => {
    setIsLoading(true)
    fetchSchedule()
  }, [fetchSchedule])

  const handleShiftUpdate = async (
    dayOfWeek: number,
    shiftType: string,
    employeeName: string | null
  ) => {
    try {
      const response = await fetch('/api/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekStart,
          dayOfWeek,
          shiftType,
          employeeName,
        }),
      })

      if (!response.ok) throw new Error('Failed to update schedule')

      // Refresh the schedule
      await fetchSchedule()
    } catch (error) {
      console.error('Error updating shift:', error)
    }
  }

  const goToPreviousWeek = () => {
    const date = new Date(weekStart)
    date.setDate(date.getDate() - 7)
    setWeekStart(date.toISOString().split('T')[0])
  }

  const goToNextWeek = () => {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + 7)
    setWeekStart(date.toISOString().split('T')[0])
  }

  const goToThisWeek = () => {
    setWeekStart(getWeekStartDate())
  }

  const getEmployeeForShift = (
    dayOfWeek: number,
    shiftType: string
  ): string | null => {
    const entry = schedule.find(
      (s) => s.day_of_week === dayOfWeek && s.shift_type === shiftType
    )
    return entry?.employee_name || null
  }

  if (isLoading) {
    return (
      <div className="text-center text-fab-dark py-8">
        <p>Loading schedule...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between bg-fab-dark text-white rounded-lg p-4">
        <button
          onClick={goToPreviousWeek}
          className="px-4 py-2 bg-fab-purple text-white rounded hover:bg-fab-purple-light transition"
        >
          ← Previous Week
        </button>

        <div className="text-center">
          <h2 className="text-xl font-semibold">
            Week of {formatDate(new Date(weekStart))}
          </h2>
          <p className="text-sm text-fab-pink">
            {weekStart} to{' '}
            {new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0]}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={goToThisWeek}
            className="px-4 py-2 bg-fab-purple text-white rounded hover:bg-fab-purple-light transition"
          >
            This Week
          </button>
          <button
            onClick={goToNextWeek}
            className="px-4 py-2 bg-fab-purple text-white rounded hover:bg-fab-purple-light transition"
          >
            Next Week →
          </button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-fab-cream rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-fab-dark text-white">
              <th className="p-4 text-left font-semibold">Shift</th>
              {DAYS_OF_WEEK.map((day, index) => {
                const date = getDateFromDayOfWeek(weekStart, index)
                const dateStr = formatDate(date)
                return (
                  <th key={day} className="p-4 text-center font-semibold">
                    <div>{day}</div>
                    <div className="text-sm text-fab-pink">{dateStr}</div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {['opening', 'mid', 'closing'].map((shiftType) => (
              <tr key={shiftType} className="border-t border-fab-pink-deep">
                <td className="p-4 font-semibold text-fab-dark bg-fab-pink-light">
                  {shiftType === 'opening'
                    ? 'Opening (10am–4pm)'
                    : shiftType === 'mid'
                      ? 'Mid (12pm–6pm)'
                      : 'Closing'}
                </td>
                {DAYS_OF_WEEK.map((_, dayIndex) => (
                  <td key={`${shiftType}-${dayIndex}`} className="p-2 text-center">
                    <ShiftCell
                      dayOfWeek={dayIndex}
                      shiftType={shiftType}
                      currentEmployee={getEmployeeForShift(dayIndex, shiftType)}
                      employees={employees}
                      onUpdate={handleShiftUpdate}
                      isSaturday={dayIndex === 6}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-fab-cream rounded-lg p-4 shadow-md">
        <h3 className="font-semibold text-fab-dark mb-2">Legend</h3>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-fab-purple rounded"></div>
            <span>Regular Employee</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-fab-crimson rounded"></div>
            <span>On-Call / As-Needed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-fab-pink-light rounded"></div>
            <span>Unassigned</span>
          </div>
        </div>
      </div>
    </div>
  )
}
