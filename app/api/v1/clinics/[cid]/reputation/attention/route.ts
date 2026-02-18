import { type NextRequest, NextResponse } from "next/server"
import { getReviewsNeedingAttention } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const reviews = await getReviewsNeedingAttention(clinicId)
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Fetch attention reviews error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
