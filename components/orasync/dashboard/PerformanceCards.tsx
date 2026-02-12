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
    status: '↑',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: Zap,
    label: 'Active Campaigns',
    value: '8',
    status: '◉ Running',
    color: 'from-emerald-400 to-emerald-600'
  },
  {
    icon: Mail,
    label: 'Messages Sent',
    value: '15,400',
    color: 'from-purple-400 to-purple-600'
  },
  {
    icon: CheckCircle,
    label: 'Bookings',
    value: '315',
    color: 'from-orange-400 to-orange-600'
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
            className={`bg-gradient-to-br ${card.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-4">
              <Icon className="w-8 h-8 opacity-80 group-hover:scale-110 transition-transform" />
              <span className="text-xl opacity-60">{card.status || ''}</span>
            </div>
            <div>
              <div className="text-sm opacity-90 font-medium mb-1">{card.label}</div>
              <div className="text-3xl font-bold">{card.value}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
