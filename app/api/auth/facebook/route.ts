import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Check environment variables first
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { message: "Authentication service not configured. Missing environment variables." },
      { status: 500 }
    )
  }

  const { createClient } = await import("@supabase/supabase-js")
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // Generate Facebook OAuth URL
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${request.nextUrl.origin}/auth/callback/facebook`
    }
  })

  if (error) {
    return NextResponse.json(
      { message: error.message || "OAuth setup failed" },
      { status: 500 }
    )
  }

  return NextResponse.redirect(data.url)
}