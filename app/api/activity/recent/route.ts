import { type NextRequest, NextResponse } from "next/server"
import { getRecentActivity } from "@/lib/dashboard-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clinicId = searchParams.get("clinicId")
    const limit = parseInt(searchParams.get("limit") || "10")

    if (!clinicId) {
      return NextResponse.json(
        { error: "Clinic ID required" },
        { status: 400 }
      )
    }

    const activities = await getRecentActivity(clinicId, limit)
    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Recent activity error:", error)
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    )
  }
}
