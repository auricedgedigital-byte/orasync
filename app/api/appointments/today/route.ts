import { type NextRequest, NextResponse } from "next/server"
import { getTodayAppointments } from "@/lib/dashboard-data"

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

    const appointments = await getTodayAppointments(clinicId)
    return NextResponse.json({ appointments })
  } catch (error) {
    console.error("Today's appointments error:", error)
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    )
  }
}
