"use client"

import React from 'react'
import OrasyncLayout from '@/components/orasync/OrasyncLayout'
import ReputationDashboard from '@/components/orasync/dashboard/ReputationDashboard'

export default function ReputationManagementPage() {
  return (
    <OrasyncLayout>
      <ReputationDashboard />
    </OrasyncLayout>
  )
}
