"use client"

import { MessageSquare, Mail, Phone, MessageCircle, Globe } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface TimelineEvent {
  id: string
  time: string
  channel: "sms" | "email" | "whatsapp" | "facebook" | "website"
  message: string
}

interface TimelineProps {
  events?: TimelineEvent[]
}

const defaultEvents: TimelineEvent[] = [
  { id: "1", time: "10:45 AM", channel: "sms", message: "Hello, message is a..." },
  { id: "2", time: "10:20 AM", channel: "whatsapp", message: "Hi! do your message..." },
  { id: "3", time: "9:36 AM", channel: "email", message: "Send message omici..." },
  { id: "4", time: "6:28 AM", channel: "facebook", message: "Your messages anti..." },
  { id: "5", time: "2:35 PM", channel: "website", message: "Hello, Website Chat..." }
]

const chartData = [
  { time: "10:45", sms: 1, whatsapp: 0, email: 0, facebook: 0 },
  { time: "10:20", sms: 1, whatsapp: 1, email: 0, facebook: 0 },
  { time: "9:36", sms: 1, whatsapp: 1, email: 1, facebook: 0 },
  { time: "6:28", sms: 1, whatsapp: 1, email: 1, facebook: 1 },
  { time: "2:35", sms: 1, whatsapp: 1, email: 1, facebook: 1 }
]

const channelConfig = {
  sms: { icon: MessageSquare, color: "#3b82f6", label: "SMS", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  email: { icon: Mail, color: "#8b5cf6", label: "Email", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  whatsapp: { icon: MessageCircle, color: "#10b981", label: "WhatsApp", bgColor: "bg-green-100 dark:bg-green-900/30" },
  facebook: { icon: Phone, color: "#f59e0b", label: "Facebook", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  website: { icon: Globe, color: "#06b6d4", label: "Website Chat", bgColor: "bg-cyan-100 dark:bg-cyan-900/30" }
}

export default function Timeline({ events = defaultEvents }: TimelineProps) {
  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 p-6 backdrop-blur-sm">
        <h3 className="font-semibold text-foreground mb-4">Recent Message Timeline</h3>
        
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(209, 213, 219, 0.3)" />
            <XAxis dataKey="time" stroke="rgba(107, 114, 128, 0.5)" />
            <YAxis stroke="rgba(107, 114, 128, 0.5)" />
            <Tooltip 
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(71, 85, 105, 0.5)",
                borderRadius: "12px",
                color: "#e2e8f0"
              }}
            />
            <Line type="monotone" dataKey="sms" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="whatsapp" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="email" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="facebook" stroke="#f59e0b" strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Channel Activity List */}
      <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 p-6 backdrop-blur-sm">
        <h3 className="font-semibold text-foreground mb-4">Channel Activity</h3>
        
        <div className="space-y-3">
          {events.map((event) => {
            const channelInfo = channelConfig[event.channel]
            const ChannelIcon = channelInfo.icon
            
            return (
              <div
                key={event.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/30 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors border border-gray-200 dark:border-slate-600/30"
              >
                {/* Channel Icon */}
                <div className={`flex-shrink-0 p-3 rounded-lg ${channelInfo.bgColor}`}>
                  <ChannelIcon className="w-5 h-5" style={{ color: channelInfo.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{channelInfo.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{event.message}</p>
                </div>

                {/* Time */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs font-medium text-muted-foreground">{event.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
