"use client"

import React from 'react'
import { TrendingUp, Zap, Mail, CheckCircle } from 'lucide-react'

interface Card {
  icon: React.ComponentType<any>
  label: string
  value: string
  status?: string
  color: string
}

const cards: Card[] = [
  {
    icon: TrendingUp,
    label: 'Total Campaigns',
    value: '42',
    status: '↗',
    color: 'bg-gradient-to-br from-blue-400 to-blue-500'
  },
  {
    icon: Zap,
    label: 'Active Campaigns',
    value: '8',
    status: '●',
    color: 'bg-gradient-to-br from-emerald-300 to-emerald-400'
  },
  {
    icon: Mail,
    label: 'Messages Sent',
    value: '15,400',
    status: '✉',
    color: 'bg-gradient-to-br from-blue-300 to-blue-400'
  },
  {
    icon: CheckCircle,
    label: 'Bookings',
    value: '315',
    status: '📅',
    color: 'bg-gradient-to-br from-orange-300 to-orange-400'
  },
]

export default function PerformanceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className={`${card.color} rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-all duration-200 group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm opacity-70">{card.status}</span>
            </div>
            <div className="text-xs font-semibold opacity-90 mb-1">{card.label}</div>
            <div className="text-4xl font-bold">{card.value}</div>
          </div>
        )
      })}
    </div>
  )
}
