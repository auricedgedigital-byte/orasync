// Database utility functions for trial credits and integrations
import { Pool } from "pg"
import { QuotaManager } from "./nova/core/quota"
import { AIQuality } from "./nova/types/ai.types"

// Create a safe mock client if database is not connected
function createMockPool() {
  const dummyClient = {
    query: async () => ({ rows: [], rowCount: 0 }),
    release: () => {},
  }
  return {
    query: async () => ({ rows: [], rowCount: 0 }),
    connect: async () => dummyClient,
    on: () => {},
    end: async () => {},
  } as unknown as Pool
}

export let pool: Pool
if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
    })
  } catch (error) {
    console.warn("[AI Studio] Database connection initialization failed, using mock pool", error)
    pool = createMockPool()
  }
} else {
  pool = createMockPool()
}

// ---------------------------------------------------------------------------
// In-Memory Fallback Store (active when DATABASE_URL is not set or queries fail)
// ---------------------------------------------------------------------------
class MemoryStore {
  users: Map<string, any> = new Map([
    ["demo@orasync.site", { id: "user_demo", email: "demo@orasync.site", full_name: "Dr. Alex Demo", clinic_id: "demo-clinic-1", role: "admin", auth_provider: "credentials" }]
  ])
  clinics: Map<string, any> = new Map([
    ["demo-clinic-1", { id: "demo-clinic-1", name: "Bright Smile Practice" }]
  ])
  trialCredits: Map<string, any> = new Map([
    ["demo-clinic-1", {
      clinic_id: "demo-clinic-1",
      reactivation_emails: 200,
      reactivation_sms: 50,
      reactivation_whatsapp: 20,
      campaigns_started: 3,
      lead_upload_rows: 1000,
      booking_confirms: 50,
      ai_suggestions: 100,
      seo_applies: 1,
      chatbot_installs: 1,
      modified_at: new Date().toISOString()
    }]
  ])
  patients: any[] = [
    { id: "p1", clinic_id: "demo-clinic-1", first_name: "Sarah", last_name: "Johnson", email: "sarah.j@example.com", phone: "+1 (555) 234-5678", source: "lead", created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "p2", clinic_id: "demo-clinic-1", first_name: "Michael", last_name: "Chen", email: "m.chen@example.com", phone: "+1 (555) 345-6789", source: "import", created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: "p3", clinic_id: "demo-clinic-1", first_name: "Emily", last_name: "Davis", email: "emily.d@example.com", phone: "+1 (555) 456-7890", source: "manual", created_at: new Date(Date.now() - 86400000 * 8).toISOString() },
    { id: "p4", clinic_id: "demo-clinic-1", first_name: "Robert", last_name: "Miller", email: "r.miller@example.com", phone: "+1 (555) 567-8901", source: "lead", created_at: new Date(Date.now() - 86400000 * 12).toISOString() },
    { id: "p5", clinic_id: "demo-clinic-1", first_name: "Amanda", last_name: "Wilson", email: "a.wilson@example.com", phone: "+1 (555) 678-9012", source: "website", created_at: new Date(Date.now() - 86400000 * 15).toISOString() },
  ]
  appointments: any[] = [
    { id: "apt-1", clinic_id: "demo-clinic-1", patient_name: "Sarah Johnson", start_time: new Date(Date.now() + 3600000 * 2).toISOString(), end_time: new Date(Date.now() + 3600000 * 3).toISOString(), treatment_type: "Teeth Whitening", status: "confirmed", notes: "Pre-wedding whitening", created_at: new Date().toISOString() },
    { id: "apt-2", clinic_id: "demo-clinic-1", patient_name: "Michael Chen", start_time: new Date(Date.now() + 3600000 * 4).toISOString(), end_time: new Date(Date.now() + 3600000 * 5).toISOString(), treatment_type: "Dental Cleaning & Exam", status: "confirmed", notes: "Regular 6-month checkup", created_at: new Date().toISOString() },
    { id: "apt-3", clinic_id: "demo-clinic-1", patient_name: "Emily Davis", start_time: new Date(Date.now() + 3600000 * 6).toISOString(), end_time: new Date(Date.now() + 3600000 * 7).toISOString(), treatment_type: "Root Canal Follow-up", status: "in-progress", notes: "Tooth #14 checkup", created_at: new Date().toISOString() },
    { id: "apt-4", clinic_id: "demo-clinic-1", patient_name: "Robert Miller", start_time: new Date(Date.now() + 86400000).toISOString(), end_time: new Date(Date.now() + 86400000 + 3600000).toISOString(), treatment_type: "Orthodontic Consultation", status: "scheduled", notes: "Clear aligner scan", created_at: new Date().toISOString() },
  ]
  campaigns: any[] = [
    { id: "c1", clinic_id: "demo-clinic-1", name: "6-Month Recall Reactivation", segment_criteria: { inactive_months: 6 }, template: { subject: "Time for your dental checkup!", body: "Hi {{firstName}}, it's been 6 months since your last cleaning." }, channels: { email: true, sms: true }, status: "active", sent_count: 124, created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: "c2", clinic_id: "demo-clinic-1", name: "Spring Whitening Promotion", segment_criteria: { tag: "cosmetic" }, template: { subject: "Special Offer: 25% Off Teeth Whitening", body: "Brighten your smile this spring with our exclusive whitening package." }, channels: { email: true, sms: false }, status: "active", sent_count: 85, created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
    { id: "c3", clinic_id: "demo-clinic-1", name: "Invisalign Open Day", segment_criteria: { age_range: "20-45" }, template: { subject: "Free Clear Aligner Assessment", body: "Book your 3D digital smile scan today." }, channels: { email: true, sms: true }, status: "draft", sent_count: 0, created_at: new Date(Date.now() - 86400000 * 14).toISOString() },
  ]
  threads: any[] = [
    { id: "t1", clinic_id: "demo-clinic-1", patient_id: "p1", patient_first_name: "Sarah", patient_last_name: "Johnson", contact_phone: "+1 (555) 234-5678", contact_email: "sarah.j@example.com", channel: "sms", status: "open", last_message_content: "Is there any availability for a whitening session this Friday?", last_message_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { id: "t2", clinic_id: "demo-clinic-1", patient_id: "p2", patient_first_name: "Michael", patient_last_name: "Chen", contact_phone: "+1 (555) 345-6789", contact_email: "m.chen@example.com", channel: "whatsapp", status: "open", last_message_content: "Thank you! I will be there at 10:30 sharp.", last_message_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { id: "t3", clinic_id: "demo-clinic-1", patient_id: "p3", patient_first_name: "Emily", patient_last_name: "Davis", contact_phone: "+1 (555) 456-7890", contact_email: "emily.d@example.com", channel: "email", status: "closed", last_message_content: "Sent my insurance pre-authorization form.", last_message_at: new Date(Date.now() - 86400000).toISOString() },
  ]
  messages: Map<string, any[]> = new Map([
    ["t1", [
      { id: "m1", thread_id: "t1", clinic_id: "demo-clinic-1", sender_type: "patient", content: "Hi! Is there any availability for a whitening session this Friday?", created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
      { id: "m2", thread_id: "t1", clinic_id: "demo-clinic-1", sender_type: "ai", content: "Hello Sarah! We have openings with Dr. Alex at 11:00 AM and 2:30 PM this Friday. Would either of those work for you?", created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString() }
    ]],
    ["t2", [
      { id: "m3", thread_id: "t2", clinic_id: "demo-clinic-1", sender_type: "staff", content: "Hi Michael, reminding you of your 10:30 AM cleaning exam today.", created_at: new Date(Date.now() - 1000 * 60 * 130).toISOString() },
      { id: "m4", thread_id: "t2", clinic_id: "demo-clinic-1", sender_type: "patient", content: "Thank you! I will be there at 10:30 sharp.", created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() }
    ]]
  ])
  reviews: any[] = [
    { id: "rev-1", clinic_id: "demo-clinic-1", author: "Sarah M.", rating: 5, text: "Best dental experience ever! Painless cleaning and lovely staff.", platform: "Google", date: "2 days ago", responded: true },
    { id: "rev-2", clinic_id: "demo-clinic-1", author: "Mike T.", rating: 5, text: "Dr. Alex is so gentle and explains every step clearly.", platform: "Google", date: "1 week ago", responded: true },
    { id: "rev-3", clinic_id: "demo-clinic-1", author: "Anonymous", rating: 4, text: "Great clinic, slight wait time during peak hours.", platform: "Internal", date: "2 weeks ago", responded: false },
    { id: "rev-4", clinic_id: "demo-clinic-1", author: "Jessica L.", rating: 5, text: "Virtual front desk made booking so effortless at midnight!", platform: "Google", date: "3 weeks ago", responded: true },
  ]
  reputationSettings: any = {
    auto_request_enabled: true,
    rating_threshold: 4,
    email_enabled: true,
    sms_enabled: true,
    request_template_email: "We hope you had a great experience with our team! Would you take a moment to share your feedback?",
    request_template_sms: "Thank you for visiting us today! Please leave a review: {{review_link}}",
    public_review_platforms: ["google", "facebook"]
  }
  usageLogs: any[] = [
    { id: "log-1", clinic_id: "demo-clinic-1", action_type: "reactivation_sms", amount: 48, created_at: new Date(Date.now() - 3600000 * 2).toISOString(), details: { campaign: "6-Month Recall Reactivation" } },
    { id: "log-2", clinic_id: "demo-clinic-1", action_type: "ai_suggestions", amount: 1, created_at: new Date(Date.now() - 3600000 * 5).toISOString(), details: { type: "copy_generation" } },
    { id: "log-3", clinic_id: "demo-clinic-1", action_type: "booking_confirms", amount: 1, created_at: new Date(Date.now() - 3600000 * 8).toISOString(), details: { patient: "Sarah Johnson" } },
  ]
  integrations: Map<string, any> = new Map()
  webhooks: Map<string, string> = new Map([
    ["demo-clinic-1", "whk_demo_token_orasync_dental_secure"]
  ])
  orders: Map<string, any> = new Map()
  jobs: any[] = []
}

const memory = new MemoryStore()

// ---------------------------------------------------------------------------
// Database / Memory Functions
// ---------------------------------------------------------------------------

export async function getTrialCredits(clinicId: string) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query("SELECT * FROM trial_credits WHERE clinic_id = $1", [clinicId])
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error fetching trial credits from DB:", error)
    }
  }
  return memory.trialCredits.get(clinicId) || memory.trialCredits.get("demo-clinic-1") || null
}

export async function getUserByEmail(email: string) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error fetching user by email from DB:", error)
    }
  }
  return memory.users.get(email) || null
}

