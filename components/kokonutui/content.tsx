"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { useEffect, useState } from "react"
import { MessageSquare, Send, Calendar, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import PerformanceCards from "@/components/orasync/dashboard/performance-cards"
import Timeline from "@/components/orasync/dashboard/timeline"

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

  const handleCreateCampaign = () => router.push("/campaigns-orasync")
  const handleSendMessage = () => router.push("/unified-inbox")
  const handleBookAppointment = () => router.push("/appointments")

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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, <span className="text-primary font-semibold">{user?.user_metadata?.full_name || user?.email || 'Doctor'}</span>
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button 
            className="rounded-xl px-6 h-11 font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
            onClick={handleCreateCampaign}
          >
            <Zap className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
          <Button 
            className="rounded-xl px-6 h-11 font-semibold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
            onClick={handleSendMessage}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          <Button 
            className="rounded-xl px-6 h-11 font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            onClick={handleBookAppointment}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Performance Cards */}
      <PerformanceCards />

      {/* Timeline Section */}
      <Timeline />
    </div>
  )

  const productionDetails = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="text-2xl font-bold">${data.netProduction.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">This Week</p>
          <p className="text-2xl font-bold">${(data.netProduction * 7).toLocaleString()}</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">Production Overview</h4>
        <p className="text-muted-foreground text-sm">Track your practice revenue and growth metrics</p>
      </div>
    </div>
  )

  const newPatientsDetails = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">This Week</p>
          <p className="text-2xl font-bold">{data.newLeads}</p>
        </div>
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold">{data.newLeads * 4}</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">New Patient Acquisition</h4>
        <p className="text-muted-foreground text-sm">New leads and patient conversion metrics</p>
      </div>
    </div>
  )

  const satisfactionDetails = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Average Rating</p>
          <p className="text-2xl font-bold">{data.patientSatisfaction}/5</p>
        </div>
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Total Reviews</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">Patient Satisfaction</h4>
        <p className="text-muted-foreground text-sm">Track patient reviews and satisfaction scores</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Welcome back, <span className="text-primary">{user?.user_metadata?.full_name || user?.email || 'Doctor'}</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Here's the pulse of your practice at <span className="text-foreground">{user?.user_metadata?.clinic_name || 'Your Clinic'}</span> today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl px-5 h-11 font-semibold border-border/60 hover:bg-primary/5 hover:text-primary transition-all" onClick={handleScheduleAppointment}>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button className="rounded-xl px-5 h-11 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" onClick={handleAddPatient}>
            <Users className="w-4 h-4 mr-2" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Today's Appointments"
          value={data.todayAppointments.toString()}
          subtitle="Scheduled today"
          icon={Calendar}
          detailsContent={appointmentDetails}
          className="shadow-sm shadow-blue-500/5 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="Net Production"
          value={`$${data.netProduction.toLocaleString()}`}
          subtitle="Today's revenue"
          icon={DollarSign}
          detailsContent={productionDetails}
          className="shadow-sm shadow-indigo-500/5 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="New Leads"
          value={data.newLeads.toString()}
          subtitle="This week"
          icon={UserCheck}
          detailsContent={newPatientsDetails}
          className="shadow-sm shadow-purple-500/5 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="Patient Satisfaction"
          value={data.patientSatisfaction.toFixed(1)}
          subtitle="Average rating"
          icon={Star}
          detailsContent={satisfactionDetails}
          className="shadow-sm shadow-yellow-500/5 hover:shadow-md transition-shadow"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schedule & Activity (Left/Center) */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  Daily Schedule
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5">
                  View full calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {data.appointments.length > 0 ? (
                  data.appointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className="text-sm font-bold text-muted-foreground/80 w-20">{appointment.time}</div>
                        <div>
                          <div className="font-bold text-foreground group-hover:text-primary transition-colors">{appointment.patient}</div>
                          <div className="text-xs text-muted-foreground font-medium">{appointment.treatment}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border/40">
                          {appointment.status}
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled for today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                Recent Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-6">
                {data.recentActivity.length > 0 ? (
                  data.recentActivity.map((activity, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 border border-border/40">
                        <Activity className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-snug">{activity.message}</p>
                        <p className="text-[11px] text-muted-foreground font-medium mt-1 uppercase tracking-tight">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Sidebar (Right) - Matching uploaded_media_4 */}
        <div className="space-y-8">
          <Card className="rounded-2xl border-primary/20 bg-primary/[0.02] shadow-xl shadow-primary/5 overflow-hidden">
            <div className="bg-ai-gradient p-5 text-white">
              <div className="flex items-center gap-2.5 mb-1">
                <Zap className="w-5 h-5 fill-white" />
                <h3 className="font-bold tracking-tight">AI Assistant Insights</h3>
              </div>
              <p className="text-[11px] font-medium opacity-80 uppercase tracking-widest">Optimizing your practice</p>
            </div>
            <CardContent className="p-5 space-y-5">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-background border border-border/60 shadow-sm">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Getting Started</p>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    Welcome to Orasync! Start by adding your first patient or setting up your clinic profile.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1 text-[10px] font-bold rounded-lg" onClick={handleAddPatient}>
                      Add Patient
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-[10px] font-bold rounded-lg">
                      Setup Profile
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border/60 shadow-sm">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">AI Assistant</p>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    Your AI assistant is ready to help optimize your practice and engage patients.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 text-[10px] font-bold rounded-lg border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                      Learn More
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border/40 text-[11px] font-medium text-muted-foreground italic">
                    <Zap className="w-3.5 h-3.5" />
                    AI-powered features are now enabled for your clinic.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/40 shadow-sm p-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Quick Shortcuts</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "New Campaign", icon: Megaphone },
                { label: "Patient CRM", icon: Users },
                { label: "Reports", icon: TrendingUp },
                { label: "Finances", icon: DollarSign },
              ].map((shortcut, i) => (
                <button key={i} className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/40 hover:bg-primary/5 hover:border-primary/20 transition-all group">
                  <shortcut.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                  <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-tighter">{shortcut.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
