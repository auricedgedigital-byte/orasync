"use client"

import React from 'react'
import OrasyncLayout from '@/components/orasync/OrasyncLayout'
import InboxDashboard from '@/components/orasync/dashboard/InboxDashboard'

export default function InboxOrasyncPage() {
  return (
    <OrasyncLayout>
      <InboxDashboard />
    </OrasyncLayout>
  )
}
