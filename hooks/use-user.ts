"use client"

import { useEffect, useState } from "react"

// Mock user for demo/UI purposes
const mockUser = {
  id: "demo-user-123",
  email: "demo@orasync.dental",
  user_metadata: {
    full_name: "Alex Johnson",
    clinic_name: "Premier Dental Care",
  },
}

export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay for realistic feel
    const timer = setTimeout(() => {
      setUser(mockUser)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return { user, loading }
}
