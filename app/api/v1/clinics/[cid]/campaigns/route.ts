import { type NextRequest, NextResponse } from "next/server"
import { getCampaigns, createCampaign } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const body = await request.json()
    const { name, segment_criteria, channels, batch_size, sends_per_minute, drip_sequence, a_b_test, status = 'draft' } = body

    if (!name || !channels) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const clinicId = params.cid

    // Transform UI payload to DB schema (020)
    // channels in UI is string[], but DB wants Record<string, boolean> or similar JSONB
    const channelsMap: Record<string, boolean> = {}
    if (Array.isArray(channels)) {
      channels.forEach((c: string) => { channelsMap[c] = true })
    }

    // template in DB can hold the drip sequence and other config
    const template = {
      drip_sequence: drip_sequence || [],
      a_b_test: a_b_test || false,
      batch_size: batch_size || 100,
      sends_per_minute: sends_per_minute || 50
    }

    const result = await createCampaign(
      clinicId,
      name,
      segment_criteria || {},
      template,
      channelsMap,
      status
    )

    if (!result) {
      return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Campaign creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const campaigns = await getCampaigns(clinicId)
    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error("Campaign fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
