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

        // Trigger immediate processing by calling the cron endpoint
        try {
            const cronSecret = process.env.CRON_SECRET || 'default-secret'
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

            await fetch(`${baseUrl}/api/cron/process-campaigns`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${cronSecret}`
                }
            })
        } catch (triggerError) {
            console.error('Failed to trigger campaign processing:', triggerError)
            // Non-fatal - cron will pick it up eventually
        }

        return NextResponse.json({
            status: 'queued',
            estimated_time: '1-2 minutes'
        })

    } catch (error) {
        console.error('Run campaign error:', error)
        return NextResponse.json(
            { error: 'Failed to run campaign', details: (error as Error).message },
            { status: 500 }
        )
    }
}
