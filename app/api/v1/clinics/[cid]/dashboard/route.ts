import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { cid: string } }
) {
  try {
    const supabase = getClient()
    const clinicId = params.cid

    // Get real dashboard data
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('clinic_id', clinicId)
      .gte('scheduled_time', new Date().toISOString().split('T')[0])
      .order('scheduled_time', { ascending: true })

    if (appointmentsError) {
      console.error('Appointments error:', appointmentsError)
    }

    const todayAppointments = appointments?.filter(apt => 
      new Date(apt.scheduled_time).toDateString() === new Date().toDateString()
    ).length || 0

    // Get production data (sum of completed appointments today)
    const { data: production, error: productionError } = await supabase
      .from('appointments')
      .select('amount')
      .eq('clinic_id', clinicId)
      .eq('status', 'completed')
      .gte('scheduled_time', new Date().toISOString().split('T')[0])

    const netProduction = production?.reduce((sum, apt) => sum + (apt.amount || 0), 0) || 0

    // Get new leads count
    const { count: newLeads, error: leadsError } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('clinic_id', clinicId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    // Get patient satisfaction (placeholder for now)
    const patientSatisfaction = 4.8

    // Format appointments for display
    const formattedAppointments = appointments?.slice(0, 5).map(apt => ({
      time: new Date(apt.scheduled_time).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      patient: apt.patient_name || 'Unknown Patient',
      treatment: apt.treatment_type || 'General Appointment',
      status: apt.status || 'scheduled'
    })) || []

    // Get recent activity
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
      newLeads: newLeads || 0,
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