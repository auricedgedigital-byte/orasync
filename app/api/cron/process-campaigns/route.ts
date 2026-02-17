import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("postgres") ? { rejectUnauthorized: false } : undefined,
})

// Simplified campaign batch processor for Vercel serverless
export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization')

    // Simple auth check - you should use a proper cron secret
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Find all running campaigns that need processing
        const campaignsResult = await pool.query(
            `SELECT id, clinic_id, total_recipients, sent_count, batch_size 
       FROM campaigns 
       WHERE status = 'running' 
       AND (sent_count < total_recipients OR sent_count IS NULL)
       LIMIT 10`
        )

        const campaigns = campaignsResult.rows
        const results = []

        for (const campaign of campaigns) {
            try {
                const { id: campaignId, clinic_id: clinicId, sent_count = 0, batch_size = 50 } = campaign

                // Get next batch of recipients
                // This is simplified - in production, you'd apply segment filters
                const recipientsResult = await pool.query(
                    `SELECT p.id, p.email, p.phone, p.first_name, p.last_name
           FROM patients p
           WHERE p.clinic_id = $1
           AND p.status != 'inactive'
           AND NOT EXISTS (
             SELECT 1 FROM campaign_messages cm
             WHERE cm.campaign_id = $2 AND cm.patient_id = p.id
           )
           LIMIT $3`,
                    [clinicId, campaignId, batch_size]
                )

                const recipients = recipientsResult.rows

                if (recipients.length === 0) {
                    // No more recipients - mark campaign as completed
                    await pool.query(
                        `UPDATE campaigns 
             SET status = 'completed', completed_at = NOW()
             WHERE id = $1`,
                        [campaignId]
                    )
                    results.push({ campaignId, status: 'completed', processed: 0 })
                    continue
                }

                // Process batch (simulate sending for now)
                let successCount = 0
                let failedCount = 0

                for (const recipient of recipients) {
                    const idempotencyKey = `${campaignId}-${recipient.id}`

                    try {
                        // Check if already sent (idempotency)
                        const existingMessage = await pool.query(
                            'SELECT id FROM campaign_messages WHERE idempotency_key = $1',
                            [idempotencyKey]
                        )

                        if (existingMessage.rows.length > 0) {
                            continue // Already sent
                        }

                        // TODO: Integrate with Twilio/SendGrid
                        const DEMO_MODE = !process.env.TWILIO_ACCOUNT_SID || process.env.DEMO_MODE === 'true'

                        // Insert message record
                        await pool.query(
                            `INSERT INTO campaign_messages (
                campaign_id, 
                patient_id, 
                channel, 
                status, 
                idempotency_key,
                send_status,
                send_attempts,
                created_at
              ) VALUES ($1, $2, 'sms', $3, $4, 'sent', 1, NOW())`,
                            [
                                campaignId,
                                recipient.id,
                                DEMO_MODE ? 'simulated' : 'sent',
                                idempotencyKey
                            ]
                        )

                        successCount++
                    } catch (error) {
                        console.error(`Failed to send to ${recipient.id}:`, error)

                        // Log failed attempt
                        await pool.query(
                            `INSERT INTO campaign_messages (
                campaign_id,
                patient_id,
                channel,
                status,
                idempotency_key,
                send_status,
                send_attempts,
                error_message,
                created_at
              ) VALUES ($1, $2, 'sms', 'failed', $3, 'failed', 1, $4, NOW())`,
                            [campaignId, recipient.id, idempotencyKey, (error as Error).message]
                        )

                        failedCount++
                    }
                }

                // Update campaign progress
                await pool.query(
                    `UPDATE campaigns 
           SET sent_count = sent_count + $1,
               failed_count = failed_count + $2,
               progress = CASE 
                 WHEN total_recipients > 0 
                 THEN ((sent_count + $1)::float / total_recipients * 100)::int
                 ELSE 0
               END
           WHERE id = $3`,
                    [successCount, failedCount, campaignId]
                )

                results.push({
                    campaignId,
                    processed: successCount + failedCount,
                    success: successCount,
                    failed: failedCount
                })

            } catch (campaignError) {
                console.error(`Error processing campaign ${campaign.id}:`, campaignError)
                results.push({
                    campaignId: campaign.id,
                    error: (campaignError as Error).message
                })
            }
        }

        return NextResponse.json({
            processed: campaigns.length,
            results
        })

    } catch (error) {
        console.error('Campaign cron error:', error)
        return NextResponse.json(
            { error: 'Failed to process campaigns', details: (error as Error).message },
            { status: 500 }
        )
    }
}
