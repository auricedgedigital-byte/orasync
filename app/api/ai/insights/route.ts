import { type NextRequest, NextResponse } from "next/server"
import { getAIInsights } from "@/lib/dashboard-data"

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

    const insights = await getAIInsights(clinicId)
    return NextResponse.json({ insights })
  } catch (error) {
    console.error("AI insights error:", error)
    return NextResponse.json(
      { error: "Failed to fetch AI insights" },
      { status: 500 }
    )
  }
}
