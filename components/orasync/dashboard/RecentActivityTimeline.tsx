"use client"

import React from 'react'
import { Calendar, Send, MessageSquare, Star, Users } from 'lucide-react'

interface TimelineEvent {
  time: string
  event: string
  icon: React.ComponentType<any>
  label: string
  date: string
}

const events: TimelineEvent[] = [
  {
    time: '10:30 AM',
    event: 'Appointment Booked',
    icon: Calendar,
    label: 'Emily Davis',
    date: '28 Apr 2023'
  },
  {
    time: '11:15 AM',
    event: 'Campaign Sent',
    icon: Send,
    label: 'Summer Whitening',
    date: '18 Apr 2023'
  },
  {
    time: '12:00 PM',
    event: 'AI Chatbot Resolved Query',
    icon: MessageSquare,
    label: 'Payment Options',
    date: '13 Mar 2023'
  },
  {
    time: '1:45 PM',
    event: 'New Review',
    icon: Star,
    label: 'Michael Brown',
    date: '27 Apr 2023'
  },
  {
    time: '2:30 PM',
    event: 'Patient Check-in',
    icon: Users,
    label: 'David Miller',
    date: '(Future)'
  },
]

export default function RecentActivityTimeline() {
  return (
    <div className="space-y-4">
      {/* Connecting line with wave */}
      <div className="relative h-20 flex items-center">
        {/* SVG Wave Background */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" />
              <stop offset="50%" stopColor="rgb(6, 182, 212)" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" />
            </linearGradient>
          </defs>
          <path
            d="M 0,30 Q 150,10 300,30 T 600,30 T 900,30 T 1200,30"
            stroke="url(#waveGrad)"
            strokeWidth="2"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Timeline dots and labels */}
        <div className="relative w-full flex items-center justify-between px-4">
          {events.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Circle marker */}
                <div className="w-8 h-8 rounded-full bg-blue-500 border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-md mb-2 relative z-10">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>

                {/* Event box below */}
                <div className="mt-8 text-center bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-blue-100 dark:border-blue-900/30 min-w-max">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    {item.time}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    {item.event}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Additional event details below timeline */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-4 border-t border-border">
        {events.map((item, idx) => {
          const Icon = item.icon
          return (
            <div key={idx} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-xs font-semibold text-foreground">{item.time}</div>
              <div className="text-xs text-muted-foreground">{item.event.split(' ')[0]}</div>
              <div className="text-xs text-muted-foreground mt-1">({item.label})</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
