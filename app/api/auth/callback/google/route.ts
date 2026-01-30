import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // Exchange code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("Google OAuth callback error:", error)
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`)
  }

  if (!data.session) {
    console.error("No session in Google callback data")
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?error=no_session`)
  }

  console.log("Google OAuth successful, session:", data.session)

  // Create response with session cookie
  const response = NextResponse.redirect(`${request.nextUrl.origin}${next}`)
  
  // Set proper access token cookie for middleware
  response.cookies.set('supabase-access-token', data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  // Also set refresh token for session renewal
  if (data.session.refresh_token) {
    response.cookies.set('supabase-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    })
  }

  return response
}

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?error=config`)
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // Exchange code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`)
  }

  if (!data.session) {
    console.error("No session in callback data")
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?error=no_session`)
  }

  console.log("OAuth successful, session:", data.session)

  // Create response with session cookie
  const response = NextResponse.redirect(`${request.nextUrl.origin}${next}`)
  
  // Set auth cookie for middleware
  response.cookies.set('supabase-access-token', data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  // Also set refresh token
  if (data.session.refresh_token) {
    response.cookies.set('supabase-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    })
  }

  return response
}