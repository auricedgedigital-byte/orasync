import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
}

// Client for client-side usage (public)
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side usage (bypass RLS)
// Only use this in trusted server-side API routes
export const supabaseAdmin = supabaseServiceKey
    ? createSupabaseClient(supabaseUrl, supabaseServiceKey)
    : null

// Helper function to get appropriate client
export function getClient() {
  return supabaseAdmin || supabase
}