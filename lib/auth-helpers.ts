import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Simple auth helper using base supabase client
export const createAuthClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }
  
  const cookieStore = cookies()
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookies: any[]) => {
        cookies.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        )
      },
    },
  })
}

// Check if user is authenticated (for server-side)
export async function isAuthenticated() {
  // For now, return false until env vars are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return false
  }
  
  try {
    const supabase = createAuthClient()
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  } catch (error) {
    console.error("Auth check error:", error)
    return false
  }
}

// Get current user (for server-side)
export async function getCurrentUser() {
  // For now, return null until env vars are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }
  
  try {
    const supabase = createAuthClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}