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

// Mock dashboard data for demo/UI purposes
const mockDashboardData: DashboardData = {
  todayAppointments: 5,
  netProduction: 2450,
  newLeads: 12,
  patientSatisfaction: 4.8,
  appointments: [
    { time: "9:00 AM", patient: "John Smith", treatment: "Routine Checkup", status: "confirmed" },
    { time: "10:30 AM", patient: "Sarah Johnson", treatment: "Crown Fitting", status: "confirmed" },
    { time: "2:00 PM", patient: "Michael Brown", treatment: "Cleaning", status: "pending" },
  ],
  recentActivity: [
    { message: "New booking from Sarah Johnson", time: "2 hours ago", type: "booking" },
    { message: "Campaign 'Summer Special' reached 5k impressions", time: "4 hours ago", type: "campaign" },
    { message: "Patient review received - 5 stars", time: "6 hours ago", type: "review" },
  ]
}

export default function Content() {
  const router = useRouter()
  const { user, loading } = useUser()
  const data = mockDashboardData

  const handleCreateCampaign = () => router.push("/campaigns-orasync")
  const handleSendMessage = () => router.push("/unified-inbox")
  const handleBookAppointment = () => router.push("/appointments")

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
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
            Welcome back, <span className="text-primary font-semibold">{user?.user_metadata?.full_name || 'Alex Johnson'}</span>
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

}
