import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { checkAndDecrementCredits } from "@/lib/db"

const sql = neon(process.env.DATABASE_URL || "")

export async function POST(request: NextRequest, { params }: { params: { cid: string; campaign_id: string } }) {
  try {
    const clinicId = params.cid
    const campaignId = params.campaign_id

    const campaigns = await sql`
      SELECT * FROM campaigns WHERE id = ${campaignId} AND clinic_id = ${clinicId}
    `

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const campaign = campaigns[0]

    const creditCheck = await checkAndDecrementCredits(clinicId, "campaigns_started", 1)

    if (!creditCheck.allowed) {
      return NextResponse.json(
        {
          error: "Insufficient campaign credits",
          remaining: creditCheck.remaining,
        },
        { status: 402 },
      )
    }

    await sql`
      UPDATE campaigns SET status = 'active', started_at = NOW() WHERE id = ${campaignId}
    `

    const n8nWebhookBase = process.env.N8N_WEBHOOK_BASE || "https://n8n.example.com"
    const apiKey = process.env.API_KEY || process.env.BACKEND_API_KEY || ""

    try {
      await fetch(`${n8nWebhookBase}/webhook/campaign-trigger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          clinic_id: clinicId,
          campaign_id: campaignId,
          campaign_name: campaign.name,
          channels: campaign.channels,
          segment_criteria: campaign.segment_criteria,
          batch_size: campaign.batch_size,
          sends_per_minute: campaign.sends_per_minute,
          drip_sequence: campaign.drip_sequence,
          a_b_test: campaign.a_b_test,
        }),
      })
    } catch (n8nError) {
      console.error("[v0] n8n webhook error:", n8nError)
      // Continue even if n8n fails - campaign is marked as active
    }

    return NextResponse.json({
      success: true,
      campaign_id: campaignId,
      status: "active",
      remaining_credits: creditCheck.remaining,
    })
  } catch (error) {
    console.error("Campaign start error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
