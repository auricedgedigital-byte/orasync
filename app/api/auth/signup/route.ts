import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, practiceName } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    // Check environment variables first
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { message: "Authentication service not configured. Missing environment variables." },
        { status: 500 }
      )
    }

    // Dynamic import to avoid build issues
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Use Supabase Auth for signup with metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: practiceName || email.split('@')[0],
          practice_name: practiceName || email.split('@')[0],
        },
        emailRedirectTo: `${request.nextUrl.origin}/auth/callback/success`
      }
    })

    if (error) {
      return NextResponse.json(
        { message: error.message || "Signup failed" },
        { status: 400 }
      )
    }

    // Return user data
    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: data.user,
      session: data.session
    })

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}