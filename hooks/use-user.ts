"use client"

import { useSession } from "next-auth/react"

export function useUser() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  
  // Return the user from the session
  // In our next-auth config, we've added clinic_id to the user object
  return { 
    user: session?.user ?? null, 
    loading,
    status
  }
}
