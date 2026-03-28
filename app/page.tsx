'use client'

import { useEffect, useState } from 'react'
import ScheduleGrid from '@/components/ScheduleGrid'
import { Employee } from '@/types'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees')
        if (!response.ok) throw new Error('Failed to fetch employees')
        const data = await response.json()
        setEmployees(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  return (
    <main className="min-h-screen bg-book-cream">
      <header className="bg-book-brown text-book-cream shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold">Fabulosa Books</h1>
          <p className="text-book-gold mt-2">Employee Schedule</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-book-brown py-8">
            <p className="text-lg">Loading schedule...</p>
          </div>
        ) : (
          <ScheduleGrid employees={employees} />
        )}
      </div>
    </main>
  )
}
