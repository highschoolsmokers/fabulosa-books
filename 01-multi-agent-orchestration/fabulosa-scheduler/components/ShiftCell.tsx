'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
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
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      })
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    function handleScroll() {
      updatePosition()
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen, updatePosition])

  const handleOpen = () => {
    updatePosition()
    setIsOpen(!isOpen)
  }

  const handleSelect = async (employeeName: string | null) => {
    setIsUpdating(true)
    try {
      await onUpdate(dayOfWeek, shiftType, employeeName)
    } finally {
      setIsUpdating(false)
      setIsOpen(false)
    }
  }

  const currentEmployeeData = employees.find((e) => e.name === currentEmployee)
  const bgColor = currentEmployee
    ? currentEmployeeData?.is_on_call
      ? 'bg-fab-crimson text-white'
      : 'bg-fab-purple text-white'
    : 'bg-fab-pink-light text-fab-dark'

  const dropdown = isOpen
    ? createPortal(
        <div
          ref={dropdownRef}
          className="fixed bg-white border border-fab-dark rounded shadow-lg max-h-64 overflow-y-auto"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: Math.max(dropdownPos.width, 160),
            zIndex: 9999,
          }}
        >
          {/* Clear selection option */}
          <button
            onClick={() => handleSelect(null)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-fab-pink-light transition border-b border-fab-pink-deep text-fab-dark"
          >
            — No Assignment —
          </button>

          {/* Regular employees */}
          <div className="border-b border-fab-pink-deep">
            <div className="px-3 py-1 text-xs font-semibold text-white bg-fab-purple sticky top-0">
              Regular
            </div>
            {employees
              .filter((e) => !e.is_on_call)
              .map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => handleSelect(emp.name)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-fab-pink-light transition ${
                    currentEmployee === emp.name ? 'bg-fab-pink' : ''
                  }`}
                >
                  {emp.name}
                </button>
              ))}
          </div>

          {/* On-call employees */}
          <div>
            <div className="px-3 py-1 text-xs font-semibold text-white bg-fab-crimson sticky top-0">
              On-Call
            </div>
            {employees
              .filter((e) => e.is_on_call)
              .map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => handleSelect(emp.name)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-fab-pink-light transition ${
                    currentEmployee === emp.name ? 'bg-fab-pink' : ''
                  }`}
                >
                  {emp.name}
                </button>
              ))}
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        disabled={isUpdating}
        className={`w-full px-3 py-2 rounded text-sm font-medium transition ${bgColor} hover:opacity-80 disabled:opacity-50`}
      >
        {isUpdating ? '...' : currentEmployee || 'Unassigned'}
      </button>
      {dropdown}
    </>
  )
}
