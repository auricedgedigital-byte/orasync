import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?message=signup_success`)
}