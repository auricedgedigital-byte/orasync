// Database utility functions for trial credits and integrations
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Force SSL bypass for Vercel/Neon compatibility
})

export async function getTrialCredits(clinicId: string) {
  try {
    const result = await pool.query("SELECT * FROM trial_credits WHERE clinic_id = $1", [clinicId])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching trial credits:", error)
    return null
  }
}

import { QuotaManager } from "./nova/core/quota"
import { AIQuality } from "./nova/types/ai.types"

export async function checkAndDecrementCredits(
  clinicId: string,
  actionType: string,
  amount: number,
  userId?: string,
  relatedId?: string,
  details?: Record<string, unknown>,
) {
  // Use the new QuotaManager for AI credits if applicable
  if (actionType.startsWith("ai_")) {
    try {
      const quota = new QuotaManager(pool)
      const quality: AIQuality = actionType === "ai_premium" ? "premium" : "cheap"
      // Basic check: 1 credit in UI = approx 100 estimated tokens for gating
      const success = await quota.checkQuota(clinicId, amount * 100, quality)

      // Fetch remaining for compatibility
      const creditType = quality === "premium" ? "ai_premium" : "ai_cheap"
      const balances = await pool.query("SELECT amount FROM balances WHERE clinic_id = $1 AND credit_type = $2", [clinicId, creditType])
      return {
        allowed: success,
        remaining: { [actionType]: balances.rows[0]?.amount || 0 }
      }
    } catch (error) {
      console.error("Quota consumption error:", error)
      return { allowed: false, error: "Quota service error" }
    }
  }

  // Fallback for legacy credits if still needed
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const credits = await client.query("SELECT * FROM trial_credits WHERE clinic_id = $1 FOR UPDATE", [clinicId])
    if (!credits.rows || credits.rows.length === 0) {
      await client.query("ROLLBACK")
      return { allowed: false, remaining: null, error: "No credits found" }
    }
    const current = credits.rows[0]
    const currentAmount = current[actionType] || 0
    if (currentAmount < amount) {
      await client.query("ROLLBACK")
      return { allowed: false, remaining: current, error: `Insufficient ${actionType} credits` }
    }
    await client.query(`UPDATE trial_credits SET ${actionType} = ${actionType} - $1, modified_at = NOW() WHERE clinic_id = $2`, [amount, clinicId])
    await client.query("INSERT INTO usage_logs (clinic_id, user_id, action_type, amount, related_id, details, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())", [clinicId, userId || null, actionType, amount, relatedId || null, JSON.stringify(details || {})])
    const updated = await client.query("SELECT * FROM trial_credits WHERE clinic_id = $1", [clinicId])
    await client.query("COMMIT")
    return { allowed: true, remaining: updated.rows[0] }
  } catch (error) {
    await client.query("ROLLBACK")
    return { allowed: false, error: "Database error" }
  } finally {
    client.release()
  }
}

