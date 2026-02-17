"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { useEffect, useState } from "react"
import {
  Calendar,
  Users,
  TrendingUp,
  MessageSquare,
  DollarSign,
  Clock,
  UserCheck,
  Star,
  Activity,
  Phone,
  ChevronRight,
  Zap,
  Megaphone,
} from "@/components/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MetricCard from "./metric-card"

interface DashboardData {
  todayAppointments: number
  netProduction: number
  newLeads: number
  patientSatisfaction: number
  appointments: Array<{
    time: string
    patient: string
    treatment: string
    status: string
  }>
  recentActivity: Array<{
    message: string
    time: string
    type: string
  }>
}

export default function Content() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  const handleScheduleAppointment = () => router.push("/appointments")
  const handleAddPatient = () => router.push("/patient-crm")
  const handleSendCampaign = () => router.push("/patient-engagement")
  const handleViewAnalytics = () => router.push("/analytics-reporting")
  const handlePatientRecords = () => router.push("/patient-crm")
  const handleReviewRequests = () => router.push("/reputation-management")

  // Fetch real dashboard data
  useEffect(() => {
    if (!user) return

    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`/api/v1/clinics/${user.id}/dashboard`)
        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setDataLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (loading || dataLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground font-medium animate-pulse">Loading practice data...</p>
          </div>
        </div>
      </div>
    )
  }

  const data = dashboardData || {
    todayAppointments: 0,
    netProduction: 0,
    newLeads: 0,
    patientSatisfaction: 0,
    appointments: [],
    recentActivity: []
  }

  const appointmentDetails = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-black text-foreground">{data.appointments.filter(a => a.status === 'confirmed').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending</p>
          <p className="text-2xl font-black text-foreground">{data.appointments.filter(a => a.status === 'pending').length}</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-bold text-sm text-foreground">Today's Schedule</h4>
        {data.appointments.length > 0 ? (
          data.appointments.map((apt, i) => (
            <div key={i} className="p-3 rounded-xl border border-border/50 bg-background/50 flex justify-between items-center">
              <div>
                <div className="font-bold text-sm text-foreground">
                  {apt.time} - {apt.patient}
                </div>
                <div className="text-xs text-muted-foreground font-medium">{apt.treatment}</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-xs font-medium italic">No appointments remaining today.</p>
        )}
      </div>
    </div>
  )

  const productionDetails = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Today</p>
          <p className="text-2xl font-black text-foreground">${data.netProduction.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Week</p>
          <p className="text-2xl font-black text-foreground">${(data.netProduction * 7).toLocaleString()}</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-bold text-sm text-foreground">Revenue Insights</h4>
        <p className="text-muted-foreground text-xs font-medium">Production is trending up 12% vs last week.</p>
      </div>
    </div>
  )

  const newPatientsDetails = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Week</p>
          <p className="text-2xl font-black text-foreground">{data.newLeads}</p>
        </div>
        <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Month</p>
          <p className="text-2xl font-black text-foreground">{data.newLeads * 4}</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-bold text-sm text-foreground">Acquisition Sources</h4>
        <p className="text-muted-foreground text-xs font-medium">Most leads coming from: Google Ads (45%)</p>
      </div>
    </div>
  )

  const satisfactionDetails = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rating</p>
          <p className="text-2xl font-black text-foreground">{data.patientSatisfaction}/5</p>
        </div>
        <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reviews</p>
          <p className="text-2xl font-black text-foreground">0</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-bold text-sm text-foreground">Reputation Health</h4>
        <p className="text-muted-foreground text-xs font-medium">You have 2 pending review requests.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground mb-2">
            Home Base
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Good afternoon, <span className="text-primary font-bold">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Doctor'}</span>.
            Here is your practice pulse.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl px-6 h-12 font-bold border-border/60 hover:bg-muted/50 hover:text-foreground transition-all" onClick={handleScheduleAppointment}>
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            Schedule
          </Button>
          <Button className="rounded-xl px-6 h-12 font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddPatient}>
            <Users className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Appointments"
          value={data.todayAppointments.toString()}
          subtitle="Scheduled today"
          icon={Calendar}
          detailsContent={appointmentDetails}
          className="glass-card shadow-sm shadow-blue-500/5 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="Production"
          value={`$${data.netProduction.toLocaleString()}`}
          subtitle="Gross revenue today"
          icon={DollarSign}
          detailsContent={productionDetails}
          className="glass-card shadow-sm shadow-indigo-500/5 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="New Leads"
          value={data.newLeads.toString()}
          subtitle="In the last 7 days"
          icon={UserCheck}
          detailsContent={newPatientsDetails}
          className="glass-card shadow-sm shadow-purple-500/5 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="NPS Score"
          value={data.patientSatisfaction.toFixed(1)}
          subtitle="Patient satisfaction"
          icon={Star}
          detailsContent={satisfactionDetails}
          className="glass-card shadow-sm shadow-yellow-500/5 hover:shadow-md transition-shadow"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schedule & Activity (Left/Center) */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card rounded-3xl border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4 pt-6 px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  Daily Agenda
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5 rounded-lg px-4" onClick={handleScheduleAppointment}>
                  View Calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {data.appointments.length > 0 ? (
                  data.appointments.slice(0, 5).map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className="text-sm font-black text-muted-foreground w-16 bg-muted/50 py-1 px-2 rounded-lg text-center border border-border/50">
                          {appointment.time}
                        </div>
                        <div>
                          <div className="font-bold text-foreground group-hover:text-primary transition-colors text-base">{appointment.patient}</div>
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-0.5">{appointment.treatment}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`
                          px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border
                          ${appointment.status === 'confirmed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                            appointment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                              'bg-muted text-muted-foreground border-border/40'}
                        `}>
                          {appointment.status}
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 transition-all">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-muted-foreground">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 opacity-40" />
                    </div>
                    <p className="font-bold text-lg mb-1">Clear Schedule</p>
                    <p className="text-sm opacity-70">No appointments scheduled for today.</p>
                    <Button variant="link" onClick={handleScheduleAppointment} className="mt-2 text-primary">
                      Open Calendar
                    </Button>
                  </div>
                )}
              </div>
              {data.appointments.length > 5 && (
                <div className="p-4 text-center border-t border-border/40 bg-muted/10">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-foreground" onClick={handleScheduleAppointment}>
                    View {data.appointments.length - 5} more appointments
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card rounded-3xl border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4 pt-6 px-6">
              <CardTitle className="text-lg font-bold flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                Live Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {data.recentActivity.length > 0 ? (
                  data.recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex gap-5 group relative">
                      {/* Timeline line */}
                      {index !== data.recentActivity.length - 1 && (
                        <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-border/40" />
                      )}

                      <div className="w-10 h-10 rounded-xl bg-background border border-border/60 flex items-center justify-center flex-shrink-0 shadow-sm z-10 group-hover:border-primary/40 group-hover:text-primary transition-all">
                        {activity.type === 'call' ? <Phone className="w-4 h-4" /> :
                          activity.type === 'message' ? <MessageSquare className="w-4 h-4" /> :
                            <Activity className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">{activity.message}</p>
                        <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tight opacity-70">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Sidebar (Right) */}
        <div className="space-y-8">
          <Card className="glass-card rounded-3xl border-primary/20 bg-background/50 shadow-2xl shadow-primary/5 overflow-hidden group">
            <div className="bg-ai-gradient p-6 text-white relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 blur-3xl rounded-full pointer-events-none" />
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <h3 className="font-black tracking-tight text-lg">Nova Insights</h3>
              </div>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest relative z-10 pl-1">Practice Optimization AI</p>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-background/80 border border-border/60 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Action Item</p>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <p className="text-sm font-bold text-foreground leading-relaxed mb-4">
                    Welcome to Orasync! Start by adding your first patient to activate the AI reactivation engine.
                  </p>
                  <Button size="sm" className="w-full text-xs font-bold rounded-xl h-9" onClick={handleAddPatient}>
                    Add First Patient
                  </Button>
                </div>

                <div className="p-5 rounded-2xl bg-background/80 border border-border/60 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Tip</p>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    Did you know? You can sync your calendar to enable auto-scheduling.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "New Campaign", icon: Megaphone, action: handleSendCampaign, color: "text-pink-500", bg: "bg-pink-500/10" },
              { label: "Patient CRM", icon: Users, action: handlePatientRecords, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Reports", icon: TrendingUp, action: handleViewAnalytics, color: "text-green-500", bg: "bg-green-500/10" },
              { label: "Reviews", icon: Star, action: handleReviewRequests, color: "text-yellow-500", bg: "bg-yellow-500/10" },
            ].map((shortcut, i) => (
              <button
                key={i}
                onClick={shortcut.action}
                className="glass-card flex flex-col items-center justify-center p-5 rounded-2xl border border-border/50 hover:bg-muted/50 hover:border-primary/20 hover:scale-[1.03] transition-all group shadow-sm"
              >
                <div className={`p-3 rounded-xl ${shortcut.bg} mb-3 group-hover:scale-110 transition-transform`}>
                  <shortcut.icon className={`w-5 h-5 ${shortcut.color}`} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-tight">{shortcut.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
