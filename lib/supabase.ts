import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
}

// Client for client-side usage (public)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side usage (bypass RLS)
// Only use this in trusted server-side API routes
export const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null
