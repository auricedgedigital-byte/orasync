import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("postgres") ? { rejectUnauthorized: false } : undefined,
})

// Pause campaign
export async function POST(
    request: NextRequest,
    { params }: { params: { cid: string; campaignId: string } }
) {
    try {
        const clinicId = params.cid
        const campaignId = params.campaignId
        const { reason } = await request.json()

        await pool.query(
            `UPDATE campaigns 
       SET status = 'paused', paused_reason = $3
       WHERE id = $1 AND clinic_id = $2 AND status = 'running'`,
            [campaignId, clinicId, reason || 'Manual pause']
        )

        return NextResponse.json({ status: 'paused' })

    } catch (error) {
        console.error('Pause campaign error:', error)
        return NextResponse.json(
            { error: 'Failed to pause campaign', details: (error as Error).message },
            { status: 500 }
        )
    }
}
