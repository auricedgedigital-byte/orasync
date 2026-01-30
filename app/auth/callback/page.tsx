"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      // Create Supabase client only on client side
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Get session from URL (Supabase handles this automatically with PKCE)
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Auth callback error:", error)
        router.push(`/auth/login?error=${encodeURIComponent(error.message)}`)
        return
      }

      // Wait a moment for session to be fully restored
      setTimeout(() => {
        if (data.session) {
          router.replace("/dashboard")
        } else {
          // Try to get session again (handles URL fragment auth)
          supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
              router.replace("/dashboard")
            } else {
              router.push('/auth/login?error=no_session')
            }
          })
        }
      }, 1000) // Wait for session to settle
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}