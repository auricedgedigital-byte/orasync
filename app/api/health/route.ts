import { NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Force SSL bypass for Vercel/Neon
})

export async function GET() {
    try {
        // 1. Check Database
        const dbCheck = await pool.query("SELECT 1")

        // 2. Check Environment Variables
        const requiredEnv = [
            "DATABASE_URL",
            "PAYPAL_CLIENT_ID",
            "TOGETHER_API_KEY",
            "UPSTASH_REDIS_REST_URL"
        ]
        const missingEnv = requiredEnv.filter(env => !process.env[env])

        // 3. Response
        return NextResponse.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            services: {
                database: dbCheck.rowCount === 1 ? "connected" : "error",
                environment: missingEnv.length === 0 ? "complete" : `missing: ${missingEnv.join(", ")}`
            }
        })
    } catch (error) {
        console.error("Health check failed:", error)
        return NextResponse.json({
            status: "unhealthy",
            error: (error as Error).message,
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}
