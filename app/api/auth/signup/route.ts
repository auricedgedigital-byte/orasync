import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, password, practiceName } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    // Use Supabase Auth for signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: practiceName || email.split('@')[0], // Use provided practice name or extract from email
        }
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