import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // In a real app, this would redirect to Google OAuth
  // For now, we'll simulate the OAuth flow
  const redirectUrl = new URL("/dashboard", request.url)
  return NextResponse.redirect(redirectUrl)
}
