"use client"

import { Mail, MessageSquare, Check, Calendar, TrendingUp } from "lucide-react"

interface PerformanceCard {
  id: string
  label: string
  value: string | number
  icon: React.ReactNode
  gradient: string
  status?: string
  trend?: { value: string; positive: boolean }
}

interface PerformanceCardsProps {
  cards?: PerformanceCard[]
}

const defaultCards: PerformanceCard[] = [
  {
    id: "messages",
    label: "Total Messages",
    value: "2,450",
    icon: <Mail className="w-6 h-6" />,
    gradient: "from-blue-500 to-blue-600",
    trend: { value: "+150 this week", positive: true }
  },
  {
    id: "unread",
    label: "Unread Messages",
    value: "12",
    icon: <MessageSquare className="w-6 h-6" />,
    gradient: "from-purple-500 to-purple-600",
    status: "Action Required"
  },
  {
    id: "responses",
    label: "Responses",
    value: "1,800",
    icon: <Check className="w-6 h-6" />,
    gradient: "from-emerald-500 to-emerald-600",
    status: "80% Response Rate"
  },
  {
    id: "bookings",
    label: "Bookings",
    value: "320",
    icon: <Calendar className="w-6 h-6" />,
    gradient: "from-orange-500 to-orange-600",
    status: "25 Pending"
  }
]

export default function PerformanceCards({ cards = defaultCards }: PerformanceCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
          style={{
            backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            "--tw-gradient-from": card.gradient.split(" ")[1],
            "--tw-gradient-to": card.gradient.split(" ")[3],
          } as any}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90 dark:opacity-75`} />
          
          {/* Content */}
          <div className="relative z-10 space-y-3">
            {/* Icon and Label Row */}
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-sm text-white">
                {card.icon}
              </div>
              {card.trend && (
                <div className="text-xs font-semibold text-white/90 text-right">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  {card.trend.value}
                </div>
              )}
            </div>

            {/* Label */}
            <p className="text-sm font-medium text-white/80">{card.label}</p>

            {/* Value */}
            <p className="text-4xl font-bold text-white">{card.value}</p>

            {/* Status or Status Badge */}
            {card.status && (
              <div className="flex items-center gap-2 pt-2">
                <div className="w-2 h-2 rounded-full bg-white/60"></div>
                <p className="text-xs font-medium text-white/80">{card.status}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
