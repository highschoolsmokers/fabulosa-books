import { NextRequest, NextResponse } from 'next/server'
import { getWeekSchedule, updateSchedule } from '@/lib/db'
import { getWeekStartDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const weekStart = searchParams.get('weekStart') || getWeekStartDate()

    const schedule = await getWeekSchedule(weekStart)
    return NextResponse.json({ schedule, weekStart })
  } catch (error) {
    console.error('Error fetching schedule:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { weekStart, dayOfWeek, shiftType, employeeName } = body

    if (
      weekStart === undefined ||
      dayOfWeek === undefined ||
      shiftType === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await updateSchedule(weekStart, dayOfWeek, shiftType, employeeName || null)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating schedule:', error)
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    )
  }
}
