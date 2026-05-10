import { type NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("supabase") ? { rejectUnauthorized: false } : undefined,
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const practiceId = searchParams.get("practice_id")

    // Determine backend URL
    const backendUrl = process.env.AURICEDGE_CORE_URL || "https://auricedge-core.onrender.com"
    const apiKey = process.env.AURICEDGE_API_KEY

    // Fetch practice data from auricedge-core backend
    let practiceData: Record<string, unknown> = {}
    if (practiceId && apiKey) {
      try {
        const response = await fetch(`${backendUrl}/api/practices/${practiceId}`, {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(5000),
        })
        if (response.ok) {
          practiceData = await response.json()
        }
      } catch (error) {
        console.warn("Could not fetch from auricedge-core:", error)
      }
    }

    // Get audit data from local database
    const auditData = await gatherAuditData(pool)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      backend: {
        url: backendUrl,
        connected: Object.keys(practiceData).length > 0,
        practice_data: practiceData,
      },
      local_audit: auditData,
    })
  } catch (error) {
    console.error("Audit API error:", error)
    return NextResponse.json(
      { error: "Audit failed", details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      practice_name, 
      contact_email, 
      phone = null, 
      website = null, 
      specialty = null, 
      services = null,
      source = "landing_page" 
    } = body

    if (!practice_name || !contact_email) {
      return NextResponse.json(
        { error: "Practice name and contact email are required" },
        { status: 400 }
      )
    }

    // Determine backend URL
    const backendUrl = process.env.AURICEDGE_CORE_URL || "https://auricedge-core.onrender.com"
    const apiKey = process.env.AURICEDGE_API_KEY

    // Forward audit data to auricedge-core backend
    if (apiKey) {
      try {
        const response = await fetch(`${backendUrl}/api/audit/submit`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            practice_name,
            contact_email,
            phone,
            website,
            specialty,
            services,
            source,
            submitted_at: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(10000),
        })

        if (response.ok) {
          const result = await response.json()
          return NextResponse.json({
            success: true,
            message: "Audit submitted successfully",
            audit_id: result.audit_id,
            next_steps: result.next_steps,
          })
        }
      } catch (error) {
        console.warn("Could not submit to auricedge-core:", error)
      }
    }

    // Fallback: Save locally
    const client = await pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO audit_submissions 
         (practice_name, contact_email, phone, website, specialty, services, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending')
         RETURNING id`,
        [practice_name, contact_email, phone, website, specialty, JSON.stringify(services || [])]
      )

      return NextResponse.json({
        success: true,
        message: "Audit submitted (local fallback)",
        audit_id: result.rows[0]?.id,
        next_steps: ["Review your practice data", "Schedule a consultation"],
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Audit submission error:", error)
    return NextResponse.json(
      { error: "Audit submission failed", details: (error as Error).message },
      { status: 500 }
    )
  }
}

async function gatherAuditData(poolInstance: Pool) {
  const audit = {
    database_connected: false,
    tables: {
      leads: { exists: false, count: 0 },
      campaigns: { exists: false, count: 0 },
      patients: { exists: false, count: 0 },
      appointments: { exists: false, count: 0 },
      orders: { exists: false, count: 0 },
      trial_credits: { exists: false, count: 0 },
    },
    api_endpoints: [] as string[],
    credit_system: {
      initialized: false,
      sample_credits: null as Record<string, number> | null,
    },
  }

  try {
    // Test database connection
    await poolInstance.query("SELECT 1")
    audit.database_connected = true

    // Check tables
    const tables = ["leads", "campaigns", "patients", "appointments", "orders", "trial_credits"]
    for (const table of tables) {
      try {
        const countResult = await poolInstance.query(`SELECT COUNT(*) FROM ${table}`)
        audit.tables[table as keyof typeof audit.tables] = {
          exists: true,
          count: parseInt(countResult.rows[0]?.count || "0"),
        }
      } catch {
        audit.tables[table as keyof typeof audit.tables] = {
          exists: false,
          count: 0,
        }
      }
    }

    // Check trial_credits sample
    if (audit.tables.trial_credits.exists) {
      try {
        const sample = await poolInstance.query(
          "SELECT * FROM trial_credits LIMIT 1"
        )
        if (sample.rows[0]) {
          audit.credit_system.initialized = true
          audit.credit_system.sample_credits = {
            reactivation_emails: sample.rows[0].reactivation_emails,
            reactivation_sms: sample.rows[0].reactivation_sms,
            campaigns_started: sample.rows[0].campaigns_started,
          }
        }
      } catch {
        // Ignore
      }
    }
  } catch (error) {
    console.warn("Audit data gathering partial failure:", error)
  }

  return audit
}
