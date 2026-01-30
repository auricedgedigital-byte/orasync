import { type NextRequest, NextResponse } from "next/server"
import { getUsageLogs, logUsage } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100", 10)

    const clinicId = params.cid
    const logs = await getUsageLogs(clinicId, limit)

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Usage logs fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const body = await request.json()
    const { user_id, action_type, amount, related_id, details } = body

    if (!action_type || !amount) {
      return NextResponse.json({ error: "Missing action_type or amount" }, { status: 400 })
    }

    const log = await logUsage(clinicId, user_id || null, action_type, amount, related_id, details)

    if (!log) {
      return NextResponse.json({ error: "Failed to log usage" }, { status: 500 })
    }

    return NextResponse.json({ success: true, log })
  } catch (error) {
    console.error("Usage log creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
