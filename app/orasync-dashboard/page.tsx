"use client"

import React from 'react'
import OrasyncLayout from '@/components/orasync/OrasyncLayout'
import PerformanceCards from '@/components/orasync/dashboard/PerformanceCards'
import RecentActivityTimeline from '@/components/orasync/dashboard/RecentActivityTimeline'
import CampaignTable from '@/components/orasync/dashboard/CampaignTable'

export default function OrasyncDashboard() {
  return (
    <OrasyncLayout>
      <div className="space-y-8">
        {/* Performance Cards Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Performance</h2>
          <PerformanceCards />
        </div>

        {/* Recent Activity Section */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Recent campaign activity</h3>
          <RecentActivityTimeline />
        </div>

        {/* Campaign Management Table */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Campaign Management</h3>
          <CampaignTable />
        </div>
      </div>
    </OrasyncLayout>
  )
}
