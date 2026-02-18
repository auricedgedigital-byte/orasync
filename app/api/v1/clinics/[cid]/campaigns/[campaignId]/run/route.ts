import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { enqueueJob } from '@/lib/db'

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

        // 1. Enqueue initialization job
        const jobResult = await enqueueJob(clinicId, "campaign_start", {
            campaign_id: campaignId,
            clinic_id: clinicId
        })

        if (!jobResult.success) {
            throw new Error(jobResult.error || "Failed to enqueue campaign start job")
        }

        // 2. Trigger immediate processing via cron endpoint (optional optimization)
        try {
            const cronSecret = process.env.CRON_SECRET || 'default-secret'
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

            fetch(`${baseUrl}/api/cron/process-campaigns`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${cronSecret}`
                }
            }).catch(e => console.error("Cron trigger error:", e))
        } catch (triggerError) {
            console.error('Failed to trigger campaign processing:', triggerError)
        }

        return NextResponse.json({
            status: 'queued',
            job_id: jobResult.jobId,
            estimated_time: 'Ready for initialization'
        })

    } catch (error) {
        console.error('Run campaign error:', error)
        return NextResponse.json(
            { error: 'Failed to run campaign', details: (error as Error).message },
            { status: 500 }
        )
    }
}