export async function getIntegration(clinicId: string, providerName: string) {
  try {
    const result = await pool.query(
      "SELECT * FROM integrations WHERE clinic_id = $1 AND provider_name = $2",
      [clinicId, providerName]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching integration:", error)
    return null
  }
}

export async function saveIntegration(
  clinicId: string,
  providerName: string,
  credentials: Record<string, unknown>,
  status = "connected",
) {
  try {
    const result = await pool.query(
      `INSERT INTO integrations (clinic_id, provider_name, credentials, status, last_activity_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (clinic_id, provider_name) 
       DO UPDATE SET credentials = $3, status = $4, updated_at = NOW()
       RETURNING *`,
      [clinicId, providerName, JSON.stringify(credentials), status]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error saving integration:", error)
    return null
  }
}

export async function getWebhookToken(clinicId: string) {
  try {
    const result = await pool.query("SELECT * FROM webhooks WHERE clinic_id = $1", [clinicId])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching webhook token:", error)
    return null
  }
}

export async function createOrRotateWebhookToken(clinicId: string) {
  try {
    const token = `whk_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    const result = await pool.query(
      `INSERT INTO webhooks (clinic_id, webhook_token, rotated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (clinic_id)
       DO UPDATE SET webhook_token = $2, rotated_at = NOW()
       RETURNING webhook_token`,
      [clinicId, token]
    )
    return result.rows[0]?.webhook_token || null
  } catch (error) {
    console.error("Error creating/rotating webhook token:", error)
    return null
  }
}

export async function getUsageLogs(clinicId: string, limit = 100) {
  try {
    const result = await pool.query(
      "SELECT * FROM usage_logs WHERE clinic_id = $1 ORDER BY created_at DESC LIMIT $2",
      [clinicId, limit]
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching usage logs:", error)
    return []
  }
}

export async function getCampaigns(clinicId: string) {
  try {
    const result = await pool.query(
      "SELECT * FROM campaigns WHERE clinic_id = $1 ORDER BY created_at DESC",
      [clinicId]
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return []
  }
}

export async function createCampaign(
  clinicId: string,
  name: string,
  segmentCriteria: Record<string, unknown>,
  template: Record<string, unknown>,
  channels: Record<string, boolean>,
  status = 'draft'
) {
  try {
    const result = await pool.query(
      "INSERT INTO campaigns (clinic_id, name, segment_criteria, template, channels, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *",
      [clinicId, name, JSON.stringify(segmentCriteria), JSON.stringify(template), JSON.stringify(channels), status]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error creating campaign:", error)
    return null
  }
}

export async function startCampaign(clinicId: string, campaignId: string) {
  try {
    const result = await pool.query(
      "UPDATE campaigns SET status = 'active', updated_at = NOW() WHERE id = $1 AND clinic_id = $2 RETURNING *",
      [campaignId, clinicId]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error starting campaign:", error)
    return null
  }
}

export async function getPatients(clinicId: string, limit = 100) {
  try {
    const result = await pool.query(
      "SELECT * FROM patients WHERE clinic_id = $1 ORDER BY created_at DESC LIMIT $2",
      [clinicId, limit]
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching patients:", error)
    return []
  }
}

export async function createPatient(
  clinicId: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  source = "manual",
) {
  try {
    const result = await pool.query(
      "INSERT INTO patients (clinic_id, first_name, last_name, email, phone, source, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *",
      [clinicId, firstName, lastName, email, phone, source]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error creating patient:", error)
    return null
  }
}

export async function getPatientById(clinicId: string, patientId: string) {
  try {
    const result = await pool.query(
      "SELECT * FROM patients WHERE clinic_id = $1 AND id = $2",
      [clinicId, patientId]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching patient by ID:", error)
    return null
  }
}

export async function getAppointments(clinicId: string, limit = 100) {
  try {
    const result = await pool.query(
      "SELECT * FROM appointments WHERE clinic_id = $1 ORDER BY start_time DESC LIMIT $2",
      [clinicId, limit]
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return []
  }
}

export async function createAppointment(
  clinicId: string,
  patientName: string,
  startTime: string,
  endTime: string,
  treatmentType = 'exam',
  notes = ''
) {
  try {
    const result = await pool.query(
      "INSERT INTO appointments (clinic_id, patient_name, start_time, end_time, treatment_type, status, notes, created_at) VALUES ($1, $2, $3, $4, $5, 'confirmed', $6, NOW()) RETURNING *",
      [clinicId, patientName, startTime, endTime, treatmentType, notes]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error creating appointment:", error)
    return null
  }
}

export async function logUsage(
  clinicId: string,
  userId: string | null,
  actionType: string,
  amount: number,
  relatedId?: string,
  details?: Record<string, unknown>,
) {
  try {
    const result = await pool.query(
      "INSERT INTO usage_logs (clinic_id, user_id, action_type, amount, related_id, details, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *",
      [clinicId, userId || null, actionType, amount, relatedId || null, JSON.stringify(details || {})]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error logging usage:", error)
    return null
  }
}

export async function getTrialCreditsWithDefaults(clinicId: string) {
  try {
    const credits = await pool.query("SELECT * FROM trial_credits WHERE clinic_id = $1", [clinicId])

    if (!credits.rows || credits.rows.length === 0) {
      // Initialize with default trial credits
      const result = await pool.query(
        `INSERT INTO trial_credits (clinic_id, reactivation_emails, reactivation_sms, reactivation_whatsapp, campaigns_started, lead_upload_rows, booking_confirms, ai_suggestions, seo_applies, chatbot_installs, modified_at)
         VALUES ($1, 200, 50, 20, 3, 1000, 50, 100, 1, 1, NOW())
         ON CONFLICT (clinic_id) DO UPDATE SET modified_at = NOW()
         RETURNING *`,
        [clinicId]
      )
      return result.rows[0]
    }

    return credits.rows[0]
  } catch (error) {
    console.error("Error getting trial credits with defaults:", error)
    return null
  }
}

export async function incrementCredits(clinicId: string, creditsToAdd: Record<string, number>) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // Get current credits with lock
    const credits = await client.query(
      "SELECT * FROM trial_credits WHERE clinic_id = $1 FOR UPDATE",
      [clinicId]
    )

    if (!credits.rows || credits.rows.length === 0) {
      await client.query("ROLLBACK")
      return { success: false, error: "No trial credits found" }
    }

    // Build dynamic UPDATE statement
    const updates: string[] = []
    const values: unknown[] = [clinicId]
    let paramIndex = 2

    Object.entries(creditsToAdd).forEach(([key, value]) => {
      if (value > 0) {
        updates.push(`${key} = ${key} + $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    })

    if (updates.length === 0) {
      await client.query("ROLLBACK")
      return { success: false, error: "No credits to add" }
    }

    updates.push("modified_at = NOW()")

    const updateQuery = `UPDATE trial_credits SET ${updates.join(", ")} WHERE clinic_id = $1 RETURNING *`
    const updated = await client.query(updateQuery, values)

    await client.query("COMMIT")
    return { success: true, remaining: updated.rows[0] }
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error incrementing credits:", error)
    return { success: false, error: "Database error" }
  } finally {
    client.release()
  }
}

// Order-related database functions for PayPal integration

export async function createOrderRecord(
  clinicId: string,
  orderId: string,
  packId: string,
  amountCents: number,
  currency = "USD",
) {
  try {
    const result = await pool.query(
      "INSERT INTO orders (clinic_id, order_id, pack_id, amount_cents, currency, status) VALUES ($1, $2, $3, $4, $5, 'created') RETURNING *",
      [clinicId, orderId, packId, amountCents, currency]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Error creating order record:", error)
    return null
  }
}

export async function getOrderByPayPalOrderId(paypalOrderId: string) {
  try {
    const result = await pool.query("SELECT * FROM orders WHERE order_id = $1", [paypalOrderId])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}

export async function claimOrderCapture(orderId: string, paypalTxId: string) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // Check if already captured (idempotent)
    const order = await client.query("SELECT * FROM orders WHERE id = $1 FOR UPDATE", [orderId])

    if (!order.rows || order.rows.length === 0) {
      await client.query("ROLLBACK")
      return { success: false, error: "Order not found" }
    }

    if (order.rows[0].paypal_tx_id) {
      // Already captured
      await client.query("ROLLBACK")
      return { success: false, error: "Order already captured", order: order.rows[0] }
    }

    // Update order with capture info
    const updated = await client.query(
      "UPDATE orders SET status = 'captured', paypal_tx_id = $1, captured_at = NOW() WHERE id = $2 RETURNING *",
      [paypalTxId, orderId]
    )

    await client.query("COMMIT")
    return { success: true, order: updated.rows[0] }
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error claiming order capture:", error)
    return { success: false, error: "Database error" }
  } finally {
    client.release()
  }
}

// Pack pricing mapping
const PACK_MAPPING: Record<string, Record<string, number>> = {
  starter_plan: {
    reactivation_emails: 500,
    reactivation_sms: 100,
    campaigns_started: 10,
    lead_upload_rows: 5000,
  },
  growth_plan: {
    reactivation_emails: 2000,
    reactivation_sms: 500,
    campaigns_started: 999,
    lead_upload_rows: 50000,
  },
  email_pack: { reactivation_emails: 500 },
  sms_pack: { reactivation_sms: 200 },
  campaign_pack: { campaigns_started: 5 },
  lead_pack: { lead_upload_rows: 5000 },
}

export async function topUpCreditsFromOrder(orderId: string) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const order = await client.query("SELECT * FROM orders WHERE id = $1", [orderId])

    if (!order.rows || order.rows.length === 0) {
      await client.query("ROLLBACK")
      return { success: false, error: "Order not found" }
    }

    const packData = PACK_MAPPING[order.rows[0].pack_id] || {}
    const clinicId = order.rows[0].clinic_id

    if (Object.keys(packData).length === 0) {
      await client.query("ROLLBACK")
      return { success: false, error: "Invalid pack type" }
    }

    // Get or create trial credits
    await client.query(
      "INSERT INTO trial_credits (clinic_id) VALUES ($1) ON CONFLICT (clinic_id) DO NOTHING",
      [clinicId]
    )

    // Update with pack mapping
    const updates: string[] = []
    Object.entries(packData).forEach(([key, val]) => {
      updates.push(`${key} = ${key} + ${val}`)
    })

    updates.push("modified_at = NOW()")

    const updateQuery = `UPDATE trial_credits SET ${updates.join(",")} WHERE clinic_id = $1 RETURNING *`
    const updatedCredits = await client.query(updateQuery, [clinicId])

    // Log the purchase
    await client.query(
      "INSERT INTO usage_logs (clinic_id, action_type, amount, related_id, details, created_at) VALUES ($1, $2, $3, $4, $5, NOW())",
      [
        clinicId,
        `purchase:${order.rows[0].pack_id}`,
        order.rows[0].amount_cents,
        orderId,
        JSON.stringify({ pack: order.rows[0].pack_id, tx_id: order.rows[0].paypal_tx_id }),
      ]
    )

    await client.query("COMMIT")
    return { success: true, remaining: updatedCredits.rows[0] }
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error topping up credits:", error)
    return { success: false, error: "Database error" }
  } finally {
    client.release()
  }
}

