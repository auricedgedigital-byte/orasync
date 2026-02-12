"use client"

import { Star, ThumbsUp, ThumbsDown, MessageSquare, Settings, Send, BarChart3, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ReputationOverviewProps {}

const reviewData = [
  { date: "Oct 20", reviews: 12, rating: 4.8 },
  { date: "Oct 21", reviews: 18, rating: 4.9 },
  { date: "Oct 22", reviews: 15, rating: 4.7 },
  { date: "Oct 23", reviews: 22, rating: 4.9 },
  { date: "Oct 24", reviews: 28, rating: 5.0 },
  { date: "Oct 25", reviews: 19, rating: 4.8 },
]

const sentimentData = [
  { name: "Positive", value: 2850, fill: "#10b981" },
  { name: "Neutral", value: 450, fill: "#f59e0b" },
  { name: "Negative", value: 50, fill: "#ef4444" }
]

const timelineEvents = [
  { type: "positive", message: "New 5-star review received", time: "Today" },
  { type: "neutral", message: "Response sent to negative review", time: "Yesterday" },
  { type: "positive", message: "New 5-star review received", time: "Oct 23" },
]

export default function ReputationOverview({}: ReputationOverviewProps) {
  const totalReviews = 3350
  const positiveReviews = 2850
  const negativeReviews = 50
  const avgRating = 4.8
  const responseRate = 98

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Reputation Management</h1>
          <p className="text-muted-foreground text-lg">Monitor and manage your online reputation</p>
        </div>
        <Button className="rounded-xl px-6 h-11 font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
          <Send className="w-4 h-4 mr-2" />
          Request Reviews
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reviews */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium opacity-80">Total Reviews</p>
            <MessageSquare className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-4xl font-bold">{totalReviews.toLocaleString()}</p>
        </div>

        {/* Positive Reviews */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium opacity-80">Positive Reviews</p>
            <ThumbsUp className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-4xl font-bold">{positiveReviews.toLocaleString()}</p>
          <p className="text-xs opacity-80 mt-2">({((positiveReviews / totalReviews) * 100).toFixed(0)}%)</p>
        </div>

        {/* Negative Reviews */}
        <div className="rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium opacity-80">Negative Reviews</p>
            <ThumbsDown className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-4xl font-bold">{negativeReviews}</p>
          <p className="text-xs opacity-80 mt-2">({((negativeReviews / totalReviews) * 100).toFixed(1)}%)</p>
        </div>

        {/* Average Rating */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium opacity-80">Average Rating</p>
            <Star className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-4xl font-bold">{avgRating}</p>
          <p className="text-xs opacity-80 mt-2">out of 5.0</p>
        </div>
      </div>

      {/* Reviews Timeline & Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 p-6 backdrop-blur-sm">
          <h3 className="font-bold text-lg text-foreground mb-6">Review Activity Trend</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reviewData}>
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
              <Line type="monotone" dataKey="reviews" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Pie Chart */}
        <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 p-6 backdrop-blur-sm">
          <h3 className="font-bold text-lg text-foreground mb-6">Sentiment Analysis</h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
            </RechartsPieChart>
          </ResponsiveContainer>

          <div className="space-y-3 mt-4">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 p-6 backdrop-blur-sm">
          <h3 className="font-bold text-lg text-foreground mb-6">Recent Reputation Events</h3>

          <div className="space-y-4">
            {timelineEvents.map((event, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-slate-700/30 last:border-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  event.type === 'positive' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  event.type === 'neutral' ? 'bg-amber-100 dark:bg-amber-900/30' :
                  'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {event.type === 'positive' ? (
                    <ThumbsUp className={`w-5 h-5 ${
                      event.type === 'positive' ? 'text-emerald-600' :
                      event.type === 'neutral' ? 'text-amber-600' :
                      'text-red-600'
                    }`} />
                  ) : event.type === 'neutral' ? (
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                  ) : (
                    <ThumbsDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{event.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Management Actions */}
        <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 p-6 backdrop-blur-sm space-y-6">
          <div>
            <h3 className="font-bold text-lg text-foreground mb-4">Review Request Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-700/30 border border-gray-200 dark:border-slate-700/30">
                <p className="text-sm font-medium text-foreground">Auto Request After Appointment</p>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-700/30 border border-gray-200 dark:border-slate-700/30">
                <p className="text-sm font-medium text-foreground">Email Reminders</p>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-700/30 border border-gray-200 dark:border-slate-700/30">
                <p className="text-sm font-medium text-foreground">SMS Alerts for New Reviews</p>
                <input type="checkbox" className="w-4 h-4" />
              </div>
            </div>

            <Button className="w-full mt-4 rounded-lg font-semibold bg-primary hover:bg-primary/90">
              <Settings className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-700/30 pt-6">
            <h4 className="font-semibold text-foreground mb-3">Response Templates</h4>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start rounded-lg text-left border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30">
                <span className="text-sm">Thank You Template</span>
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-lg text-left border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30">
                <span className="text-sm">Address Concern Template</span>
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-lg text-left border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30">
                <span className="text-sm">Follow-up Template</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