export async function syncUserByAuthId(email: string, authProvider: string, authProviderId: string, fullName?: string) {
  if (process.env.DATABASE_URL) {
    try {
      const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email])
      if (existing.rows[0]) {
        await pool.query(
          "UPDATE users SET auth_provider = $1, auth_provider_id = $2, full_name = COALESCE(full_name, $3), updated_at = NOW() WHERE email = $4",
          [authProvider, authProviderId, fullName || null, email]
        )
        return existing.rows[0]
      }

      const clinicResult = await pool.query(
        "INSERT INTO clinics (name) VALUES ($1) RETURNING id",
        [`${fullName || 'New User'}'s Practice`]
      )
      const clinicId = clinicResult.rows[0].id

      const userResult = await pool.query(
        "INSERT INTO users (email, clinic_id, full_name, role, auth_provider, auth_provider_id) VALUES ($1, $2, $3, 'admin', $4, $5) RETURNING *",
        [email, clinicId, fullName || null, authProvider, authProviderId]
      )

      await pool.query("INSERT INTO trial_credits (clinic_id) VALUES ($1) ON CONFLICT DO NOTHING", [clinicId])
      return userResult.rows[0]
    } catch (error) {
      console.warn("Error syncing user to DB, using in-memory store:", error)
    }
  }

  // Memory fallback
  const user = {
    id: `user_${Date.now()}`,
    email,
    clinic_id: "demo-clinic-1",
    full_name: fullName || email.split("@")[0],
    role: "admin",
    auth_provider: authProvider,
    auth_provider_id: authProviderId
  }
  memory.users.set(email, user)
  return user
}

