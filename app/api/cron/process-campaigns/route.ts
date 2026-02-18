import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { processCampaignJob } from '@/workers/campaignRunner'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("postgres") ? { rejectUnauthorized: false } : undefined,
})

/**
 * Universal Cron / Worker Processor
 * Pulls from the 'jobs' table and executes campaign logic via workers.
 */
export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'default-secret'

    if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // 1. Find pending jobs
        const jobsResult = await pool.query(
            `SELECT id, type, payload, clinic_id 
             FROM jobs 
             WHERE status = 'pending' 
             ORDER BY created_at ASC 
             LIMIT 20`
        )

        const jobs = jobsResult.rows
        const results = []

        if (jobs.length === 0) {
            return NextResponse.json({ status: 'idle', message: 'No pending jobs' })
        }

        // 2. Process each job
        for (const job of jobs) {
            try {
                if (job.type === 'campaign_start' || job.type === 'campaign_batch' || job.type === 'campaign_resume') {
                    await processCampaignJob(job.payload, job.id)
                    results.push({ jobId: job.id, type: job.type, status: 'processed' })
                } else {
                    results.push({ jobId: job.id, type: job.type, status: 'skipped', reason: 'Unknown job type' })
                }
            } catch (jobError) {
                console.error(`Error processing job ${job.id}:`, jobError)
                results.push({ jobId: job.id, type: job.type, status: 'error', reason: (jobError as Error).message })
            }
        }

        return NextResponse.json({
            processed: jobs.length,
            results
        })

    } catch (error) {
        console.error('Campaign cron error:', error)
        return NextResponse.json(
            { error: 'Failed to process jobs', details: (error as Error).message },
            { status: 500 }
        )
    }
}
