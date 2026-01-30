import { type NextRequest, NextResponse } from "next/server"
import { createOrRotateWebhookToken } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const newToken = await createOrRotateWebhookToken(clinicId)

    if (!newToken) {
      return NextResponse.json({ error: "Failed to rotate token" }, { status: 500 })
    }

    return NextResponse.json({
      webhook_token: newToken,
      masked_token: `${newToken.substring(0, 10)}...${newToken.substring(newToken.length - 4)}`,
    })
  } catch (error) {
    console.error("Webhook rotation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
