import { type NextRequest, NextResponse } from "next/server"

const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET || "n8n_secret_key"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify n8n webhook signature if needed
    const signature = request.headers.get("x-n8n-signature")
    if (signature && signature !== N8N_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid n8n signature" }, { status: 401 })
    }

    // Process n8n workflow trigger
    console.log("[n8n Webhook] Workflow triggered:", body)

    // Handle n8n automation events
    if (body.workflowId) {
      // Execute workflow logic
      console.log("[n8n] Executing workflow:", body.workflowId)
    }

    return NextResponse.json({ success: true, processed: true })
  } catch (error) {
    console.error("[n8n Webhook] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