export async function resumePausedCampaigns(clinicId: string) {
  try {
    const pausedCampaigns = await pool.query(
      "SELECT id FROM campaigns WHERE clinic_id = $1 AND status = 'paused'",
      [clinicId]
    )

    if (!pausedCampaigns.rows || pausedCampaigns.rows.length === 0) {
      return { success: true, resumed: 0 }
    }

    // Enqueue resume jobs for each paused campaign
    let resumed = 0
    for (const campaign of pausedCampaigns.rows) {
      await enqueueJob(clinicId, "campaign_resume", { campaign_id: campaign.id })
      resumed++
    }

    return { success: true, resumed }
  } catch (error) {
    console.error("Error resuming campaigns:", error)
    return { success: false, error: "Database error" }
  }
}

export async function enqueueJob(clinicId: string, jobType: string, payload: Record<string, unknown>) {
  try {
    // Try Redis if available
    if (process.env.REDIS_URL) {
      try {
        const redisModule = await import("ioredis")
        const Redis = redisModule.default
        const redis = new Redis(process.env.REDIS_URL)
        await redis.lpush(`queue:${jobType}`, JSON.stringify({ clinic_id: clinicId, ...payload }))
        await redis.quit()
        return { success: true }
      } catch (_redisError) {
        // Fall through to DB
      }
    }

    // Fall back to DB polling
    const result = await pool.query(
      "INSERT INTO jobs (clinic_id, type, payload, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
      [clinicId, jobType, JSON.stringify(payload)]
    )

    return { success: true, jobId: result.rows[0]?.id }
  } catch (error) {
    console.error("Error enqueuing job:", error)
    return { success: false, error: "Failed to enqueue job" }
  }
}