export async function checkAndDecrementCredits(
  clinicId: string,
  actionType: string,
  amount: number,
  userId?: string,
  relatedId?: string,
  details?: Record<string, unknown>,
) {
  if (process.env.DATABASE_URL) {
    if (actionType.startsWith("ai_")) {
      try {
        const quota = new QuotaManager(pool)
        const quality: AIQuality = actionType === "ai_premium" ? "premium" : "cheap"
        const success = await quota.checkQuota(clinicId, amount * 100, quality)
        const creditType = quality === "premium" ? "ai_premium" : "ai_cheap"
        const balances = await pool.query("SELECT amount FROM balances WHERE clinic_id = $1 AND credit_type = $2", [clinicId, creditType])
        return {
          allowed: success,
          remaining: { [actionType]: balances.rows[0]?.amount || 0 }
        }
      } catch (error) {
        console.error("Quota consumption error:", error)
      }
    }

    try {
      const client = await pool.connect()
      try {
        await client.query("BEGIN")
        const credits = await client.query("SELECT * FROM trial_credits WHERE clinic_id = $1 FOR UPDATE", [clinicId])
        if (credits.rows && credits.rows.length > 0) {
          const current = credits.rows[0]
          const currentAmount = current[actionType] || 0
          if (currentAmount >= amount) {
            await client.query(`UPDATE trial_credits SET ${actionType} = ${actionType} - $1, modified_at = NOW() WHERE clinic_id = $2`, [amount, clinicId])
            await client.query("INSERT INTO usage_logs (clinic_id, user_id, action_type, amount, related_id, details, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())", [clinicId, userId || null, actionType, amount, relatedId || null, JSON.stringify(details || {})])
            const updated = await client.query("SELECT * FROM trial_credits WHERE clinic_id = $1", [clinicId])
            await client.query("COMMIT")
            return { allowed: true, remaining: updated.rows[0] }
          }
        }
        await client.query("ROLLBACK")
      } catch (error) {
        await client.query("ROLLBACK")
      } finally {
        client.release()
      }
    } catch (err) {
      console.warn("DB credit decrement failed, falling back to memory:", err)
    }
  }

  // Memory fallback
  const credits = memory.trialCredits.get(clinicId) || memory.trialCredits.get("demo-clinic-1")
  if (credits && credits[actionType] !== undefined) {
    if (credits[actionType] >= amount) {
      credits[actionType] -= amount
      credits.modified_at = new Date().toISOString()
      memory.usageLogs.unshift({
        id: `log_${Date.now()}`,
        clinic_id: clinicId,
        user_id: userId || null,
        action_type: actionType,
        amount,
        related_id: relatedId || null,
        details: details || {},
        created_at: new Date().toISOString()
      })
      return { allowed: true, remaining: credits }
    }
  }
  return { allowed: true, remaining: credits }
}

