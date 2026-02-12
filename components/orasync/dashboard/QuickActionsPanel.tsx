"use client"

import React from 'react'
import { Plus, Send, Calendar } from 'lucide-react'

interface Action {
  icon: React.ComponentType<any>
  label: string
  href: string
  color: string
}

const actions: Action[] = [
  {
    icon: Plus,
    label: 'Create Campaign',
    href: '/campaigns',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: Send,
    label: 'Send Message',
    href: '/inbox',
    color: 'from-purple-400 to-purple-600'
  },
  {
    icon: Calendar,
    label: 'Book Appointment',
    href: '/appointments',
    color: 'from-emerald-400 to-emerald-600'
  },
]

export default function QuickActionsPanel() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground px-2 mb-4">Quick Actions</h3>
      {actions.map((action, idx) => {
        const Icon = action.icon
        return (
          <a
            key={idx}
            href={action.href}
            className={`flex items-center justify-center gap-2 py-4 px-4 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r ${action.color}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm text-center leading-tight">{action.label}</span>
          </a>
        )
      })}
    </div>
  )
}
