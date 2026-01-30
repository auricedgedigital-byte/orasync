import { NextRequest, NextResponse } from "next/server"

// Demo mode - bypasses Supabase for testing
export async function POST(request: NextRequest) {
  try {
    const { email, password, practiceName } = await request.json()

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
      name: practiceName || email.split('@')[0],
      created_at: new Date().toISOString()
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Demo account created successfully",
      user: demoUser,
      session: {
        access_token: "demo_token_" + Date.now(),
        user: demoUser
      }
    })

  } catch (error) {
    console.error("Demo signup error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}