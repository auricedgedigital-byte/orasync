"use client"

import { useState, useEffect, useCallback } from "react"

// Dashboard data hooks for fetching real-time data from APIs

export interface DashboardStats {
  todayAppointments: number
  weeklyProduction: number
  productionChange: number
  newLeads: number
  patientSatisfaction: {
    rating: number
    total: number
    percentPositive: number
  }
}

export interface Appointment {
  id: string
  time: string
  patient: string
  treatment: string
  status: string
  color: string
}

export interface Activity {
  id: string
  message: string
  time: string
  icon: string
  color: string
}

export interface AIInsights {
  reactivationOpportunity: {
    patientCount: number
    estimatedRevenue: number
  }
  scheduleGap: {
    hasGap: boolean
    gapTime: string
    waitlistPatients: number
  }
  marketingEfficiency: number
}

export interface Credits {
  reactivation_emails: number
  reactivation_sms: number
  reactivation_whatsapp: number
  campaigns_started: number
  lead_upload_rows: number
  booking_confirms: number
  ai_suggestions: number
  seo_applies: number
  chatbot_installs: number
}

// Generic fetch helper
async function fetchWithAuth(url: string) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

// Hook for dashboard stats
export function useDashboardStats(clinicId: string | null) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = useCallback(async () => {
    if (!clinicId) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const data = await fetchWithAuth(`/api/dashboard/stats?clinicId=${clinicId}`)
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch stats"))
      console.error("Stats fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [clinicId])

  useEffect(() => {
    fetchStats()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}

// Hook for today's appointments
export function useTodayAppointments(clinicId: string | null) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAppointments = useCallback(async () => {
    if (!clinicId) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const data = await fetchWithAuth(`/api/appointments/today?clinicId=${clinicId}`)
      setAppointments(data.appointments || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch appointments"))
      console.error("Appointments fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [clinicId])

  useEffect(() => {
    fetchAppointments()
    
    // Refresh every minute
    const interval = setInterval(fetchAppointments, 60000)
    return () => clearInterval(interval)
  }, [fetchAppointments])

  return { appointments, loading, error, refetch: fetchAppointments }
}

// Hook for recent activity
export function useRecentActivity(clinicId: string | null, limit = 10) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchActivity = useCallback(async () => {
    if (!clinicId) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const data = await fetchWithAuth(`/api/activity/recent?clinicId=${clinicId}&limit=${limit}`)
      setActivities(data.activities || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch activity"))
      console.error("Activity fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [clinicId, limit])

  useEffect(() => {
    fetchActivity()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchActivity, 30000)
    return () => clearInterval(interval)
  }, [fetchActivity])

  return { activities, loading, error, refetch: fetchActivity }
}

// Hook for AI insights
export function useAIInsights(clinicId: string | null) {
  const [insights, setInsights] = useState<AIInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchInsights = useCallback(async () => {
    if (!clinicId) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const data = await fetchWithAuth(`/api/ai/insights?clinicId=${clinicId}`)
      setInsights(data.insights)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch AI insights"))
      console.error("AI insights fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [clinicId])

  useEffect(() => {
    fetchInsights()
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchInsights, 300000)
    return () => clearInterval(interval)
  }, [fetchInsights])

  return { insights, loading, error, refetch: fetchInsights }
}

// Hook for credits
export function useCredits(clinicId: string | null) {
  const [credits, setCredits] = useState<Credits | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCredits = useCallback(async () => {
    if (!clinicId) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const data = await fetchWithAuth(`/api/credits?clinicId=${clinicId}`)
      setCredits(data.credits)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch credits"))
      console.error("Credits fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [clinicId])

  useEffect(() => {
    fetchCredits()
  }, [fetchCredits])

  const refreshCredits = async () => {
    await fetchCredits()
  }

  return { credits, loading, error, refreshCredits }
}
