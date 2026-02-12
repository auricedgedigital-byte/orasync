'use client'

import { useState } from 'react'
import Header from '@/components/orasync/layout/Header'
import Sidebar from '@/components/orasync/layout/Sidebar'
import QuickActions from '@/components/orasync/layout/QuickActions'
import AIProposalModal from '@/components/orasync/modals/AIProposalModal'
import MetricCard from '@/components/orasync/cards/MetricCard'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Calendar, Mail, MessageSquare, TrendingUp, Users, Clock, Plus, Sparkles } from 'lucide-react'
import Image from 'next/image'

const activityData = [
  { time: '10:30 AM', event: 'Appointment Booked', icon: '📅', user: 'Emily Davis' },
  { time: '11:15 AM', event: 'Campaign Sent', icon: '📧', user: 'Summer Whitening' },
  { time: '12:00 PM', event: 'AI Chatbot Resolved Query', icon: '🤖', user: 'Payment Options' },
  { time: '1:45 PM', event: 'New Review', icon: '⭐', user: 'Michael Brown' },
  { time: '2:30 PM', event: 'Patient Check-in', icon: '👤', user: 'David Miller' },
]

const campaignPerformanceData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 61 },
  { month: 'May', value: 55 },
  { month: 'Jun', value: 67 },
]

const roiData = [
  { name: 'Profit', value: 45, color: '#0066FF' },
  { name: 'ROI', value: 30, color: '#00B4D8' },
  { name: 'Margin', value: 25, color: '#90CAF9' },
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

export default function OrasyncDashboard() {
  const [showAIModal, setShowAIModal] = useState(false)

  return (
    <div className="orasync-container">
      <AIProposalModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} />
      <Sidebar />
      <div className="orasync-main">
        <Header />
        <div className="orasync-content max-w-7xl">
          {/* User Profile Section */}
          <div className="flex items-center justify-between mb-8 p-6 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                DAS
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Dr. Anya Sharma</h2>
                <p className="text-sm text-muted-foreground">Cosmetic Dental Care</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">Available Credits</div>
              <div className="text-3xl font-bold text-primary">450</div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <MetricCard
              icon={Calendar}
              label="Total Bookings"
              value="285"
              subtitle="+15% This Month"
              color="blue"
            />
            <MetricCard
              icon={TrendingUp}
              label="Reactivation Campaigns"
              value="8"
              subtitle={<div className="text-xs"><div>Active: Spring Recall</div><div>75% Complete</div></div>}
              color="green"
            />
            <MetricCard
              icon={Mail}
              label="Messages"
              value="5"
              subtitle="New Messages"
              color="orange"
            />
            <MetricCard
              icon={MessageSquare}
              label="Reviews"
              value="4.8/5"
              subtitle={<div className="text-xs flex items-center gap-1">{'⭐'.repeat(4)}⭐</div>}
              color="purple"
            />
            <div className="metric-card flex flex-col items-center justify-center text-center">
              <Plus className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-semibold text-foreground">Create<br/>Campaign</span>
            </div>
          </div>

          {/* Recent Activities Timeline */}
          <div className="mb-8 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activities</h3>
            <div className="space-y-4">
              {activityData.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 pb-4 border-b border-border last:border-b-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-lg">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{activity.event}</div>
                    <div className="text-xs text-muted-foreground">{activity.user}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Campaign Performance */}
            <div className="lg:col-span-1 p-6 bg-card border border-border rounded-lg">
              <h4 className="font-semibold text-foreground mb-4">Campaign Performance</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={campaignPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Marketing ROI */}
            <div className="lg:col-span-1 p-6 bg-card border border-border rounded-lg">
              <h4 className="font-semibold text-foreground mb-4">Marketing ROI</h4>
              <ResponsiveContainer width="100%" height={200}>
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
            <div className="lg:col-span-1 p-6 bg-card border border-border rounded-lg">
              <h4 className="font-semibold text-foreground mb-4">Daily Operations</h4>
              <ResponsiveContainer width="100%" height={200}>
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

          {/* Quick Actions Right Sidebar */}
          <div className="fixed right-8 bottom-8 w-64 space-y-4">
            <QuickActions />
            
            {/* AI Proposal Button */}
            <button
              onClick={() => setShowAIModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-400/50 transition-all transform hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              Get AI Proposal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
