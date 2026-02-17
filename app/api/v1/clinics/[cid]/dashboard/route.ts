import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("postgres") ? { rejectUnauthorized: false } : undefined,
})

export async function GET(
  request: NextRequest,
  { params }: { params: { cid: string } }
) {
  try {
    const clinicId = params.cid

    // Get today's appointments and production
    // Assuming appointments table has schedule_time, status, amount
    const appointmentsQuery = await pool.query(
      "SELECT * FROM appointments WHERE clinic_id = $1 AND scheduled_time::date = CURRENT_DATE ORDER BY scheduled_time ASC",
      [clinicId]
    )

    const appointments = appointmentsQuery.rows

    const todayAppointments = appointments.length

    // Calculate net production (completed appointments today)
    const netProduction = appointments
      .filter(app => app.status === 'completed')
      .reduce((sum, app) => sum + (parseFloat(app.amount) || 0), 0)

    // Get new leads (patients created in last 7 days)
    const newLeadsQuery = await pool.query(
      "SELECT COUNT(*) as count FROM patients WHERE clinic_id = $1 AND created_at >= NOW() - INTERVAL '7 days'",
      [clinicId]
    )
    const newLeads = parseInt(newLeadsQuery.rows[0].count, 10)

    // Placeholder for patient satisfaction (unless we have a reviews table)
    const patientSatisfaction = 4.8

    // Format appointments for display
    const formattedAppointments = appointments.slice(0, 5).map(apt => ({
      time: new Date(apt.scheduled_time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      patient: apt.patient_name || 'Unknown Patient',
      treatment: apt.treatment_type || 'General Appointment',
      status: apt.status || 'scheduled'
    }))

    // Get recent activity (mock or from usage_logs)
    const recentActivity = [
      {
        message: "Dashboard loaded successfully",
        time: "Just now",
        type: "system"
      }
    ]

    const dashboardData = {
      todayAppointments,
      netProduction,
      newLeads,
      patientSatisfaction,
      appointments: formattedAppointments,
      recentActivity
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}