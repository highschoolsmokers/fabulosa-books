import { NextResponse } from 'next/server'
import { getAllEmployees } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const employees = await getAllEmployees()
    const formatted = employees.map((emp: any) => ({
      id: emp.id,
      name: emp.name,
      is_on_call: emp.is_on_call === 1,
    }))
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}
