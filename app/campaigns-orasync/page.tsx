"use client"

import React from 'react'
import OrasyncLayout from '@/components/orasync/OrasyncLayout'
import CampaignsDashboard from '@/components/orasync/dashboard/CampaignsDashboard'

export default function CampaignsPage() {
  return (
    <OrasyncLayout>
      <CampaignsDashboard />
    </OrasyncLayout>
  )
}
