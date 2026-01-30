export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path*",
        "/unified-inbox/:path*",
        "/patient-crm/:path*",
        "/settings/:path*",
        "/analytics-reporting/:path*",
        "/campaign-builder/:path*",
        "/billing-finance/:path*",
        "/calendar-sync/:path*",
        "/practice-operations/:path*",
    ],
}
