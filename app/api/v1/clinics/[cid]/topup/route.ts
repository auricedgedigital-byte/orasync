import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const body = await request.json()
    const { pack_type, amount, user_id } = body

    if (!pack_type || !amount) {
      return NextResponse.json({ error: "Missing pack_type or amount" }, { status: 400 })
    }

    const creditMap: Record<string, Record<string, number>> = {
      email_pack: { reactivation_emails: 500 },
      sms_pack: { reactivation_sms: 200 },
      campaign_pack: { campaigns_started: 5 },
      lead_pack: { lead_upload_rows: 5000 },
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
    }

    const credits = creditMap[pack_type]
    if (!credits) {
      return NextResponse.json({ error: "Invalid pack type" }, { status: 400 })
    }

    const result = await sql.transaction(async (tx) => {
      for (const [creditKey, creditAmount] of Object.entries(credits)) {
        await tx`
          UPDATE trial_credits 
          SET ${creditKey} = ${creditKey} + ${creditAmount}, modified_at = NOW()
          WHERE clinic_id = ${clinicId}
        `
      }

      await tx`
        INSERT INTO usage_logs (clinic_id, user_id, action_type, amount, details, created_at)
        VALUES (${clinicId}, ${user_id || null}, ${"topup_" + pack_type}, 1, ${JSON.stringify({ pack_type, amount })}, NOW())
      `

      const updated = await tx`
        SELECT * FROM trial_credits WHERE clinic_id = ${clinicId}
      `

      return updated[0]
    })

    const n8nWebhookBase = process.env.N8N_WEBHOOK_BASE || "https://n8n.example.com"
    const apiKey = process.env.API_KEY || process.env.BACKEND_API_KEY || ""

    try {
      await fetch(`${n8nWebhookBase}/webhook/campaign-resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          clinic_id: clinicId,
          pack_type,
        }),
      })
    } catch (n8nError) {
      console.error("[v0] n8n campaign resume error:", n8nError)
    }

    return NextResponse.json({
      success: true,
      pack_type,
      remaining: result,
    })
  } catch (error) {
    console.error("Top-up error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
