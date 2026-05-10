import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get pathname of the request
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

  // Check if requested path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/callback",
    "/login",
    "/signup"
  ]

  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + "/")
  )

  // Allow all API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Allow debug routes
  if (pathname.startsWith('/debug')) {
    return NextResponse.next()
  }

  // If accessing protected route without auth, redirect to login
  if (isProtectedRoute) {
    const nextauthCookie = request.cookies.get('__Secure-next-auth.session-token') || 
                           request.cookies.get('next-auth.session-token')
    
    if (!nextauthCookie) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Add Trace-Id to response
  const response = NextResponse.next()
  const traceId = `trc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  response.headers.set('X-Trace-Id', traceId)

  return response
}

export const config = {
  matcher: [
    // Match all paths except for static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}