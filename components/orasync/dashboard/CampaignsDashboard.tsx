"use client"

import React from 'react'
import { TrendingUp, CheckCircle, Mail, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const performanceData = [
  { month: 'Q3 Outreach', date: '28 Apr 2023', status: 'completed', icon: 'calendar' },
  { month: 'Holiday Promo', date: '18 Apr 2023', status: 'completed', icon: 'gift' },
  { month: 'New Product Launch', date: '17 Apr 2023', status: 'current', icon: 'rocket' },
  { month: 'Q3 Outreach', date: '18 Jun 2023', status: 'upcoming', icon: 'calendar' },
]

const chartData = [
  { x: 'Apr 28', y: 45 },
  { x: 'May 5', y: 58 },
  { x: 'May 12', y: 52 },
  { x: 'May 19', y: 65 },
  { x: 'May 26', y: 72 },
  { x: 'Jun 2', y: 68 },
]

export default function CampaignsDashboard() {
  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-60">↑</span>
          </div>
          <div className="text-sm opacity-90 font-medium mb-1">Total Campaigns</div>
          <div className="text-3xl font-bold">42</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-60">◉ Running</span>
          </div>
          <div className="text-sm opacity-90 font-medium mb-1">Active Campaigns</div>
          <div className="text-3xl font-bold">8</div>
        </div>

        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <Mail className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-sm opacity-90 font-medium mb-1">Messages Sent</div>
          <div className="text-3xl font-bold">15,400</div>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-sm opacity-90 font-medium mb-1">Bookings</div>
          <div className="text-3xl font-bold">315</div>
        </div>
      </div>

      {/* Recent Campaign Activity Timeline */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">Recent campaign activity</h3>
        
        {/* Timeline visualization */}
        <div className="relative mb-12 px-4">
          {/* Horizontal line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary to-transparent opacity-30"></div>
          
          {/* Timeline dots */}
          <div className="flex justify-between relative z-10">
            {performanceData.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-center mt-4 w-32">
                  <div className="font-semibold text-sm text-foreground mb-1">{item.month}</div>
                  <div className="text-xs text-muted-foreground">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="mt-8 p-4 bg-secondary rounded-lg">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="y"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">Campaign Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Campaign Name</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Progress</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Sent</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Opened</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Clicks</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-secondary/50">
                <td className="py-4 px-4 text-foreground font-medium">Summer Sale Email</td>
                <td className="py-4 px-4"><span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Running</span></td>
                <td className="py-4 px-4">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                  </div>
                </td>
                <td className="py-4 px-4 text-foreground">5,000</td>
                <td className="py-4 px-4 text-foreground">2,500</td>
                <td className="py-4 px-4 text-foreground">1,200</td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary/50">
                <td className="py-4 px-4 text-foreground font-medium">Webinar Invitation</td>
                <td className="py-4 px-4"><span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Completed</span></td>
                <td className="py-4 px-4">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '55%' }}></div>
                  </div>
                </td>
                <td className="py-4 px-4 text-foreground">5,000</td>
                <td className="py-4 px-4 text-foreground">1,000</td>
                <td className="py-4 px-4 text-foreground">650</td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary/50">
                <td className="py-4 px-4 text-foreground font-medium">Customer Feedback</td>
                <td className="py-4 px-4"><span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300">Draft</span></td>
                <td className="py-4 px-4">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '10%' }}></div>
                  </div>
                </td>
                <td className="py-4 px-4 text-foreground">600</td>
                <td className="py-4 px-4 text-foreground">60</td>
                <td className="py-4 px-4 text-foreground">25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
