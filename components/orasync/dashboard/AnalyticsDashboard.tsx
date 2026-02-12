"use client"

import React, { useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Mail, Calendar } from 'lucide-react'

const performanceData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 61 },
  { month: 'May', value: 55 },
  { month: 'Jun', value: 67 },
]

const dailyOpsData = [
  { day: 'Mon', calls: 24, emails: 18 },
  { day: 'Tue', calls: 18, emails: 26 },
  { day: 'Wed', calls: 22, emails: 20 },
  { day: 'Thu', calls: 19, emails: 25 },
  { day: 'Fri', calls: 28, emails: 22 },
  { day: 'Sat', calls: 15, emails: 12 },
  { day: 'Sun', calls: 10, emails: 8 },
]

const roiData = [
  { name: 'Profit', value: 45, color: '#0066FF' },
  { name: 'ROI', value: 30, color: '#00B4D8' },
  { name: 'Margin', value: 25, color: '#90CAF9' },
]

const performanceMetrics = [
  {
    icon: TrendingUp,
    label: 'Total Bookings',
    value: '4,230',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: Users,
    label: 'Reactivation Campaigns',
    value: '85',
    color: 'from-emerald-400 to-emerald-600',
    status: '85 Active'
  },
  {
    icon: Mail,
    label: 'Messages',
    value: '12,500',
    color: 'from-purple-400 to-purple-600'
  },
  {
    icon: TrendingUp,
    label: 'Reviews',
    value: '98% Positive',
    color: 'from-orange-400 to-orange-600'
  },
]

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${metric.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8 opacity-80" />
              </div>
              <div className="text-sm opacity-90 font-medium mb-1">{metric.label}</div>
              <div className="text-3xl font-bold mb-2">{metric.value}</div>
              {metric.status && (
                <div className="text-xs opacity-80">{metric.status}</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-2">
        {['7d', '30d', '90d', '1y'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeRange === range
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            {range === '7d' && 'Last 7 days'}
            {range === '30d' && 'Last 30 days'}
            {range === '90d' && 'Last 90 days'}
            {range === '1y' && '1 Year'}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Performance */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border p-6 shadow-sm">
          <h4 className="font-semibold text-foreground mb-4">Campaign Performance (Last 30 Days)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Marketing ROI */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border p-6 shadow-sm">
          <h4 className="font-semibold text-foreground mb-4">Marketing ROI vs. Spend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={roiData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {roiData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Operations */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border p-6 shadow-sm">
          <h4 className="font-semibold text-foreground mb-4">Daily Operations (Calls & Emails)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyOpsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              <Bar dataKey="emails" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics Table */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">Key Performance Indicators</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Metric</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Current</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Previous</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Change</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="py-4 px-4 text-foreground font-medium">Conversion Rate</td>
                <td className="py-4 px-4 text-foreground">12.5%</td>
                <td className="py-4 px-4 text-foreground">10.2%</td>
                <td className="py-4 px-4 text-emerald-600 font-semibold">+2.3%</td>
                <td className="py-4 px-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Improving
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="py-4 px-4 text-foreground font-medium">Email Open Rate</td>
                <td className="py-4 px-4 text-foreground">28.4%</td>
                <td className="py-4 px-4 text-foreground">26.1%</td>
                <td className="py-4 px-4 text-emerald-600 font-semibold">+2.3%</td>
                <td className="py-4 px-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Improving
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="py-4 px-4 text-foreground font-medium">Click-through Rate</td>
                <td className="py-4 px-4 text-foreground">5.2%</td>
                <td className="py-4 px-4 text-foreground">5.8%</td>
                <td className="py-4 px-4 text-red-600 font-semibold">-0.6%</td>
                <td className="py-4 px-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                    Declining
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="py-4 px-4 text-foreground font-medium">Appointment Rate</td>
                <td className="py-4 px-4 text-foreground">18.7%</td>
                <td className="py-4 px-4 text-foreground">16.2%</td>
                <td className="py-4 px-4 text-emerald-600 font-semibold">+2.5%</td>
                <td className="py-4 px-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Improving
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
