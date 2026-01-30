"use client"

import { useRouter } from "next/navigation"
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

export default function Content() {
  const router = useRouter()

  const handleScheduleAppointment = () => router.push("/appointments")
  const handleAddPatient = () => router.push("/patient-crm")
  const handleSendCampaign = () => router.push("/patient-engagement")
  const handleViewAnalytics = () => router.push("/analytics-reporting")
  const handlePatientRecords = () => router.push("/patient-crm")
  const handleReviewRequests = () => router.push("/reputation-management")

  const appointmentDetails = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold">10</p>
        </div>
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold">2</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">Today's Appointments</h4>
        {[
          { time: "9:00 AM", patient: "Sarah Johnson", treatment: "Cleaning & Checkup" },
          { time: "10:30 AM", patient: "Mike Chen", treatment: "Root Canal" },
          { time: "2:00 PM", patient: "Emma Davis", treatment: "Teeth Whitening" },
        ].map((apt, i) => (
          <div key={i} className="p-3 rounded-lg border text-sm">
            <div className="font-medium">
              {apt.time} - {apt.patient}
            </div>
            <div className="text-muted-foreground">{apt.treatment}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const productionDetails = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="text-2xl font-bold">$4,250</p>
        </div>
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">This Week</p>
          <p className="text-2xl font-bold">$28,500</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">Production Breakdown</h4>
        {[
          { procedure: "Cleanings", amount: "$1,200" },
          { procedure: "Fillings", amount: "$1,500" },
          { procedure: "Crowns", amount: "$1,200" },
          { procedure: "Other", amount: "$350" },
        ].map((item, i) => (
          <div key={i} className="flex justify-between p-3 rounded-lg border text-sm">
            <span>{item.procedure}</span>
            <span className="font-semibold">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const newPatientsDetails = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">This Week</p>
          <p className="text-2xl font-bold">8</p>
        </div>
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold">28</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">New Patients This Week</h4>
        {[
          { name: "John Doe", date: "Mon, Oct 14" },
          { name: "Jane Smith", date: "Tue, Oct 15" },
          { name: "Robert Johnson", date: "Wed, Oct 16" },
          { name: "Emily Brown", date: "Thu, Oct 17" },
          { name: "Michael Davis", date: "Fri, Oct 18" },
          { name: "Sarah Wilson", date: "Fri, Oct 18" },
          { name: "David Martinez", date: "Sat, Oct 19" },
          { name: "Lisa Anderson", date: "Sat, Oct 19" },
        ].map((patient, i) => (
          <div key={i} className="flex justify-between p-3 rounded-lg border text-sm">
            <span>{patient.name}</span>
            <span className="text-muted-foreground">{patient.date}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const satisfactionDetails = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Average Rating</p>
          <p className="text-2xl font-bold">4.9/5</p>
        </div>
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Total Reviews</p>
          <p className="text-2xl font-bold">156</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">Recent Reviews</h4>
        {[
          { rating: "5★", review: "Excellent service and very professional staff!", author: "Sarah J." },
          { rating: "5★", review: "Best dental experience I've had!", author: "Mike C." },
          { rating: "4★", review: "Great treatment, friendly team", author: "Emma D." },
        ].map((item, i) => (
          <div key={i} className="p-3 rounded-lg border text-sm">
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-yellow-500">{item.rating}</span>
              <span className="text-muted-foreground text-xs">{item.author}</span>
            </div>
            <p className="text-foreground">{item.review}</p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Good morning, <span className="text-primary">Dr. Smith</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Here's the pulse of your practice at <span className="text-foreground">Smile Dental Studio</span> today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl px-5 h-11 font-semibold border-border/60 hover:bg-primary/5 hover:text-primary transition-all">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button className="rounded-xl px-5 h-11 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Users className="w-4 h-4 mr-2" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Today's Appointments"
          value="12"
          subtitle="+2 from yesterday"
          icon={Calendar}
          detailsContent={appointmentDetails}
          className="shadow-sm shadow-blue-500/5 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="Net Production"
          value="$4,250"
          subtitle="+12% from last week"
          icon={DollarSign}
          detailsContent={productionDetails}
          className="shadow-sm shadow-indigo-500/5 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="New Leads"
          value="8"
          subtitle="This week"
          icon={UserCheck}
          detailsContent={newPatientsDetails}
          className="shadow-sm shadow-purple-500/5 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="Patient Satisfaction"
          value="4.9"
          subtitle="98% Positive"
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
                {[
                  { time: "09:00 AM", patient: "Sarah Johnson", treatment: "Cleaning & Checkup", status: "confirmed", color: "green" },
                  { time: "10:30 AM", patient: "Mike Chen", treatment: "Root Canal Therapy", status: "in-progress", color: "blue" },
                  { time: "02:00 PM", patient: "Emma Davis", treatment: "Teeth Whitening", status: "confirmed", color: "green" },
                  { time: "03:30 PM", patient: "John Smith", treatment: "Crown Placement", status: "pending", color: "yellow" },
                ].map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-5">
                      <div className="text-sm font-bold text-muted-foreground/80 w-20">{appointment.time}</div>
                      <div>
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">{appointment.patient}</div>
                        <div className="text-xs text-muted-foreground font-medium">{appointment.treatment}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-${appointment.color}-500/10 text-${appointment.color}-600 border border-${appointment.color}-500/20`}>
                        {appointment.status}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
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
                {[
                  { message: "New appointment booked by Sarah Johnson", time: "5 min ago", icon: Calendar, color: "blue" },
                  { message: "Payment received from Mike Chen - $450", time: "12 min ago", icon: DollarSign, color: "green" },
                  { message: "5-star review received from Emma Davis", time: "1 hour ago", icon: Star, color: "yellow" },
                  { message: "New AI-filtered message in unified inbox", time: "2 hours ago", icon: Zap, color: "purple" },
                ].map((activity, index) => (
                  <div key={index} className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-${activity.color}-500/10 flex items-center justify-center flex-shrink-0 border border-${activity.color}-500/20`}>
                      <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-snug">{activity.message}</p>
                      <p className="text-[11px] text-muted-foreground font-medium mt-1 uppercase tracking-tight">{activity.time}</p>
                    </div>
                  </div>
                ))}
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
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Opportunity Detected</p>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    12 patients haven't visited in 6 months. AI predicts <span className="text-primary font-bold font-mono">~$2,400</span> in reactivation revenue.
                  </p>
                  <Button size="sm" className="w-full mt-4 rounded-lg bg-primary text-xs font-bold shadow-lg shadow-primary/10">
                    Run Reactivation
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border/60 shadow-sm">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Schedule Gap</p>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    You have an opening tomorrow at 11:30 AM. Should I notify 3 pending waitlist patients?
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 text-[10px] font-bold rounded-lg border-indigo-200 text-indigo-700 hover:bg-indigo-50">Ignore</Button>
                    <Button size="sm" className="flex-1 text-[10px] font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700">Notify AI</Button>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border/40 text-[11px] font-medium text-muted-foreground italic">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Marketing efficiency is up 22% this week.
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
