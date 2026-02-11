import { type NextRequest, NextResponse } from "next/server"
import { getCredits } from "@/lib/dashboard-data"

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

    const credits = await getCredits(clinicId)
    return NextResponse.json({ credits })
  } catch (error) {
    console.error("Credits error:", error)
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    )
  }
}
