import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("postgres") ? { rejectUnauthorized: false } : undefined,
})

// Run campaign
export async function POST(
    request: NextRequest,
    { params }: { params: { cid: string; campaignId: string } }
) {
    try {
        const clinicId = params.cid
        const campaignId = params.campaignId

        // Update campaign status to 'running'
        await pool.query(
            `UPDATE campaigns 
       SET status = 'running', started_at = NOW(), progress = 0
       WHERE id = $1 AND clinic_id = $2 AND status = 'draft'`,
            [campaignId, clinicId]
        )

        // TODO: Enqueue campaign job to worker system
        // For now, we'll return success
        // In production, this would trigger: await campaignQueue.add('process-campaign', { campaignId })

        return NextResponse.json({
            status: 'queued',
            estimated_time: '5-10 minutes'
        })

    } catch (error) {
        console.error('Run campaign error:', error)
        return NextResponse.json(
            { error: 'Failed to run campaign', details: (error as Error).message },
            { status: 500 }
        )
    }
}
