"use client"

import React, { useState } from 'react'
import { Mail, MessageCircle, CheckCircle, Calendar, Send } from 'lucide-react'

interface MessageItem {
  id: string
  sender: string
  channel: 'SMS' | 'WhatsApp' | 'Email' | 'Facebook' | 'Website Chat'
  preview: string
  time: string
  status: 'New' | 'Replied' | 'Pending'
  avatar?: string
}

const messageStats = [
  {
    icon: Mail,
    label: 'Total Messages',
    value: '2,450',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: Mail,
    label: 'Unread Messages',
    value: '12',
    color: 'from-purple-400 to-purple-600',
    status: 'Action Required'
  },
  {
    icon: CheckCircle,
    label: 'Responses',
    value: '1,800',
    color: 'from-emerald-400 to-emerald-600',
    status: '90% Response Rate'
  },
  {
    icon: Calendar,
    label: 'Bookings',
    value: '320',
    color: 'from-orange-400 to-orange-600',
    status: '25 Pending'
  },
]

const channels = [
  { name: 'SMS', icon: '💬', color: 'bg-blue-100 dark:bg-blue-900/30' },
  { name: 'WhatsApp', icon: '🟢', color: 'bg-green-100 dark:bg-green-900/30' },
  { name: 'Email', icon: '✉️', color: 'bg-purple-100 dark:bg-purple-900/30' },
  { name: 'Facebook', icon: '📘', color: 'bg-blue-100 dark:bg-blue-900/30' },
  { name: 'Website Chat', icon: '💻', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
]

const messages: MessageItem[] = [
  {
    id: '1',
    sender: 'Alex Johnson',
    channel: 'SMS',
    preview: 'Hello from the name dts set your message?',
    time: '10:45 AM',
    status: 'New'
  },
  {
    id: '2',
    sender: 'WhatsApp',
    channel: 'WhatsApp',
    preview: 'Hi! Is in your message...',
    time: '19:03 AM',
    status: 'Replied'
  },
  {
    id: '3',
    sender: 'Email Remin',
    channel: 'Email',
    preview: 'Your enx message is curring the thread.',
    time: 'Yesterday',
    status: 'Replied'
  },
  {
    id: '4',
    sender: 'Facebook',
    channel: 'Facebook',
    preview: 'Thanks br so; your message but just semoue with @sr...',
    time: 'Oct 25',
    status: 'Pending'
  },
  {
    id: '5',
    sender: 'Website Chat',
    channel: 'Website Chat',
    preview: 'Pro osciligted with your message, vie app boosted and th...',
    time: 'Oct 25',
    status: 'Pending'
  },
]

export default function InboxDashboard() {
  const [activeChannel, setActiveChannel] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {/* Message Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {messageStats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8 opacity-80" />
              </div>
              <div className="text-sm opacity-90 font-medium mb-1">{stat.label}</div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              {stat.status && (
                <div className="text-xs opacity-80">{stat.status}</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Channel Timeline */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-8">Recent Message Timeline</h3>
        
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {channels.map((channel) => (
            <button
              key={channel.name}
              onClick={() => setActiveChannel(channel.name)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                activeChannel === channel.name
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : `${channel.color} text-foreground hover:shadow-md`
              }`}
            >
              <span className="text-lg">{channel.icon}</span>
              <span className="font-medium text-sm">{channel.name}</span>
            </button>
          ))}
        </div>

        {/* Message Feed */}
        <div className="space-y-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent opacity-30"></div>

            {/* Messages */}
            {messages.map((message, idx) => (
              <div key={idx} className="flex gap-4 pb-4 relative z-10">
                {/* Timeline dot */}
                <div className="mt-2">
                  <div className="w-5 h-5 rounded-full bg-primary border-4 border-card shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                  </div>
                </div>

                {/* Message card */}
                <div className="flex-1 bg-secondary rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-foreground">{message.sender}</div>
                      <div className="text-xs text-muted-foreground">{message.channel}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-muted-foreground">{message.time}</div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        message.status === 'New' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        message.status === 'Replied' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {message.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{message.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unified Threads */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">Unified Threads</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Message</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.slice(0, 3).map((msg, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 px-4 text-foreground font-medium">{msg.sender}</td>
                  <td className="py-4 px-4 text-foreground text-xs line-clamp-1">{msg.preview}</td>
                  <td className="py-4 px-4 text-muted-foreground text-xs">{msg.time}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      msg.status === 'New' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      msg.status === 'Replied' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-primary hover:text-primary/80 transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
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
