import { NextRequest, NextResponse } from "next/server"

// Demo mode - bypasses Supabase for testing
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    // Simple demo validation
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Create demo user
    const demoUser = {
      id: "demo_" + Date.now(),
      email: email,
      name: email.split('@')[0],
      created_at: new Date().toISOString()
    }

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      message: "Demo login successful",
      user: demoUser
    })

    response.cookies.set('supabase-auth-token', 'demo_token_' + Date.now(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error("Demo login error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}