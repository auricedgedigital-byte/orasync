import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const code = searchParams.get("code")
    const error = searchParams.get("error")
    const next = searchParams.get("next") || "/dashboard"

    if (error) {
        console.error("OAuth error:", error)
        return NextResponse.redirect(
            new URL(`/auth/login?error=${encodeURIComponent(error)}`, req.url)
        )
    }

    if (!code) {
        return NextResponse.redirect(
            new URL(`/auth/login?error=no_code`, req.url)
        )
    }

    try {
        const session = await getServerSession(authOptions)
        
        if (session?.user) {
            return NextResponse.redirect(new URL(next, req.url))
        }

        return NextResponse.redirect(new URL(next, req.url))
    } catch (err) {
        console.error("Callback error:", err)
        return NextResponse.redirect(
            new URL(`/auth/login?error=callback_error`, req.url)
        )
    }
}
