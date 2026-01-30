import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  // Get all environment variables (mask sensitive ones)
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ SET" : "❌ MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ SET" : "❌ MISSING",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ SET" : "❌ MISSING",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "✅ SET" : "❌ MISSING",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "✅ SET" : "❌ MISSING",
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID ? "✅ SET" : "❌ MISSING",
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET ? "✅ SET" : "❌ MISSING",
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? "✅ SET" : "❌ MISSING",
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? "✅ SET" : "❌ MISSING",
    EMAIL_SERVER: process.env.EMAIL_SERVER ? "✅ SET" : "❌ MISSING",
    EMAIL_PORT: process.env.EMAIL_PORT ? "✅ SET" : "❌ MISSING", 
    EMAIL_USER: process.env.EMAIL_USER ? "✅ SET" : "❌ MISSING",
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? "✅ SET" : "❌ MISSING",
    EMAIL_FROM: process.env.EMAIL_FROM ? "✅ SET" : "❌ MISSING",
    NODE_ENV: process.env.NODE_ENV,
  }

  // Test Supabase connection
  let supabaseTest = "❌ NOT TESTED"
  let errorDetails = ""

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      
      // Test email sending by trying to get auth settings
      const { data: settings, error: settingsError } = await supabase.auth.updateUser({
        id: '00000000-0000-0000-0000-000000000000', // dummy UUID for test
        data: { test: true }
      })
      
      if (settingsError) {
        supabaseTest = "❌ EMAIL CONFIG ERROR"
        errorDetails = settingsError.message
      } else {
        supabaseTest = "✅ EMAIL CONFIG OK"
      }
    } else {
      supabaseTest = "❌ MISSING ENV VARS"
    }
  } catch (error) {
    supabaseTest = `❌ EXCEPTION: ${error instanceof Error ? error.message : String(error)}`
  }

  return NextResponse.json({
    environment: envVars,
    supabaseTest,
    errorDetails,
    timestamp: new Date().toISOString()
  })
}