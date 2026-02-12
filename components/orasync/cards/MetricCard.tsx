'use client'

import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtitle?: string | ReactNode
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
  color?: 'blue' | 'green' | 'orange' | 'purple'
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
}

export default function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  color = 'blue',
}: MetricCardProps) {
  return (
    <div className="metric-card flex items-start gap-4">
      <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>

      <div className="flex-1">
        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
          {label}
        </div>
        <div className="stat-number">{value}</div>
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </div>
        )}
        {trend && (
          <div
            className={`text-xs font-semibold mt-2 ${
              trend.direction === 'up'
                ? 'text-green-600 dark:text-green-400'
                : trend.direction === 'down'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600'
            }`}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}{' '}
            {trend.value}
          </div>
        )}
      </div>
    </div>
  )
}
