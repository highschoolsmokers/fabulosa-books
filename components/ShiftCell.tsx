'use client'

import { useState, useRef, useEffect } from 'react'
import { Employee } from '@/types'

interface ShiftCellProps {
  dayOfWeek: number
  shiftType: string
  currentEmployee: string | null
  employees: Employee[]
  onUpdate: (dayOfWeek: number, shiftType: string, employeeName: string | null) => void
  isSaturday: boolean
}

export default function ShiftCell({
  dayOfWeek,
  shiftType,
  currentEmployee,
  employees,
  onUpdate,
  isSaturday,
}: ShiftCellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = async (employeeName: string | null) => {
    setIsUpdating(true)
    try {
      await onUpdate(dayOfWeek, shiftType, employeeName)
    } finally {
      setIsUpdating(false)
      setIsOpen(false)
    }
  }

  const shiftDisplay = () => {
    if (shiftType === 'closing' && isSaturday) {
      return '2pm–9pm'
    }
    if (shiftType === 'opening') return '10am–4pm'
    if (shiftType === 'mid') return '12pm–6pm'
    return '2pm–8pm'
  }

  const currentEmployeeData = employees.find((e) => e.name === currentEmployee)
  const bgColor = currentEmployee
    ? currentEmployeeData?.is_on_call
      ? 'bg-book-brown text-book-cream'
      : 'bg-book-gold text-book-dark'
    : 'bg-gray-200 text-book-dark'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`w-full px-3 py-2 rounded text-sm font-medium transition ${bgColor} hover:opacity-80 disabled:opacity-50`}
      >
        {isUpdating ? '...' : currentEmployee || 'Unassigned'}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-book-brown rounded shadow-lg z-10 max-h-64 overflow-y-auto">
          {/* Clear selection option */}
          <button
            onClick={() => handleSelect(null)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-book-cream transition border-b border-book-gold text-book-dark"
          >
            — No Assignment —
          </button>

          {/* Regular employees */}
          <div className="border-b border-book-gold">
            <div className="px-3 py-1 text-xs font-semibold text-book-brown bg-book-cream sticky top-0">
              Regular
            </div>
            {employees
              .filter((e) => !e.is_on_call)
              .map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => handleSelect(emp.name)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-book-cream transition ${
                    currentEmployee === emp.name ? 'bg-book-gold' : ''
                  }`}
                >
                  {emp.name}
                </button>
              ))}
          </div>

          {/* On-call employees */}
          <div>
            <div className="px-3 py-1 text-xs font-semibold text-book-brown bg-book-cream sticky top-0">
              On-Call
            </div>
            {employees
              .filter((e) => e.is_on_call)
              .map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => handleSelect(emp.name)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-book-cream transition ${
                    currentEmployee === emp.name ? 'bg-book-gold' : ''
                  }`}
                >
                  {emp.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
