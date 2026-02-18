import { Pool } from "pg"
import dotenv from "dotenv"
import { enqueueJob, checkAndDecrementCredits } from "../lib/db"

dotenv.config({ path: ".env.local" })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
})

interface CampaignJob {
  type: "campaign_start" | "campaign_batch" | "campaign_resume"
  campaign_id: string
  clinic_id: string
  batch_index?: number
}

/**
 * Main Worker Entry Point for Advanced Campaign Dynamics
 */
export async function processCampaignJob(job: CampaignJob | Record<string, unknown>, jobId: string) {
  const { type, campaign_id, clinic_id, batch_index = 0 } = job as CampaignJob
  const client = await pool.connect()

  try {
    await client.query("UPDATE jobs SET status = 'processing', started_at = NOW() WHERE id = $1", [jobId])

    if (type === "campaign_start") {
      await handleCampaignStart(client, clinic_id, campaign_id)
    } else if (type === "campaign_batch" || type === "campaign_resume") {
      await handleCampaignBatch(client, clinic_id, campaign_id, batch_index)
    }

    await client.query("UPDATE jobs SET status = 'completed', completed_at = NOW() WHERE id = $1", [jobId])
  } catch (error) {
    console.error("[NovaWorker] Campaign runner error:", error)
    await client.query("UPDATE jobs SET status = 'failed', error_message = $1 WHERE id = $2", [(error as Error).message, jobId])
  } finally {
    client.release()
  }
}

/**
 * Initialization: Identifies target recipients (leads) and seeds the progress table
 */
async function handleCampaignStart(client: any, clinicId: string, campaignId: string) {
  // 1. Fetch Campaign & First Step
  const campaignRes = await client.query("SELECT * FROM campaigns WHERE id = $1", [campaignId])
  if (campaignRes.rows.length === 0) throw new Error("Campaign not found")

  // 2. Identify Recipients based on Segment Criteria
  // Simplification: In this phase, we target all active leads for the clinic
  // (In a real scenario, we'd parse campaign.segment_criteria)
  const leadsRes = await client.query(
    "SELECT id FROM leads WHERE clinic_id = $1",
    [clinicId]
  )
  const leadIds = leadsRes.rows.map((r: any) => r.id)

  if (leadIds.length === 0) {
    await client.query("UPDATE campaigns SET status = 'completed', completed_at = NOW() WHERE id = $1", [campaignId])
    return
  }

  // 3. Seed Progress Table (Step 0)
  for (const leadId of leadIds) {
    await client.query(`
      INSERT INTO campaign_patient_progress (clinic_id, campaign_id, patient_id, current_step_index, next_action_at, status)
      VALUES ($1, $2, $3, 0, NOW(), 'active')
      ON CONFLICT (campaign_id, patient_id) DO UPDATE SET status = 'active', current_step_index = 0, next_action_at = NOW()
    `, [clinicId, campaignId, leadId])
  }

  // 4. Update Campaign Status
  await client.query("UPDATE campaigns SET status = 'running', started_at = NOW(), total_recipients = $1 WHERE id = $2", [leadIds.length, campaignId])

  // 5. Enqueue first batch
  await enqueueJob(clinicId, "campaign_batch", { campaign_id: campaignId, clinic_id: clinicId, batch_index: 0 })
}

/**
 * Batch Execution: Processes patients due for their next sequence action
 */
