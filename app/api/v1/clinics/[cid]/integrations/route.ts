import { type NextRequest, NextResponse } from "next/server"
import { saveIntegration, getIntegration } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const body = await request.json()
    const { provider_name, credentials, status } = body

    if (!provider_name || !credentials) {
      return NextResponse.json({ error: "Missing provider_name or credentials" }, { status: 400 })
    }

    const clinicId = params.cid
    const result = await saveIntegration(clinicId, provider_name, credentials, status || "connected")

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Integration save error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get("provider")

    if (!provider) {
      return NextResponse.json({ error: "Missing provider parameter" }, { status: 400 })
    }

    const clinicId = params.cid
    const result = await getIntegration(clinicId, provider)

    return NextResponse.json(result || { status: "disconnected" })
  } catch (error) {
    console.error("Integration fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
