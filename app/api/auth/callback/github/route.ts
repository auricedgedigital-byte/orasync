import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'

  if (!code) {
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?error=no_code`)
  }

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?error=config`)
  }

  const { createClient } = await import("@supabase/supabase-js")
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // Exchange code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`)
  }

  if (!data.session) {
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?error=no_session`)
  }

  // Create response with session cookie
  const response = NextResponse.redirect(`${request.nextUrl.origin}${next}`)
  response.cookies.set('supabase-auth-token', data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return response
}