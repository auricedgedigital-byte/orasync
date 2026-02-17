import { type NextRequest, NextResponse } from "next/server"
import { getReviews } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
    try {
        const clinicId = params.cid
        const reviews = await getReviews(clinicId)
        return NextResponse.json({ reviews })
    } catch (error) {
        console.error("Reviews fetch error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
