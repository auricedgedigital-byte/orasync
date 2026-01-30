import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "test_client_id"
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || "test_secret"
const PAYPAL_API_URL = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com"

async function getPayPalAccessToken() {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64")

    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("[v0] PayPal token error:", error)
    return null
  }
}

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const body = await request.json()
    const { order_id, pack_type, user_id } = body

    if (!order_id || !pack_type) {
      return NextResponse.json({ error: "Missing order_id or pack_type" }, { status: 400 })
    }

    const clinicId = params.cid
    const accessToken = await getPayPalAccessToken()

    if (!accessToken) {
      return NextResponse.json({ error: "Failed to authenticate with PayPal" }, { status: 500 })
    }

    const response = await fetch(`${PAYPAL_API_URL}/v1/checkout/orders/${order_id}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    const captureData = await response.json()

    if (!response.ok || captureData.status !== "COMPLETED") {
      console.error("[v0] PayPal capture error:", captureData)
      return NextResponse.json({ error: "Payment capture failed" }, { status: 500 })
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
        VALUES (${clinicId}, ${user_id || null}, ${"paypal_purchase_" + pack_type}, 1, ${JSON.stringify({
          pack_type,
          order_id,
          transaction_id: captureData.id,
        })}, NOW())
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
      transaction_id: captureData.id,
      remaining: result,
    })
  } catch (error) {
    console.error("PayPal capture error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
