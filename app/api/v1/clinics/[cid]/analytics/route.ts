import { type NextRequest, NextResponse } from "next/server"
import { getAnalyticsData } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
    try {
        const clinicId = params.cid
        const searchParams = request.nextUrl.searchParams
        const startDate = searchParams.get("from") || new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()
        const endDate = searchParams.get("to") || new Date().toISOString()

        const data = await getAnalyticsData(clinicId, startDate, endDate)

        if (!data) {
            return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Analytics fetch error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
