import { NextRequest, NextResponse } from 'next/server'
import {
  getTodayAppointments,
  getTodaySchedule,
  getWeeklyProduction,
  getNewLeadsCount,
  getPatientSatisfaction,
  getRecentActivity,
  getAIInsights
} from '@/lib/dashboard-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { cid: string } }
) {
  try {
    const clinicId = params.cid

    // Fetch all dashboard data in parallel for performance
    const [
      todayAppointments,
      appointments,
      netProduction,
      newLeads,
      satisfaction,
      recentActivity,
      aiInsights
    ] = await Promise.all([
      getTodayAppointments(clinicId),
      getTodaySchedule(clinicId),
      getWeeklyProduction(clinicId),
      getNewLeadsCount(clinicId),
      getPatientSatisfaction(clinicId),
      getRecentActivity(clinicId, 10),
      getAIInsights(clinicId)
    ])

    const dashboardData = {
      todayAppointments,
      netProduction,
      newLeads,
      patientSatisfaction: satisfaction.rating,
      appointments: appointments.slice(0, 10), // Limit to 10 for dashboard view
      recentActivity: recentActivity.map(activity => ({
        message: activity.message,
        time: activity.time,
        type: activity.icon
      })),
      aiInsights
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', details: (error as Error).message },
      { status: 500 }
    )
  }
}