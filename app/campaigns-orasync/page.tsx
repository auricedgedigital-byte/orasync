'use client'

import Header from '@/components/orasync/layout/Header'
import Sidebar from '@/components/orasync/layout/Sidebar'
import QuickActions from '@/components/orasync/layout/QuickActions'
import MetricCard from '@/components/orasync/cards/MetricCard'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Megaphone, Zap, Mail, Calendar, Edit2, Pause, Trash2 } from 'lucide-react'

const performanceData = [
  { date: 'Apr 10', value: 120 },
  { date: 'Apr 12', value: 150 },
  { date: 'Apr 15', value: 200 },
  { date: 'Apr 18', value: 280 },
  { date: 'Apr 22', value: 350 },
  { date: 'Apr 25', value: 420 },
]

const campaigns = [
  {
    name: 'Summer Sale',
    status: 'Active',
    progress: 75,
    sent: 5000,
    opened: 2500,
    clicks: 1200,
  },
  {
    name: 'Product Launch',
    status: 'Paused',
    progress: 40,
    sent: 3200,
    opened: 1000,
    clicks: 650,
  },
  {
    name: 'Feedback Survey',
    status: 'Completed',
    progress: 100,
    sent: 2100,
    opened: 900,
    clicks: 450,
  },
  {
    name: 'Spring Recall',
    status: 'Active',
    progress: 60,
    sent: 4500,
    opened: 2200,
    clicks: 980,
  },
]

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Active': 'status-active',
    'Completed': 'status-completed',
    'Paused': 'status-draft',
    'Draft': 'status-draft',
  }
  return colors[status] || 'status-draft'
}

export default function CampaignsPage() {
  return (
    <div className="orasync-container">
      <Sidebar />
      <div className="orasync-main">
        <Header />
        <div className="orasync-content max-w-7xl">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Campaigns</h1>
            <p className="text-muted-foreground">Manage and monitor your marketing campaigns</p>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              icon={Megaphone}
              label="Total Campaigns"
              value="42"
              trend={{ value: '+5 this month', direction: 'up' }}
              color="blue"
            />
            <MetricCard
              icon={Zap}
              label="Active Campaigns"
              value="8"
              subtitle="Running"
              color="green"
            />
            <MetricCard
              icon={Mail}
              label="Messages Sent"
              value="15,400"
              color="orange"
            />
            <MetricCard
              icon={Calendar}
              label="Bookings"
              value="315"
              color="purple"
            />
          </div>

          {/* Campaign Activity Chart */}
          <div className="mb-8 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">Recent Campaign Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
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
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Campaigns Table */}
          <div className="p-6 bg-card border border-border rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-6">Campaign Management</h3>
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
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-secondary transition-colors">
                      <td className="py-4 px-4 font-medium text-foreground">{campaign.name}</td>
                      <td className="py-4 px-4">
                        <span className={`status-badge ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-32">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${campaign.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-foreground">{campaign.progress}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-foreground">{campaign.sent.toLocaleString()}</td>
                      <td className="py-4 px-4 text-foreground">{campaign.opened.toLocaleString()}</td>
                      <td className="py-4 px-4 text-foreground">{campaign.clicks.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-primary" />
                          </button>
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Pause className="w-4 h-4 text-orange-500" />
                          </button>
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
