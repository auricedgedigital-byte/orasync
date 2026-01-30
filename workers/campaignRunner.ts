import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

interface CampaignJob {
  campaign_id: string
  clinic_id: string
  batch_index?: number
}

// Helper to log usage directly since lib/db might be using neon
async function logUsageInternal(client: any, clinicId: string, actionType: string, amount: number, relatedId: string, details: any) {
  await client.query(
    "INSERT INTO usage_logs (clinic_id, action_type, amount, related_id, details, created_at) VALUES ($1, $2, $3, $4, $5, NOW())",
    [clinicId, actionType, amount, relatedId, JSON.stringify(details)]
  )
}

// Helper to update job status
async function updateJobStatusInternal(client: any, jobId: string, status: string, errorMessage?: string) {
  await client.query(
    `UPDATE jobs SET status = $1, error_message = $2, ${status === "completed" ? "completed_at = NOW()" : "started_at = NOW()"} WHERE id = $3`,
    [status, errorMessage || null, jobId]
  )
}

export async function processCampaignJob(job: CampaignJob | Record<string, unknown>, jobId: string) {
  const { campaign_id, clinic_id, batch_index = 0 } = job as CampaignJob

  let client
  try {
    client = await pool.connect()

    // Mark processing (if not already done by worker)
    await updateJobStatusInternal(client, jobId, "processing")

    // Fetch campaign
    const res = await client.query("SELECT * FROM campaigns WHERE id = $1 AND clinic_id = $2", [campaign_id, clinic_id])
    const campaigns = res.rows

    if (campaigns.length === 0) {
      await updateJobStatusInternal(client, jobId, "failed", "Campaign not found")
      return
    }

    const campaign = campaigns[0]

    // Get recipients for this batch
    const batchSize = campaign.batch_size || 100
    const offset = batch_index * batchSize

    const recipientsRes = await client.query(
      "SELECT * FROM leads WHERE clinic_id = $1 LIMIT $2 OFFSET $3",
      [clinic_id, batchSize, offset]
    )
    const recipients = recipientsRes.rows

    if (recipients.length === 0) {
      // No more recipients - campaign complete
      await client.query("UPDATE campaigns SET status = 'completed', completed_at = NOW() WHERE id = $1", [campaign_id])
      await updateJobStatusInternal(client, jobId, "completed")
      return
    }

    // Send messages (simulated)
    const DEMO_MODE = !process.env.EMAIL_SMTP_HOST || process.env.DEMO_MODE === "true"

    for (const recipient of recipients) {
      const channels = (campaign.channels as string[]) || ["email"]
      for (const channel of channels) {
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`
        const status = DEMO_MODE ? "simulated" : "sent"

        await client.query(
          "INSERT INTO campaign_messages (campaign_id, clinic_id, recipient_email, channel, status, provider_id, sent_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())",
          [campaign_id, clinic_id, recipient.email, channel, status, messageId]
        )

        // Log usage
        await logUsageInternal(client, clinic_id, `send:${channel}`, 1, campaign_id, {
          recipient: recipient.email,
          mode: DEMO_MODE ? "simulated" : "real",
        })
      }
    }

    // Enqueue next batch
    if (recipients.length === batchSize) {
      // TODO: Enqueue next batch via job queue
      // For now we just stop here or could insert another job
    } else {
      // Final batch complete
      await client.query("UPDATE campaigns SET status = 'completed', completed_at = NOW() WHERE id = $1", [campaign_id])
    }

    await updateJobStatusInternal(client, jobId, "completed")
  } catch (error) {
    console.error("[v0] Campaign runner error:", error)
    if (client) {
      await updateJobStatusInternal(client, jobId, "failed", (error as Error).message)
    }
  } finally {
    if (client) client.release()
  }
}

export default processCampaignJob
