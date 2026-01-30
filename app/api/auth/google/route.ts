import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Redirect to NextAuth's Google signin
  const baseUrl = request.nextUrl.origin
  return NextResponse.redirect(`${baseUrl}/api/auth/signin/google`)
}
