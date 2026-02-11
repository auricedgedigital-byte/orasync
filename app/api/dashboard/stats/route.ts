import { type NextRequest, NextResponse } from "next/server"
import { getDashboardStats } from "@/lib/dashboard-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clinicId = searchParams.get("clinicId")

    if (!clinicId) {
      return NextResponse.json(
        { error: "Clinic ID required" },
        { status: 400 }
      )
    }

    const stats = await getDashboardStats(clinicId)
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}