export async function getJobs(clinicId: string, type?: string, status = "pending", limit = 100) {
  try {
    const query = type
      ? "SELECT * FROM jobs WHERE clinic_id = $1 AND type = $2 AND status = $3 ORDER BY created_at ASC LIMIT $4"
      : "SELECT * FROM jobs WHERE clinic_id = $1 AND status = $2 ORDER BY created_at ASC LIMIT $3"

    const params = type ? [clinicId, type, status, limit] : [clinicId, status, limit]

    const result = await pool.query(query, params)
    return result.rows || []
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return []
  }
}

export async function updateJobStatus(jobId: string, status: string, errorMessage?: string) {
  try {
    const timeField = status === "completed" ? "completed_at = NOW()" : "started_at = NOW()"
    const result = await pool.query(
      `UPDATE jobs SET status = $1, error_message = $2, ${timeField} WHERE id = $3 RETURNING *`,
      [status, errorMessage || null, jobId]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Error updating job:", error)
    return null
  }
}
export async function getThreads(clinicId: string, limit = 50, filterChannel = 'all', searchTerm = '') {
  try {
    let query = `
      SELECT t.*, 
             p.first_name as patient_first_name, 
             p.last_name as patient_last_name,
             (SELECT content FROM messages WHERE thread_id = t.id ORDER BY created_at DESC LIMIT 1) as last_message_content
      FROM threads t
      LEFT JOIN patients p ON t.patient_id = p.id
      WHERE t.clinic_id = $1
    `
    const params: (string | number)[] = [clinicId]
    let paramIndex = 2

    if (filterChannel !== 'all') {
      query += ` AND t.channel = $${paramIndex}`
      params.push(filterChannel)
      paramIndex++
    }

    if (searchTerm) {
      query += ` AND (p.first_name ILIKE $${paramIndex} OR p.last_name ILIKE $${paramIndex} OR t.contact_phone ILIKE $${paramIndex} OR t.contact_email ILIKE $${paramIndex})`
      params.push(`%${searchTerm}%`)
      paramIndex++
    }

    query += ` ORDER BY t.last_message_at DESC LIMIT $${paramIndex}`
    params.push(limit)

    const result = await pool.query(query, params)
    return result.rows
  } catch (error) {
    console.error("Error fetching threads:", error)
    return []
  }
}

export async function getMessages(threadId: string, limit = 50) {
  try {
    const result = await pool.query(
      "SELECT * FROM messages WHERE thread_id = $1 ORDER BY created_at ASC LIMIT $2",
      [threadId, limit]
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

export async function createMessage(
  clinicId: string,
  threadId: string,
  senderType: 'staff' | 'patient' | 'ai' | 'system',
  content: string,
  userId?: string
) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // Insert message
    const messageResult = await client.query(
      "INSERT INTO messages (thread_id, clinic_id, sender_type, user_id, content, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [threadId, clinicId, senderType, userId || null, content]
    )

    // Update thread last_message_at
    await client.query(
      "UPDATE threads SET last_message_at = NOW() WHERE id = $1",
      [threadId]
    )

    await client.query("COMMIT")
    return messageResult.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error creating message:", error)
    return null
  } finally {
    client.release()
  }
}

export async function getAnalyticsData(clinicId: string, startDate?: string, endDate?: string) {
  try {
    // Basic aggregation queries
    const revenue = await pool.query(
      "SELECT SUM(amount_cents) as total, COUNT(*) as count FROM orders WHERE clinic_id = $1 AND status = 'captured' AND created_at >= $2 AND created_at <= $3",
      [clinicId, startDate || '1970-01-01', endDate || '2100-01-01']
    )

    const appointments = await pool.query(
      "SELECT COUNT(*) as count FROM appointments WHERE clinic_id = $1 AND start_time >= $2 AND start_time <= $3",
      [clinicId, startDate || '1970-01-01', endDate || '2100-01-01']
    )

    const newPatients = await pool.query(
      "SELECT COUNT(*) as count FROM patients WHERE clinic_id = $1 AND created_at >= $2 AND created_at <= $3",
      [clinicId, startDate || '1970-01-01', endDate || '2100-01-01']
    )

    // Campaign stats from JSONB
    const campaigns = await pool.query(
      `SELECT 
        COUNT(*) as count, 
        SUM((stats->>'sent')::int) as sent, 
        SUM((stats->>'opened')::int) as opened, 
        SUM((stats->>'clicked')::int) as clicked 
      FROM campaigns WHERE clinic_id = $1 AND created_at >= $2 AND created_at <= $3`,
      [clinicId, startDate || '1970-01-01', endDate || '2100-01-01']
    )

    return {
      revenue: { total: (revenue.rows[0].total || 0) / 100, count: revenue.rows[0].count }, // Convert cents to USD
      appointments: { count: appointments.rows[0].count },
      patients: { new: newPatients.rows[0].count },
      campaigns: {
        count: campaigns.rows[0].count,
        sent: campaigns.rows[0].sent || 0,
        opened: campaigns.rows[0].opened || 0,
        clicked: campaigns.rows[0].clicked || 0
      }
    }
  } catch (error) {
    console.error("Error getting analytics data:", error)
    return null
  }
}

export async function getReviews(clinicId: string) {
  try {
    const result = await pool.query(
      `SELECT 
        id, 
        author_name as author, 
        rating, 
        content as text, 
        platform, 
        review_date as date, 
        is_responded as responded 
      FROM reviews 
      WHERE clinic_id = $1 
      ORDER BY review_date DESC`,
      [clinicId]
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return []
  }
}
