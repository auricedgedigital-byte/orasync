import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { checkAndDecrementCredits } from "@/lib/db"

const sql = neon(process.env.DATABASE_URL || "")

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10)
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const body = await request.json()
    const { leads } = body

    if (!leads || !Array.isArray(leads)) {
      return NextResponse.json({ error: "Invalid leads format" }, { status: 400 })
    }

    const leadCount = leads.length

    const creditCheck = await checkAndDecrementCredits(clinicId, "lead_upload_rows", leadCount)

    if (!creditCheck.allowed) {
      return NextResponse.json(
        {
          error: "Insufficient lead upload credits",
          remaining: creditCheck.remaining,
        },
        { status: 402 },
      )
    }

    let createdCount = 0
    let updatedCount = 0

    for (const lead of leads) {
      const normalizedPhone = lead.phone ? normalizePhone(lead.phone) : null
      const normalizedEmail = lead.email ? normalizeEmail(lead.email) : null

      if (!normalizedPhone && !normalizedEmail) {
        continue
      }

      const result = await sql`
        INSERT INTO patients (clinic_id, first_name, last_name, email, phone, source, created_at)
        VALUES (${clinicId}, ${lead.first_name || ""}, ${lead.last_name || ""}, ${normalizedEmail}, ${normalizedPhone}, ${lead.source || "upload"}, NOW())
        ON CONFLICT (clinic_id, email) WHERE email IS NOT NULL
        DO UPDATE SET last_name = EXCLUDED.last_name, phone = EXCLUDED.phone
        RETURNING xmax
      `

      if (result[0]?.xmax === 0) {
        createdCount++
      } else {
        updatedCount++
      }
    }

    const n8nWebhookBase = process.env.N8N_WEBHOOK_BASE || "https://n8n.example.com"
    const apiKey = process.env.API_KEY || process.env.BACKEND_API_KEY || ""

    try {
      const sampleLead = leads[0] || {}
      await fetch(`${n8nWebhookBase}/webhook/lead-upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          clinic_id: clinicId,
          count: leadCount,
          sample_lead: sampleLead,
        }),
      })
    } catch (n8nError) {
      console.error("[v0] n8n webhook error:", n8nError)
      // Continue even if n8n fails
    }

    return NextResponse.json({
      success: true,
      created_count: createdCount,
      updated_count: updatedCount,
      remaining_credits: creditCheck.remaining,
    })
  } catch (error) {
    console.error("Lead upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
