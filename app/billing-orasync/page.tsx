"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function BillingOrasyncPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/billing-finance')
  }, [router])
  
  return null
}
