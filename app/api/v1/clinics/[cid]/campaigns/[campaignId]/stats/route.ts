import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("postgres") ? { rejectUnauthorized: false } : undefined,
})

// Get campaign stats
export async function GET(
    request: NextRequest,
    { params }: { params: { cid: string; campaignId: string } }
) {
    try {
        const clinicId = params.cid
        const campaignId = params.campaignId

        const result = await pool.query(
            `SELECT 
        c.id,
        c.name,
        c.status,
        c.progress,
        c.total_recipients,
        c.sent_count,
        c.failed_count,
        c.reply_count,
        c.booking_count,
        c.started_at,
        c.completed_at,
        c.paused_reason,
        CASE 
          WHEN c.status = 'running' AND c.sent_count > 0 THEN
            NOW() + (
              (c.total_recipients - c.sent_count) * 
              (EXTRACT(EPOCH FROM (NOW() - c.started_at)) / c.sent_count) * 
              INTERVAL '1 second'
            )
          ELSE NULL
        END as estimated_completion
      FROM campaigns c
      WHERE c.id = $1 AND c.clinic_id = $2`,
            [campaignId, clinicId]
        )

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Campaign not found' },
                { status: 404 }
            )
        }

        const campaign = result.rows[0]

        // Calculate stats
        const stats = {
            ...campaign,
            progress_percentage: campaign.total_recipients > 0
                ? Math.round((campaign.sent_count / campaign.total_recipients) * 100)
                : 0,
            success_rate: campaign.sent_count > 0
                ? Math.round(((campaign.sent_count - campaign.failed_count) / campaign.sent_count) * 100)
                : 0,
            reply_rate: campaign.sent_count > 0
                ? Math.round((campaign.reply_count / campaign.sent_count) * 100)
                : 0,
            booking_rate: campaign.sent_count > 0
                ? Math.round((campaign.booking_count / campaign.sent_count) * 100)
                : 0
        }

        return NextResponse.json(stats)

    } catch (error) {
        console.error('Campaign stats error:', error)
        return NextResponse.json(
            { error: 'Failed to get campaign stats', details: (error as Error).message },
            { status: 500 }
        )
    }
}
