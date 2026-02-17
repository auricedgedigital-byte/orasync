import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    // Logic for Google OAuth callback
    // This will handle code exchange and user profile sync
    return NextResponse.redirect(new URL("/dashboard", req.url))
}
