import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/dashboard/",
    "/unified-inbox",
    "/patient-crm", 
    "/settings",
    "/analytics-reporting",
    "/campaign-builder",
    "/billing-finance",
    "/calendar-sync",
    "/practice-operations",
    "/appointments",
    "/chatbot",
    "/integrations",
    "/reputation",
    "/online-presence",
    "/website-builder",
    "/ads",
    "/ai-chatbot",
    "/hipaa-compliance"
  ]

  // Check if the requested path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/signup", 
    "/auth/forgot-password",
    "/login",
    "/signup"
  ]

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  )

  // If accessing protected route without auth, redirect to login
  if (isProtectedRoute) {
    const userCookie = request.cookies.get('supabase-auth-token')
    
    if (!userCookie) {
      const loginUrl = new URL("/auth/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
    matcher: [
        // Match all paths except for static files and API routes
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
}