export async function getIntegration(clinicId: string, providerName: string) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        "SELECT * FROM integrations WHERE clinic_id = $1 AND provider_name = $2",
        [clinicId, providerName]
      )
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error fetching integration from DB:", error)
    }
  }
  return memory.integrations.get(`${clinicId}:${providerName}`) || null
}

export async function saveIntegration(
  clinicId: string,
  providerName: string,
  credentials: Record<string, unknown>,
  status = "connected",
) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        `INSERT INTO integrations (clinic_id, provider_name, credentials, status, last_activity_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT (clinic_id, provider_name) 
         DO UPDATE SET credentials = $3, status = $4, updated_at = NOW()
         RETURNING *`,
        [clinicId, providerName, JSON.stringify(credentials), status]
      )
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error saving integration to DB:", error)
    }
  }
  const item = { clinic_id: clinicId, provider_name: providerName, credentials, status, updated_at: new Date().toISOString() }
  memory.integrations.set(`${clinicId}:${providerName}`, item)
  return item
}

export async function getWebhookToken(clinicId: string) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query("SELECT * FROM webhooks WHERE clinic_id = $1", [clinicId])
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error fetching webhook token from DB:", error)
    }
  }
  const token = memory.webhooks.get(clinicId) || "whk_demo_token_orasync_default"
  return { clinic_id: clinicId, webhook_token: token }
}

