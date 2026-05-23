import { type NextRequest, NextResponse } from "next/server"
import { startCampaign } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: Promise<{ cid: string; campaignId: string }> }) {
  try {
    const resolvedParams = await params

    const clinicId = resolvedParams.cid
    const campaignId = resolvedParams.campaignId

    const result = await startCampaign(clinicId, campaignId)

    if (!result) {
      return NextResponse.json({ error: "Failed to start campaign" }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Campaign start error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
