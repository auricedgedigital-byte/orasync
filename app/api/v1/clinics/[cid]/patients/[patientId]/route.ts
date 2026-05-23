import { NextRequest, NextResponse } from "next/server"
import { getPatientById } from "@/lib/db"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ cid: string; patientId: string }> }
) {
    try {
        const resolvedParams = await params
        const patient = await getPatientById(resolvedParams.cid, resolvedParams.patientId)
        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 })
        }
        return NextResponse.json(patient)
    } catch (error) {
        console.error("Error in patient API:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
