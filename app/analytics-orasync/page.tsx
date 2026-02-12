'use client'

import Header from '@/components/orasync/layout/Header'
import Sidebar from '@/components/orasync/layout/Sidebar'
import QuickActions from '@/components/orasync/layout/QuickActions'
import MetricCard from '@/components/orasync/cards/MetricCard'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, MessageSquare, BarChart3, ThumbsUp, Calendar } from 'lucide-react'

const campaignPerformanceData = [
  { month: 'Jan', value: 45, target: 50 },
  { month: 'Feb', value: 52, target: 55 },
  { month: 'Mar', value: 48, target: 50 },
  { month: 'Apr', value: 61, target: 60 },
  { month: 'May', value: 55, target: 58 },
  { month: 'Jun', value: 67, target: 70 },
]

const marketingROIData = [
  { name: 'Profit', value: 45, fill: '#0066FF' },
  { name: 'ROI', value: 30, fill: '#00B4D8' },
  { name: 'Margin', value: 25, fill: '#90CAF9' },
]

const dailyOpsData = [
  { day: 'Mon', calls: 45, emails: 38 },
  { day: 'Tue', calls: 38, emails: 46 },
  { day: 'Wed', calls: 52, emails: 40 },
  { day: 'Thu', calls: 39, emails: 55 },
  { day: 'Fri', calls: 58, emails: 42 },
  { day: 'Sat', calls: 35, emails: 22 },
  { day: 'Sun', cells: 30, emails: 18 },
]

const activityTimeline = [
  { time: '10:30 AM', event: 'Campaign Winter Promo launched', icon: '📧' },
  { time: '11:15 AM', event: 'AI Chatbot handled 30 queries', icon: '🤖' },
  { time: '12:00 PM', event: '5 new reviews received', icon: '⭐' },
  { time: '1:45 PM', event: 'Email campaign: 10,000 sent', icon: '📮' },
  { time: '2:30 PM', event: '50 patient check-ins', icon: '✓' },
]

export default function AnalyticsPage() {
  return (
    <div className="orasync-container">
      <Sidebar />
      <div className="orasync-main">
        <Header />
        <div className="orasync-content max-w-7xl">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
            <p className="text-muted-foreground">Monitor your campaign performance and metrics</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              icon={Calendar}
              label="Total Bookings"
              value="4,230"
              trend={{ value: '+12.5% vs last month', direction: 'up' }}
              color="blue"
            />
            <MetricCard
              icon={TrendingUp}
              label="Reactivation Campaigns"
              value="85"
              subtitle="Active campaigns"
              color="green"
            />
            <MetricCard
              icon={MessageSquare}
              label="Messages"
              value="12,500"
              color="orange"
            />
            <MetricCard
              icon={ThumbsUp}
              label="Reviews"
              value="98%"
              subtitle="Positive"
              color="purple"
            />
          </div>

          {/* Recent Activities Timeline */}
          <div className="mb-8 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activities</h3>
            <div className="space-y-4">
              {activityTimeline.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 pb-4 border-b border-border last:border-b-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg flex-shrink-0">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.event}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Campaign Performance Chart */}
            <div className="lg:col-span-2 p-6 bg-card border border-border rounded-lg">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Campaign Performance (Last 30 Days)
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={campaignPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: 'hsl(var(--muted-foreground))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Marketing ROI */}
            <div className="p-6 bg-card border border-border rounded-lg">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Marketing ROI
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={marketingROIData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {marketingROIData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2 text-sm">
                {marketingROIData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-semibold text-foreground ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Operations Chart */}
          <div className="p-6 bg-card border border-border rounded-lg mb-8">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Daily Operations (Calls & Emails)
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyOpsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="calls"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  name="Calls"
                />
                <Bar
                  dataKey="emails"
                  fill="hsl(var(--chart-2))"
                  radius={[8, 8, 0, 0]}
                  name="Emails"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="fixed right-8 bottom-8 w-64 space-y-4">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
