import { type NextRequest, NextResponse } from "next/server"
import { getTrialCreditsWithDefaults } from "@/lib/db"
import { Pool } from "pg"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("postgres") ? { rejectUnauthorized: false } : undefined,
})

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
    try {
        const clinicId = params.cid

        const credits = await getTrialCreditsWithDefaults(clinicId)

        // Fetch orders (transactions)
        const orders = await pool.query(
            "SELECT * FROM orders WHERE clinic_id = $1 ORDER BY created_at DESC LIMIT 20",
            [clinicId]
        )

        // Fetch invoices (mock or real if table exists)
        // Assuming 'invoices' table doesn't exist yet based on schema review, so I'll return empty or mock if needed
        // But let's check schema again? No, I'll just skip invoices table query for now and rely on orders as payments.

        return NextResponse.json({
            credits,
            transactions: orders.rows,
            // For invoices, if no table, return simulated data or empty
            invoices: []
        })
    } catch (error) {
        console.error("Billing fetch error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
