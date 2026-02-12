"use client"

import React from 'react'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ThumbsUp, ThumbsDown, MessageSquare, Settings } from 'lucide-react'

const reviewTrendData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 61 },
  { month: 'May', value: 55 },
  { month: 'Jun', value: 67 },
]

const sentimentData = [
  { name: 'Positive', value: 2850, color: '#0066FF' },
  { name: 'Neutral', value: 450, color: '#00B4D8' },
  { name: 'Negative', value: 142, color: '#FF6B6B' },
]

const reputationMetrics = [
  {
    icon: MessageSquare,
    label: 'Total Reviews',
    value: '3,542',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: ThumbsUp,
    label: 'Positive Reviews',
    value: '2,850 (80%)',
    color: 'from-emerald-400 to-emerald-600'
  },
  {
    icon: ThumbsDown,
    label: 'Negative Reviews',
    value: '450 (12%)',
    color: 'from-orange-400 to-orange-600'
  },
  {
    icon: Settings,
    label: 'Review Requests',
    value: '6,100',
    color: 'from-purple-400 to-purple-600'
  },
]

const reputationActivities = [
  {
    event: 'New 5-star review received',
    status: 'completed',
    date: '27 Apr 2023',
    icon: '⭐'
  },
  {
    event: 'Response sent to negative review',
    status: 'completed',
    date: '26 Apr 2023',
    icon: '📝'
  },
  {
    event: 'New 5-star review received',
    status: 'pending',
    date: '25 Apr 2023',
    icon: '⭐'
  },
  {
    event: 'Response sent to negative review',
    status: 'pending',
    date: '24 Apr 2023',
    icon: '📝'
  },
  {
    event: 'Response sent to negative review',
    status: 'pending',
    date: '23 Apr 2023',
    icon: '📝'
  },
  {
    event: 'Response sent to negative review',
    status: 'completed',
    date: '22 Apr 2023',
    icon: '📝'
  },
]

export default function ReputationDashboard() {
  return (
    <div className="space-y-8">
      {/* Reputation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reputationMetrics.map((metric, idx) => {
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
              <div className="text-3xl font-bold">{metric.value}</div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Trend */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Review funnel analytics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={reviewTrendData}>
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

        {/* Sentiment Analysis */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Sentiment analysis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {sentimentData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  {item.name}
                </span>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activities</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent opacity-30"></div>

          {/* Timeline events */}
          <div className="space-y-4 relative z-10">
            {reputationActivities.map((activity, idx) => (
              <div key={idx} className="flex gap-4">
                {/* Timeline dot */}
                <div className="mt-2">
                  <div className="w-5 h-5 rounded-full bg-primary border-4 border-card shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                  </div>
                </div>

                {/* Activity card */}
                <div className="flex-1 bg-secondary rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{activity.icon}</span>
                      <div>
                        <div className="font-semibold text-foreground">{activity.event}</div>
                        <div className="text-xs text-muted-foreground">{activity.date}</div>
                      </div>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      activity.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {activity.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reputation Management Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Request Settings */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Review request settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <div className="font-medium text-foreground">Review request</div>
                <div className="text-xs text-muted-foreground">Management settings</div>
              </div>
              <input type="checkbox" defaultChecked className="w-6 h-6 rounded accent-primary" />
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <div className="font-medium text-foreground">Review request</div>
                <div className="text-xs text-muted-foreground">Preview requests settings</div>
              </div>
              <input type="checkbox" defaultChecked className="w-6 h-6 rounded accent-primary" />
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <div className="font-medium text-foreground">Request settings</div>
                <div className="text-xs text-muted-foreground">General settings</div>
              </div>
              <input type="checkbox" className="w-6 h-6 rounded accent-primary" />
            </div>
          </div>
        </div>

        {/* Response Templates */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Response templates</h3>
          <div className="space-y-3">
            <div className="p-4 bg-secondary rounded-lg hover:shadow-md transition-all cursor-pointer">
              <div className="font-medium text-foreground mb-1">Response template 1</div>
              <div className="text-sm text-muted-foreground line-clamp-2">Thank you for your feedback. We appreciate your business...</div>
            </div>
            <div className="p-4 bg-secondary rounded-lg hover:shadow-md transition-all cursor-pointer">
              <div className="font-medium text-foreground mb-1">Response template 2</div>
              <div className="text-sm text-muted-foreground line-clamp-2">We're sorry to hear about your experience. We'd love to make it right...</div>
            </div>
            <div className="p-4 bg-secondary rounded-lg hover:shadow-md transition-all cursor-pointer">
              <div className="font-medium text-foreground mb-1">Response template 3</div>
              <div className="text-sm text-muted-foreground line-clamp-2">Thank you for choosing us! Your satisfaction is our priority...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
