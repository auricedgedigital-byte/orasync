"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ReputationOrasyncPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/reputation-management')
  }, [router])
  
  return null
}
