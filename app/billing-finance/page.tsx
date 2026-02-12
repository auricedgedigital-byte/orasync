"use client"

import React from 'react'
import OrasyncLayout from '@/components/orasync/OrasyncLayout'
import BillingDashboard from '@/components/orasync/dashboard/BillingDashboard'

export default function BillingFinancePage() {
  return (
    <OrasyncLayout>
      <BillingDashboard />
    </OrasyncLayout>
  )
}
