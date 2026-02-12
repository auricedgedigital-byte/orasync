'use client'

import Header from '@/components/orasync/layout/Header'
import Sidebar from '@/components/orasync/layout/Sidebar'
import QuickActions from '@/components/orasync/layout/QuickActions'
import MetricCard from '@/components/orasync/cards/MetricCard'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Star, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp } from 'lucide-react'

const reviewFunnelData = [
  { stage: 'Jan', total: 950 },
  { stage: 'Feb', total: 1050 },
  { stage: 'Mar', total: 980 },
  { stage: 'Apr', total: 1200 },
  { stage: 'May', total: 1350 },
  { stage: 'Jun', total: 1500 },
]

const sentimentData = [
  { name: 'Positive', value: 80, fill: '#10B981' },
  { name: 'Neutral', value: 12, fill: '#6B7280' },
  { name: 'Negative', value: 8, fill: '#EF4444' },
]

const reputationManagementTools = [
  {
    title: 'Review funnel analytics',
    description: 'Track your review generation pipeline',
    icon: '📊',
  },
  {
    title: 'Sentiment analysis',
    description: 'AI-powered review sentiment tracking',
    icon: '😊',
  },
  {
    title: 'Review request settings',
    description: 'Customize review request templates',
    icon: '⚙️',
  },
  {
    title: 'Response templates',
    description: 'Pre-built responses for reviews',
    icon: '💬',
  },
]

const recentReviews = [
  {
    author: 'John Smith',
    rating: 5,
    text: 'Excellent service and professional staff. Highly recommend!',
    date: '2 days ago',
    platform: 'Google',
  },
  {
    author: 'Sarah Johnson',
    rating: 4,
    text: 'Great experience overall. Minor wait time but worth it.',
    date: '1 week ago',
    platform: 'Yelp',
  },
  {
    author: 'Michael Chen',
    rating: 5,
    text: 'The best dental clinic I have visited. Amazing treatment!',
    date: '2 weeks ago',
    platform: 'Google',
  },
  {
    author: 'Emma Williams',
    rating: 3,
    text: 'Good service but a bit expensive compared to other clinics.',
    date: '3 weeks ago',
    platform: 'Facebook',
  },
]

const renderStars = (rating: number) => {
  return '⭐'.repeat(rating)
}

export default function ReputationPage() {
  return (
    <div className="orasync-container">
      <Sidebar />
      <div className="orasync-main">
        <Header />
        <div className="orasync-content max-w-7xl">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Reputation Management</h1>
            <p className="text-muted-foreground">Monitor and manage your online reviews and reputation</p>
          </div>

          {/* Reputation Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              icon={Star}
              label="Total Reviews"
              value="3,542"
              trend={{ value: '+125 this month', direction: 'up' }}
              color="blue"
            />
            <MetricCard
              icon={ThumbsUp}
              label="Positive Reviews"
              value="2,850"
              subtitle="(80%)"
              color="green"
            />
            <MetricCard
              icon={ThumbsDown}
              label="Negative Reviews"
              value="450"
              subtitle="(12%)"
              color="orange"
            />
            <MetricCard
              icon={MessageSquare}
              label="Review Requests"
              value="6,100"
              color="purple"
            />
          </div>

          {/* Recent Activities Timeline */}
          <div className="mb-8 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activities</h3>
            <div className="space-y-3">
              {[
                { event: 'New 5-star review received', time: '10:30 AM', icon: '⭐' },
                { event: 'Response sent to negative review', time: '11:45 AM', icon: '💬' },
                { event: 'New 5-star review received', time: '2:15 PM', icon: '⭐' },
                { event: 'Review request sent to 50 patients', time: '3:00 PM', icon: '📧' },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 pb-3 border-b border-border last:border-b-0"
                >
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.event}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Review Funnel Analytics */}
            <div className="p-6 bg-card border border-border rounded-lg">
              <h4 className="font-semibold text-foreground mb-4">Review Funnel Analytics</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={reviewFunnelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Analysis */}
            <div className="p-6 bg-card border border-border rounded-lg">
              <h4 className="font-semibold text-foreground mb-4">Sentiment Analysis</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2 text-sm">
                {sentimentData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-semibold text-foreground ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reputation Management Tools */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-6">Reputation Management Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reputationManagementTools.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-card border border-border rounded-lg hover:shadow-lg hover:border-primary transition-all cursor-pointer"
                >
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <h4 className="font-semibold text-foreground mb-2">{tool.title}</h4>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">Recent Reviews</h3>
            <div className="space-y-4">
              {recentReviews.map((review, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{review.author}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{renderStars(review.rating)}</span>
                        <span>•</span>
                        <span>{review.platform}</span>
                        <span>•</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-3">{review.text}</p>
                  <button className="text-xs text-primary hover:underline font-medium">
                    Write Response
                  </button>
                </div>
              ))}
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