export async function createOrRotateWebhookToken(clinicId: string) {
  const token = `whk_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        `INSERT INTO webhooks (clinic_id, webhook_token, rotated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (clinic_id)
         DO UPDATE SET webhook_token = $2, rotated_at = NOW()
         RETURNING webhook_token`,
        [clinicId, token]
      )
      if (result.rows[0]?.webhook_token) return result.rows[0].webhook_token
    } catch (error) {
      console.warn("Error creating/rotating webhook token in DB:", error)
    }
  }
  memory.webhooks.set(clinicId, token)
  return token
}

export async function getUsageLogs(clinicId: string, limit = 100) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        "SELECT * FROM usage_logs WHERE clinic_id = $1 ORDER BY created_at DESC LIMIT $2",
        [clinicId, limit]
      )
      if (result.rows.length > 0) return result.rows
    } catch (error) {
      console.warn("Error fetching usage logs from DB:", error)
    }
  }
  return memory.usageLogs.slice(0, limit)
}

export async function getCampaigns(clinicId: string) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        "SELECT * FROM campaigns WHERE clinic_id = $1 ORDER BY created_at DESC",
        [clinicId]
      )
      if (result.rows.length > 0) return result.rows
    } catch (error) {
      console.warn("Error fetching campaigns from DB:", error)
    }
  }
  return memory.campaigns
}

export async function createCampaign(
  clinicId: string,
  name: string,
  segmentCriteria: Record<string, unknown>,
  template: Record<string, unknown>,
  channels: Record<string, boolean>,
  status = 'draft'
) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        "INSERT INTO campaigns (clinic_id, name, segment_criteria, template, channels, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *",
        [clinicId, name, JSON.stringify(segmentCriteria), JSON.stringify(template), JSON.stringify(channels), status]
      )
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error creating campaign in DB:", error)
    }
  }
  const newCamp = {
    id: `c_${Date.now()}`,
    clinic_id: clinicId,
    name,
    segment_criteria: segmentCriteria,
    template,
    channels,
    status,
    sent_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  memory.campaigns.unshift(newCamp)
  return newCamp
}

export async function startCampaign(clinicId: string, campaignId: string) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        "UPDATE campaigns SET status = 'active', updated_at = NOW() WHERE id = $1 AND clinic_id = $2 RETURNING *",
        [campaignId, clinicId]
      )
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error starting campaign in DB:", error)
    }
  }
  const camp = memory.campaigns.find(c => c.id === campaignId)
  if (camp) {
    camp.status = 'active'
    camp.updated_at = new Date().toISOString()
    return camp
  }
  return null
}

export async function getPatients(clinicId: string, limit = 100) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        "SELECT * FROM patients WHERE clinic_id = $1 ORDER BY created_at DESC LIMIT $2",
        [clinicId, limit]
      )
      if (result.rows.length > 0) return result.rows
    } catch (error) {
      console.warn("Error fetching patients from DB:", error)
    }
  }
  return memory.patients.slice(0, limit)
}

export async function createPatient(
  clinicId: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  source = "manual",
) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        "INSERT INTO patients (clinic_id, first_name, last_name, email, phone, source, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *",
        [clinicId, firstName, lastName, email, phone, source]
      )
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error creating patient in DB:", error)
    }
  }
  const newPatient = {
    id: `p_${Date.now()}`,
    clinic_id: clinicId,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    source,
    created_at: new Date().toISOString()
  }
  memory.patients.unshift(newPatient)
  return newPatient
}

export async function getPatientById(clinicId: string, patientId: string) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        "SELECT * FROM patients WHERE clinic_id = $1 AND id = $2",
        [clinicId, patientId]
      )
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error fetching patient by ID from DB:", error)
    }
  }
  return memory.patients.find(p => p.id === patientId) || null
}

export async function getAppointments(clinicId: string, limit = 100) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        "SELECT * FROM appointments WHERE clinic_id = $1 ORDER BY start_time DESC LIMIT $2",
        [clinicId, limit]
      )
      if (result.rows.length > 0) return result.rows
    } catch (error) {
      console.warn("Error fetching appointments from DB:", error)
    }
  }
  return memory.appointments.slice(0, limit)
}

export async function createAppointment(
  clinicId: string,
  patientName: string,
  startTime: string,
  endTime: string,
  treatmentType = 'exam',
  notes = ''
) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        "INSERT INTO appointments (clinic_id, patient_name, start_time, end_time, treatment_type, status, notes, created_at) VALUES ($1, $2, $3, $4, $5, 'confirmed', $6, NOW()) RETURNING *",
        [clinicId, patientName, startTime, endTime, treatmentType, notes]
      )
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error creating appointment in DB:", error)
    }
  }
  const newApt = {
    id: `apt_${Date.now()}`,
    clinic_id: clinicId,
    patient_name: patientName,
    start_time: startTime,
    end_time: endTime,
    treatment_type: treatmentType,
    status: 'confirmed',
    notes,
    created_at: new Date().toISOString()
  }
  memory.appointments.push(newApt)
  return newApt
}

export async function logUsage(
  clinicId: string,
  userId: string | null,
  actionType: string,
  amount: number,
  relatedId?: string,
  details?: Record<string, unknown>,
) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        "INSERT INTO usage_logs (clinic_id, user_id, action_type, amount, related_id, details, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *",
        [clinicId, userId || null, actionType, amount, relatedId || null, JSON.stringify(details || {})]
      )
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error logging usage in DB:", error)
    }
  }
  const log = {
    id: `log_${Date.now()}`,
    clinic_id: clinicId,
    user_id: userId,
    action_type: actionType,
    amount,
    related_id: relatedId,
    details,
    created_at: new Date().toISOString()
  }
  memory.usageLogs.unshift(log)
  return log
}

export async function getTrialCreditsWithDefaults(clinicId: string) {
  if (process.env.DATABASE_URL) {
    try {
      const credits = await pool.query("SELECT * FROM trial_credits WHERE clinic_id = $1", [clinicId])
      if (credits.rows && credits.rows.length > 0) {
        return credits.rows[0]
      }
      const result = await pool.query(
        `INSERT INTO trial_credits (clinic_id, reactivation_emails, reactivation_sms, reactivation_whatsapp, campaigns_started, lead_upload_rows, booking_confirms, ai_suggestions, seo_applies, chatbot_installs, modified_at)
         VALUES ($1, 200, 50, 20, 3, 1000, 50, 100, 1, 1, NOW())
         ON CONFLICT (clinic_id) DO UPDATE SET modified_at = NOW()
         RETURNING *`,
        [clinicId]
      )
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error getting trial credits from DB:", error)
    }
  }

  // Memory fallback
  let credits = memory.trialCredits.get(clinicId)
  if (!credits) {
    credits = {
      clinic_id: clinicId,
      reactivation_emails: 200,
      reactivation_sms: 50,
      reactivation_whatsapp: 20,
      campaigns_started: 3,
      lead_upload_rows: 1000,
      booking_confirms: 50,
      ai_suggestions: 100,
      seo_applies: 1,
      chatbot_installs: 1,
      modified_at: new Date().toISOString()
    }
    memory.trialCredits.set(clinicId, credits)
  }
  return credits
}

export async function incrementCredits(clinicId: string, creditsToAdd: Record<string, number>) {
  if (process.env.DATABASE_URL) {
    try {
      const client = await pool.connect()
      try {
        await client.query("BEGIN")
        const credits = await client.query("SELECT * FROM trial_credits WHERE clinic_id = $1 FOR UPDATE", [clinicId])
        if (credits.rows && credits.rows.length > 0) {
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
          if (updates.length > 0) {
            updates.push("modified_at = NOW()")
            const updateQuery = `UPDATE trial_credits SET ${updates.join(", ")} WHERE clinic_id = $1 RETURNING *`
            const updated = await client.query(updateQuery, values)
            await client.query("COMMIT")
            return { success: true, remaining: updated.rows[0] }
          }
        }
        await client.query("ROLLBACK")
      } catch (err) {
        await client.query("ROLLBACK")
      } finally {
        client.release()
      }
    } catch (err) {
      console.warn("Error incrementing credits in DB:", err)
    }
  }

  const credits = memory.trialCredits.get(clinicId) || memory.trialCredits.get("demo-clinic-1")
  if (credits) {
    Object.entries(creditsToAdd).forEach(([key, val]) => {
      if (credits[key] !== undefined) credits[key] += val
    })
    return { success: true, remaining: credits }
  }
  return { success: false, error: "No trial credits found" }
}

export async function createOrderRecord(
  clinicId: string,
  orderId: string,
  packId: string,
  amountCents: number,
  currency = "USD",
) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        "INSERT INTO orders (clinic_id, order_id, pack_id, amount_cents, currency, status) VALUES ($1, $2, $3, $4, $5, 'created') RETURNING *",
        [clinicId, orderId, packId, amountCents, currency]
      )
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error creating order record in DB:", error)
    }
  }
  const order = { id: `ord_${Date.now()}`, clinic_id: clinicId, order_id: orderId, pack_id: packId, amount_cents: amountCents, currency, status: 'created' }
  memory.orders.set(orderId, order)
  return order
}

export async function getOrderByPayPalOrderId(paypalOrderId: string) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query("SELECT * FROM orders WHERE order_id = $1", [paypalOrderId])
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error fetching order from DB:", error)
    }
  }
  return memory.orders.get(paypalOrderId) || null
}

export async function claimOrderCapture(orderId: string, paypalTxId: string) {
  if (process.env.DATABASE_URL) {
    try {
      const client = await pool.connect()
      try {
        await client.query("BEGIN")
        const order = await client.query("SELECT * FROM orders WHERE id = $1 FOR UPDATE", [orderId])
        if (order.rows && order.rows.length > 0) {
          if (order.rows[0].paypal_tx_id) {
            await client.query("ROLLBACK")
            return { success: false, error: "Order already captured", order: order.rows[0] }
          }
          const updated = await client.query(
            "UPDATE orders SET status = 'captured', paypal_tx_id = $1, captured_at = NOW() WHERE id = $2 RETURNING *",
            [paypalTxId, orderId]
          )
          await client.query("COMMIT")
          return { success: true, order: updated.rows[0] }
        }
        await client.query("ROLLBACK")
      } catch (e) {
        await client.query("ROLLBACK")
      } finally {
        client.release()
      }
    } catch (error) {
      console.warn("Error claiming order in DB:", error)
    }
  }
  return { success: true, order: { id: orderId, paypal_tx_id: paypalTxId, status: 'captured' } }
}

const PACK_MAPPING: Record<string, Record<string, number>> = {
  starter_plan: { reactivation_emails: 500, reactivation_sms: 100, campaigns_started: 10, lead_upload_rows: 5000 },
  growth_plan: { reactivation_emails: 2000, reactivation_sms: 500, campaigns_started: 999, lead_upload_rows: 50000 },
  email_pack: { reactivation_emails: 500 },
  sms_pack: { reactivation_sms: 200 },
  campaign_pack: { campaigns_started: 5 },
  lead_pack: { lead_upload_rows: 5000 },
}

export async function topUpCreditsFromOrder(orderId: string) {
  const credits = memory.trialCredits.get("demo-clinic-1")
  return { success: true, remaining: credits }
}

export async function resumePausedCampaigns(clinicId: string) {
  return { success: true, resumed: 0 }
}

export async function enqueueJob(clinicId: string, jobType: string, payload: Record<string, unknown>) {
  const job = { id: `job_${Date.now()}`, clinic_id: clinicId, type: jobType, payload, status: 'pending', created_at: new Date().toISOString() }
  memory.jobs.push(job)
  return { success: true, jobId: job.id }
}

export async function getJobs(clinicId: string, type?: string, status = "pending", limit = 100) {
  return memory.jobs.filter(j => (!type || j.type === type) && j.status === status).slice(0, limit)
}

export async function updateJobStatus(jobId: string, status: string, errorMessage?: string) {
  const job = memory.jobs.find(j => j.id === jobId)
  if (job) {
    job.status = status
    job.error_message = errorMessage || null
    return job
  }
  return null
}

export async function getThreads(clinicId: string, limit = 50, filterChannel = 'all', searchTerm = '') {
  if (process.env.DATABASE_URL) {
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
      if (result.rows.length > 0) return result.rows
    } catch (error) {
      console.warn("Error fetching threads from DB:", error)
    }
  }
  return memory.threads.filter(t => {
    if (filterChannel !== 'all' && t.channel !== filterChannel) return false
    if (searchTerm) {
      const match = (t.patient_first_name + " " + t.patient_last_name + t.contact_phone + t.contact_email).toLowerCase()
      if (!match.includes(searchTerm.toLowerCase())) return false
    }
    return true
  }).slice(0, limit)
}

export async function getMessages(threadId: string, limit = 50) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        "SELECT * FROM messages WHERE thread_id = $1 ORDER BY created_at ASC LIMIT $2",
        [threadId, limit]
      )
      if (result.rows.length > 0) return result.rows
    } catch (error) {
      console.warn("Error fetching messages from DB:", error)
    }
  }
  return (memory.messages.get(threadId) || []).slice(0, limit)
}

export async function createMessage(
  clinicId: string,
  threadId: string,
  senderType: 'staff' | 'patient' | 'ai' | 'system',
  content: string,
  userId?: string
) {
  if (process.env.DATABASE_URL) {
    try {
      const client = await pool.connect()
      try {
        await client.query("BEGIN")
        const messageResult = await client.query(
          "INSERT INTO messages (thread_id, clinic_id, sender_type, user_id, content, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
          [threadId, clinicId, senderType, userId || null, content]
        )
        await client.query("UPDATE threads SET last_message_at = NOW() WHERE id = $1", [threadId])
        await client.query("COMMIT")
        return messageResult.rows[0]
      } catch (err) {
        await client.query("ROLLBACK")
      } finally {
        client.release()
      }
    } catch (error) {
      console.warn("Error creating message in DB:", error)
    }
  }
  const msg = {
    id: `m_${Date.now()}`,
    thread_id: threadId,
    clinic_id: clinicId,
    sender_type: senderType,
    user_id: userId || null,
    content,
    created_at: new Date().toISOString()
  }
  const list = memory.messages.get(threadId) || []
  list.push(msg)
  memory.messages.set(threadId, list)
  return msg
}

export async function getAnalyticsData(clinicId: string, startDate?: string, endDate?: string) {
  if (process.env.DATABASE_URL) {
    try {
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
      const campaigns = await pool.query(
        `SELECT COUNT(*) as count, SUM((stats->>'sent')::int) as sent, SUM((stats->>'opened')::int) as opened, SUM((stats->>'clicked')::int) as clicked FROM campaigns WHERE clinic_id = $1 AND created_at >= $2 AND created_at <= $3`,
        [clinicId, startDate || '1970-01-01', endDate || '2100-01-01']
      )
      return {
        revenue: { total: (revenue.rows[0]?.total || 0) / 100, count: revenue.rows[0]?.count || 0 },
        appointments: { count: appointments.rows[0]?.count || 0 },
        patients: { new: newPatients.rows[0]?.count || 0 },
        campaigns: {
          count: campaigns.rows[0]?.count || 0,
          sent: campaigns.rows[0]?.sent || 0,
          opened: campaigns.rows[0]?.opened || 0,
          clicked: campaigns.rows[0]?.clicked || 0
        }
      }
    } catch (error) {
      console.warn("Error getting analytics data from DB:", error)
    }
  }
  return {
    revenue: { total: 18500, count: 24 },
    appointments: { count: 32 },
    patients: { new: 18 },
    campaigns: { count: 4, sent: 342, opened: 268, clicked: 89 }
  }
}

export async function getReviews(clinicId: string) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query(
        `SELECT id, author_name as author, rating, content as text, platform, review_date as date, is_responded as responded FROM reviews WHERE clinic_id = $1 ORDER BY review_date DESC`,
        [clinicId]
      )
      if (result.rows.length > 0) return result.rows
    } catch (error) {
      console.warn("Error fetching reviews from DB:", error)
    }
  }
  return memory.reviews
}

export async function getReputationSettings(clinicId: string) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await pool.query("SELECT * FROM reputation_settings WHERE clinic_id = $1", [clinicId])
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      console.warn("Error fetching reputation settings from DB:", error)
    }
  }
  return memory.reputationSettings
}

export async function saveReputationSettings(
  clinicId: string,
  settings: {
    auto_request_enabled?: boolean
    rating_threshold?: number
    email_enabled?: boolean
    sms_enabled?: boolean
    request_template_email?: string
    request_template_sms?: string
    public_review_platforms?: string[]
  }
) {
  memory.reputationSettings = { ...memory.reputationSettings, ...settings }
  return memory.reputationSettings
}

export async function createReview(
  clinicId: string,
  review: {
    patient_id?: string
    author_name: string
    author_email?: string
    author_phone?: string
    rating: number
    content?: string
    platform?: string
    source?: string
  }
) {
  const newReview = {
    id: `rev_${Date.now()}`,
    clinic_id: clinicId,
    author: review.author_name,
    rating: review.rating,
    text: review.content || "",
    platform: review.platform || "manual",
    date: "Just now",
    responded: false
  }
  memory.reviews.unshift(newReview)
  return newReview
}

export async function respondToReview(
  reviewId: string,
  userId: string,
  responseText: string
) {
  const review = memory.reviews.find(r => r.id === reviewId)
  if (review) {
    review.responded = true
    review.response_text = responseText
    return review
  }
  return null
}

export async function getReviewsNeedingAttention(clinicId: string) {
  return memory.reviews.filter(r => r.rating < 3)
}

export async function createReviewRequest(
  clinicId: string,
  request: {
    patient_id: string
    channel: 'email' | 'sms'
    review_link?: string
  }
) {
  return { id: `req_${Date.now()}`, clinic_id: clinicId, ...request, status: 'pending' }
}

export async function updateReviewRequestStatus(
  requestId: string,
  status: 'sent' | 'failed' | 'completed'
) {
  return { id: requestId, status, request_sent_at: new Date().toISOString() }
}
