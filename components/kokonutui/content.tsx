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
            Dashboard
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Welcome back, <span className="text-primary font-bold">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Doctor'}</span>.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-card/40 backdrop-blur-md p-2 rounded-2xl border border-border/50">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-black text-primary">5,000 Credits</span>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted/50">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Performance Section */}
      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Campaigns"
            value="42"
            subtitle="+12% from last month"
            icon={Megaphone}
            detailsContent={productionDetails}
            className="glass-card ring-1 ring-primary/5 hover:ring-primary/20 transition-all"
          />
          <MetricCard
            title="Active Campaigns"
            value="8"
            subtitle="Currently running"
            icon={Zap}
            detailsContent={productionDetails}
            className="glass-card ring-1 ring-green-500/5 hover:ring-green-500/20 transition-all"
          />
          <MetricCard
            title="Messages Sent"
            value="15,400"
            subtitle="98% delivery rate"
            icon={MessageSquare}
            detailsContent={productionDetails}
            className="glass-card ring-1 ring-blue-500/5 hover:ring-blue-500/20 transition-all"
          />
          <MetricCard
            title="Bookings"
            value="315"
            subtitle="Confirmed patients"
            icon={Calendar}
            detailsContent={appointmentDetails}
            className="glass-card ring-1 ring-purple-500/5 hover:ring-purple-500/20 transition-all"
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Timeline & Lists (Left 3 cols) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Recent Campaign Activity Visualization */}
          <Card className="glass-card rounded-[2rem] border-border/50 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-ai-secondary/5 opacity-50 pointer-events-none" />
            <CardHeader className="pb-4 pt-8 px-8">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                Recent campaign activity
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              {/* Simulated Chart Visualization to match design reference */}
              <div className="h-48 w-full relative mt-8 mb-4">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <path
                    d="M 0 100 Q 150 20 300 80 T 600 40 T 900 90 T 1200 30"
                    fill="none"
                    stroke="url(#line-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                  />
                  <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  {/* Nodes */}
                  <circle cx="20%" cy="40" r="6" fill="#7c3aed" className="animate-pulse" />
                  <circle cx="50%" cy="60" r="6" fill="#3b82f6" className="animate-pulse" />
                  <circle cx="80%" cy="85" r="6" fill="#10b981" className="animate-pulse" />
                </svg>
                {/* Labels matching reference */}
                <div className="absolute top-0 left-[18%] bg-card/80 backdrop-blur-md px-3 py-1 rounded-lg border border-border/50 text-[10px] font-bold">
                  Q3 Outreach <br /><span className="text-muted-foreground">15 Jun 2023</span>
                </div>
                <div className="absolute top-10 left-[48%] bg-card/80 backdrop-blur-md px-3 py-1 rounded-lg border border-border/50 text-[10px] font-bold">
                  Holiday Promo <br /><span className="text-muted-foreground">18 Apr 2023</span>
                </div>
                <div className="absolute top-0 left-[78%] bg-card/80 backdrop-blur-md px-3 py-1 rounded-lg border border-border/50 text-[10px] font-bold">
                  New Product Launch <br /><span className="text-muted-foreground">27 Apr 2023</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Table (simplified to match design reference) */}
          <Card className="glass-card rounded-[2rem] border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead className="bg-muted/30 border-b border-border/40">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Campaign Name</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Progress</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Sent</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Opened</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {[
                    { name: 'Summer Sale Email', status: 'Running', progress: '65%', sent: '5,000', opened: '2,500' },
                    { name: 'Webinar Invitation', status: 'Completed', progress: '100%', sent: '5,000', opened: '1,000' },
                    { name: 'Customer Feedback', status: 'Draft', progress: '10%', sent: '600', opened: '60' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-muted/20 transition-colors">
                      <td className="px-8 py-6 font-bold text-sm">{row.name}</td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${row.status === 'Running' ? 'bg-green-500/10 text-green-500' :
                          row.status === 'Completed' ? 'bg-primary/10 text-primary' :
                            'bg-muted text-muted-foreground'
                          }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 font-medium text-xs text-muted-foreground">{row.progress}</td>
                      <td className="px-6 py-6 font-bold text-sm">{row.sent}</td>
                      <td className="px-6 py-6 font-bold text-sm text-foreground/70">{row.opened}</td>
                      <td className="px-8 py-6">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted/50">
                          <ChevronRight className="h-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Action Sidebar (Right 1 col) */}
        <div className="space-y-8">
          <Card className="glass-card rounded-[2rem] border-border/50 overflow-hidden group">
            <CardHeader className="pb-4 pt-8 px-6">
              <CardTitle className="text-lg font-black">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button className="w-full h-14 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:bg-primary/5 text-foreground justify-start px-6 group/btn transition-all" onClick={handleSendCampaign}>
                <div className="p-2 bg-primary/10 rounded-xl mr-4 group-hover/btn:bg-primary/20">
                  <Megaphone className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold">Create Campaign</span>
              </Button>
              <Button className="w-full h-14 rounded-2xl bg-card border border-border/60 hover:border-blue-500/40 hover:bg-blue-500/5 text-foreground justify-start px-6 group/btn transition-all">
                <div className="p-2 bg-blue-500/10 rounded-xl mr-4 group-hover/btn:bg-blue-500/20">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                </div>
                <span className="font-bold">Send Message</span>
              </Button>
              <Button className="w-full h-14 rounded-2xl bg-card border border-border/60 hover:border-purple-500/40 hover:bg-purple-500/5 text-foreground justify-start px-6 group/btn transition-all" onClick={handleScheduleAppointment}>
                <div className="p-2 bg-purple-500/10 rounded-xl mr-4 group-hover/btn:bg-purple-500/20">
                  <Calendar className="w-4 h-4 text-purple-500" />
                </div>
                <span className="font-bold">Book Appointment</span>
              </Button>
            </CardContent>
          </Card>

          {/* AI Status or Notifications */}
          <Card className="glass-card rounded-[2rem] border-primary/20 bg-primary/5 group">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Nova AI Status</span>
              </div>
              <p className="text-sm font-bold leading-relaxed text-foreground/80">
                "I've identified 12 dormant patients who are likely to book a check-up if reached today via SMS."
              </p>
              <div className="pt-2">
                <Button size="sm" className="rounded-xl text-xs font-black px-6 bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  Engage Leads
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
