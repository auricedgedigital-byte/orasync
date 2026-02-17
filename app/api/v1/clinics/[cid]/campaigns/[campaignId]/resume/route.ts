import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("postgres") ? { rejectUnauthorized: false } : undefined,
})

// Resume campaign
export async function POST(
    request: NextRequest,
    { params }: { params: { cid: string; campaignId: string } }
) {
    try {
        const clinicId = params.cid
        const campaignId = params.campaignId

        await pool.query(
            `UPDATE campaigns 
       SET status = 'running', paused_reason = NULL
       WHERE id = $1 AND clinic_id = $2 AND status = 'paused'`,
            [campaignId, clinicId]
        )

        // TODO: Re-enqueue campaign job to worker system

        return NextResponse.json({ status: 'running' })

    } catch (error) {
        console.error('Resume campaign error:', error)
        return NextResponse.json(
            { error: 'Failed to resume campaign', details: (error as Error).message },
            { status: 500 }
        )
    }
}
