"use client"

import { useState } from "react"
import { Megaphone, Edit2, Pause, Trash2, TrendingUp, Mail, Eye, Click } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface Campaign {
  id: string
  name: string
  status: "running" | "completed" | "draft" | "paused"
  progress: number
  sent: number
  opened: number
  clicks: number
  startDate: string
}

interface CampaignsOverviewProps {
  campaigns?: Campaign[]
}

const activityData = [
  { date: "28 Apr", sent: 2400, opens: 1400, clicks: 960 },
  { date: "18 Apr", sent: 1398, opens: 9800, clicks: 2290 },
  { date: "27 Apr", sent: 2400, opens: 1400, clicks: 960 },
  { date: "13 Mar", sent: 2210, opens: 2290, clicks: 2000 },
]

const defaultCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Sale",
    status: "running",
    progress: 65,
    sent: 5000,
    opened: 2500,
    clicks: 1200,
    startDate: "Oct 20"
  },
  {
    id: "2",
    name: "Webinar Invitation",
    status: "completed",
    progress: 55,
    sent: 5000,
    opened: 1000,
    clicks: 650,
    startDate: "Sep 15"
  },
  {
    id: "3",
    name: "Customer Feedback",
    status: "draft",
    progress: 10,
    sent: 600,
    opened: 60,
    clicks: 25,
    startDate: "Oct 30"
  }
]

const statusConfig = {
  running: { label: "Running", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
  completed: { label: "Completed", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  draft: { label: "Draft", color: "bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600" },
  paused: { label: "Paused", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800" }
}

export default function CampaignsOverview({ campaigns = defaultCampaigns }: CampaignsOverviewProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)

  const performanceCards = [
    { label: "Total Campaigns", value: campaigns.length, icon: Megaphone, color: "from-blue-500 to-blue-600" },
    { label: "Active Campaigns", value: campaigns.filter(c => c.status === "running").length, icon: TrendingUp, color: "from-emerald-500 to-emerald-600" },
    { label: "Messages Sent", value: campaigns.reduce((acc, c) => acc + c.sent, 0).toLocaleString(), icon: Mail, color: "from-purple-500 to-purple-600" },
    { label: "Total Bookings", value: "315", icon: Click, color: "from-orange-500 to-orange-600" }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Campaigns</h1>
          <p className="text-muted-foreground text-lg">Manage and monitor your marketing campaigns</p>
        </div>
        <Button className="rounded-xl px-6 h-11 font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
          <Megaphone className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceCards.map((card, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90 dark:opacity-75`} />
            <div className="relative z-10 space-y-3">
              <div className="p-3 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-sm text-white w-fit">
                <card.icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-white/80">{card.label}</p>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 p-6 backdrop-blur-sm">
        <h3 className="font-bold text-lg text-foreground mb-6">Recent Campaign Activity</h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(209, 213, 219, 0.3)" />
            <XAxis dataKey="date" stroke="rgba(107, 114, 128, 0.5)" />
            <YAxis stroke="rgba(107, 114, 128, 0.5)" />
            <Tooltip 
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(71, 85, 105, 0.5)",
                borderRadius: "12px",
                color: "#e2e8f0"
              }}
            />
            <Line type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="opens" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="clicks" stroke="#f59e0b" strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700/30">
          <h3 className="font-bold text-lg text-foreground">Campaign Management</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-slate-700/30 bg-gray-50 dark:bg-slate-700/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Campaign Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Progress</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Sent</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Opened</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Clicks</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700/30">
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  onClick={() => setSelectedCampaign(campaign.id)}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{campaign.startDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={`${statusConfig[campaign.status].color} border`}>
                      {statusConfig[campaign.status].label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24 h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${campaign.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{campaign.progress}%</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{campaign.sent.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{campaign.opened.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{campaign.clicks.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50">
                        <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50">
                        <Pause className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50">
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