async function handleCampaignBatch(client: any, clinicId: string, campaignId: string, batchIndex: number) {
  const BATCH_SIZE = 50

  // 1. Fetch Campaign & Steps
  const campaignRes = await client.query("SELECT * FROM campaigns WHERE id = $1", [campaignId])
  const campaign = campaignRes.rows[0]
  if (!campaign || campaign.status === 'paused') return

  const stepsRes = await client.query("SELECT * FROM campaign_steps WHERE campaign_id = $1 ORDER BY step_order ASC", [campaignId])
  const steps = stepsRes.rows

  if (steps.length === 0) {
    // Fallback if no steps: create a default one from campaign.channels
    // For Phase 8 parity, we expect proper steps
    throw new Error("No sequence steps defined for campaign")
  }

  // 2. Fetch Patients due for action
  const progressRes = await client.query(`
    SELECT p.*, l.email, l.phone, l.first_name, l.last_name
    FROM campaign_patient_progress p
    JOIN leads l ON p.patient_id = l.id
    WHERE p.campaign_id = $1 AND p.status = 'active' AND p.next_action_at <= NOW()
    LIMIT $2
  `, [campaignId, BATCH_SIZE])

  const progressEntries = progressRes.rows

  if (progressEntries.length === 0) {
    // Check if any active ones remain for the future
    const activeRemain = await client.query("SELECT count(*) FROM campaign_patient_progress WHERE campaign_id = $1 AND status = 'active'", [campaignId])
    if (activeRemain.rows[0].count === "0") {
      await client.query("UPDATE campaigns SET status = 'completed', completed_at = NOW() WHERE id = $1", [campaignId])
    }
    return
  }

  const DEMO_MODE = process.env.DEMO_MODE === "true" || !process.env.TWILIO_ACCOUNT_SID

  // 3. Process Each Patient
  for (const entry of progressEntries) {
    const step = steps[entry.current_step_index]
    if (!step) {
      await client.query("UPDATE campaign_patient_progress SET status = 'completed' WHERE id = $1", [entry.id])
      continue
    }

    // Check Fallback Conditions (Email -> SMS logic)
    let shouldSkip = false
    if (step.fallback_condition === 'no_open' && entry.current_step_index > 0) {
      // Did they open the previous step?
      const prevMsg = await client.query(
        "SELECT status FROM campaign_messages WHERE campaign_id = $1 AND (recipient_email = $2 OR recipient_phone = $3) ORDER BY created_at DESC LIMIT 1",
        [campaignId, entry.email, entry.phone]
      )
      if (prevMsg.rows[0]?.status === 'opened' || prevMsg.rows[0]?.status === 'replied') {
        shouldSkip = true
      }
    }

    if (shouldSkip) {
      await advancePatient(client, entry, steps)
      continue
    }

    // 4. Credit Check (Pre-flight)
    const creditType = step.channel === 'email' ? 'reactivation_emails' : 'reactivation_sms'
    const creditsUsed = 1
    const creditCheck = await checkAndDecrementCredits(clinicId, creditType, creditsUsed, undefined, campaignId)

    if (!creditCheck.allowed) {
      await client.query("UPDATE campaigns SET status = 'paused', paused_reason = 'Insufficient credits' WHERE id = $1", [campaignId])
      return // Stop the batch
    }

    // 5. "Send" Message
    const content = campaign.template?.body || "Hello from practice!"
    const providerId = `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`

    await client.query(`
      INSERT INTO campaign_messages (campaign_id, clinic_id, channel, recipient_email, recipient_phone, message_content, status, provider_id, sent_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    `, [
      campaignId, clinicId, step.channel,
      entry.email, entry.phone,
      content,
      DEMO_MODE ? 'delivered' : 'sent',
      providerId
    ])

    // Update Campaign Stats
    await client.query("UPDATE campaigns SET sent_count = sent_count + 1 WHERE id = $1", [campaignId])

    // 6. Schedule Next Step
    await advancePatient(client, entry, steps)
  }

  // 7. Chain next batch if needed
  await enqueueJob(clinicId, "campaign_batch", { campaign_id: campaignId, clinic_id: clinicId, batch_index: batchIndex + 1 })
}

/**
 * Helper to move a patient to the next step or mark as completed
 */
async function advancePatient(client: any, entry: any, steps: any[]) {
  const nextIndex = entry.current_step_index + 1
  if (nextIndex < steps.length) {
    const nextStep = steps[nextIndex]
    const delayMs = (nextStep.delay_hours || 0) * 3600000
    const nextActionAt = new Date(Date.now() + delayMs)

    await client.query(`
            UPDATE campaign_patient_progress 
            SET current_step_index = $1, next_action_at = $2, last_action_at = NOW()
            WHERE id = $3
        `, [nextIndex, nextActionAt, entry.id])
  } else {
    await client.query(`
            UPDATE campaign_patient_progress 
            SET status = 'completed', last_action_at = NOW()
            WHERE id = $3
        `, [entry.id])
  }
}

export default processCampaignJob
