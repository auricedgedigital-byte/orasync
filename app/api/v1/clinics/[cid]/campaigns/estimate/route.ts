import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const body = await request.json()
    const { channels } = body

    if (!channels || !Array.isArray(channels)) {
      return NextResponse.json({ error: "Missing channels array" }, { status: 400 })
    }

    // Estimate recipient count
    const recipients = await sql`
      SELECT COUNT(*) as count FROM leads WHERE clinic_id = ${clinicId}
    `

    const recipientCount = (recipients[0]?.count as number) || 0

    // Estimate credits per channel
    const estimatedCredits: Record<string, number> = {}
    channels.forEach((channel: string) => {
      const creditsPerRecipient = channel === "email" ? 1 : channel === "sms" ? 2 : channel === "whatsapp" ? 3 : 1
      estimatedCredits[channel] = recipientCount * creditsPerRecipient
    })

    const totalCreditsNeeded = Object.values(estimatedCredits).reduce((a, b) => a + b, 0)

    return NextResponse.json({
      success: true,
      recipient_count: recipientCount,
      estimated_credits: estimatedCredits,
      total_credits_needed: totalCreditsNeeded,
    })
  } catch (error) {
    console.error("Campaign estimate error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
