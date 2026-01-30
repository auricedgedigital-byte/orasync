import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  // Check if Supabase environment variables are set
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "NOT SET",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "NOT SET",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "NOT SET",
    NODE_ENV: process.env.NODE_ENV,
  }

  // Test Supabase connection
  let supabaseTest = "FAILED"
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      
      // Test a simple health check
      const { data, error } = await supabase.from('_health_check').select('*').limit(1)
      supabaseTest = error ? `ERROR: ${error.message}` : "SUCCESS"
    } else {
      supabaseTest = "MISSING ENV VARS"
    }
  } catch (error) {
    supabaseTest = `EXCEPTION: ${error instanceof Error ? error.message : String(error)}`
  }

  return NextResponse.json({
    environment: envVars,
    supabaseTest,
    timestamp: new Date().toISOString()
  })
}