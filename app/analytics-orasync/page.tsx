"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AnalyticsOrasyncPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/analytics')
  }, [router])
  
  return null
}
