import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("postgres") ? { rejectUnauthorized: false } : undefined,
})

export async function GET(
    request: NextRequest,
    { params }: { params: { cid: string } }
) {
    try {
        const clinicId = params.cid

        // Fetch inbox statistics in parallel
        const [totalMessagesResult, unreadResult, responsesResult, bookingsResult, channelBreakdown] = await Promise.all([
            // Total messages (all threads)
            pool.query(
                `SELECT COUNT(*) as count FROM threads WHERE clinic_id = $1`,
                [clinicId]
            ),

            // Unread messages
            pool.query(
                `SELECT COUNT(*) as count FROM threads WHERE clinic_id = $1 AND is_read = false`,
                [clinicId]
            ),

            // Total responses sent by clinic (staff messages)
            pool.query(
                `SELECT COUNT(*) as count 
         FROM messages m 
         JOIN threads t ON m.thread_id = t.id 
         WHERE t.clinic_id = $1 AND m.sender_type = 'staff'`,
                [clinicId]
            ),

            // Bookings associated with inbox threads (via patient_id)
            pool.query(
                `SELECT COUNT(DISTINCT a.id) as count
         FROM appointments a
         JOIN threads t ON a.patient_id = t.patient_id
         WHERE t.clinic_id = $1 AND a.status NOT IN ('cancelled', 'no-show')`,
                [clinicId]
            ),

            // Channel breakdown (SMS, WhatsApp, Email, etc.)
            pool.query(
                `SELECT 
           channel,
           COUNT(*) as count,
           MAX(last_message_at) as latest_message,
           SUBSTRING(last_message_content, 1, 100) as preview
         FROM threads 
         WHERE clinic_id = $1
         GROUP BY channel
         ORDER BY MAX(last_message_at) DESC
         LIMIT 5`,
                [clinicId]
            )
        ])

        const stats = {
            totalMessages: parseInt(totalMessagesResult.rows[0]?.count || '0', 10),
            unreadMessages: parseInt(unreadResult.rows[0]?.count || '0', 10),
            responses: parseInt(responsesResult.rows[0]?.count || '0', 10),
            bookings: parseInt(bookingsResult.rows[0]?.count || '0', 10),
            channels: channelBreakdown.rows.map(row => ({
                channel: row.channel,
                count: parseInt(row.count, 10),
                latestMessage: row.latest_message,
                preview: row.preview
            }))
        }

        return NextResponse.json(stats)

    } catch (error) {
        console.error('Inbox stats API error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch inbox statistics', details: (error as Error).message },
            { status: 500 }
        )
    }
}
