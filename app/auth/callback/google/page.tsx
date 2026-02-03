"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      // Create Supabase client only on client side
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Let Supabase handle the OAuth callback automatically
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Auth callback error:", error)
        router.push(`/auth/login?error=${encodeURIComponent(error.message)}`)
        return
      }

      // Wait a moment for session to be fully restored
      setTimeout(() => {
        if (data.session) {
          const next = searchParams.get('next') || '/dashboard'
          router.replace(next)
        } else {
          // If no session after timeout, redirect to login
          router.push('/auth/login?error=no_session')
        }
      }, 500) // Small delay to ensure session is restored
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}