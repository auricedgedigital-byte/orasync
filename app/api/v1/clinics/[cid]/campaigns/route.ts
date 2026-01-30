import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const body = await request.json()
    const { name, segment_criteria, channels, batch_size, sends_per_minute, drip_sequence, a_b_test } = body

    if (!name || !channels) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const clinicId = params.cid

    const result = await sql`
      INSERT INTO campaigns (clinic_id, name, segment_criteria, channels, batch_size, sends_per_minute, drip_sequence, a_b_test, status, created_at)
      VALUES (${clinicId}, ${name}, ${JSON.stringify(segment_criteria || {})}, ${JSON.stringify(channels)}, ${batch_size || 100}, ${sends_per_minute || 10}, ${JSON.stringify(drip_sequence || [])}, ${a_b_test || false}, 'draft', NOW())
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Campaign creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid

    const campaigns = await sql`
      SELECT * FROM campaigns WHERE clinic_id = ${clinicId} ORDER BY created_at DESC
    `

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error("Campaign fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
