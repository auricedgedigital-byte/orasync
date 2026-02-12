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
    <div className="relative">
      {/* Horizontal timeline line */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary to-transparent opacity-30"></div>

      {/* Timeline events */}
      <div className="flex items-center justify-between overflow-x-auto pb-8 px-2">
        {events.map((item, idx) => {
          const Icon = item.icon
          return (
            <div key={idx} className="flex flex-col items-center min-w-max mx-4">
              {/* Dot */}
              <div className="relative z-10 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg transform group-hover:scale-125 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Label below dot */}
              <div className="text-center mt-4 w-32">
                <div className="font-semibold text-sm text-foreground mb-1">{item.event}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">{item.date}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
