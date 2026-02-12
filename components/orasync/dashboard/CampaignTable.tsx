"use client"

import React from 'react'
import { Edit2, Pause2, Trash2 } from 'lucide-react'

interface Campaign {
  name: string
  status: 'Running' | 'Completed' | 'Draft' | 'Paused'
  progress: number
  sent: number
  opened: number
  clicks: number
}

const campaigns: Campaign[] = [
  {
    name: 'Summer Sale Email',
    status: 'Running',
    progress: 65,
    sent: 5000,
    opened: 2500,
    clicks: 1200
  },
  {
    name: 'Webinar Invitation',
    status: 'Completed',
    progress: 55,
    sent: 5000,
    opened: 1000,
    clicks: 650
  },
  {
    name: 'Customer Feedback',
    status: 'Draft',
    progress: 10,
    sent: 600,
    opened: 60,
    clicks: 25
  },
]

const statusStyles = {
  'Running': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300',
  'Paused': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
}

export default function CampaignTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground">Campaign Name</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Progress</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Sent</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Opened</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Clicks</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign, idx) => (
            <tr key={idx} className="border-b border-border hover:bg-secondary/50 transition-colors">
              <td className="py-4 px-4 text-foreground font-medium">{campaign.name}</td>
              <td className="py-4 px-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[campaign.status]}`}>
                  {campaign.status}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${campaign.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{campaign.progress}%</span>
                </div>
              </td>
              <td className="py-4 px-4 text-foreground">{campaign.sent.toLocaleString()}</td>
              <td className="py-4 px-4 text-foreground">{campaign.opened.toLocaleString()}</td>
              <td className="py-4 px-4 text-foreground">{campaign.clicks.toLocaleString()}</td>
              <td className="py-4 px-4">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-primary">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground">
                    <Pause2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
