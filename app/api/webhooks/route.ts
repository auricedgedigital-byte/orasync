import { type NextRequest, NextResponse } from "next/server"

// Webhook secret from environment variables
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "whk_live_abc123def456ghi789jkl012mno345"

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const crypto = require("crypto")
  const hash = crypto.createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex")
  return hash === signature
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-webhook-signature")
    const body = await request.text()

    if (!signature || !verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Handle different webhook events
    switch (event.type) {
      case "lead-upload":
        // Process lead upload from n8n or external source
        console.log("[Webhook] Lead uploaded:", event.data)
        break
      case "campaign-trigger":
        // Trigger campaign from n8n automation
        console.log("[Webhook] Campaign triggered:", event.data)
        break
      case "inbound-message":
        // Handle inbound messages from Twilio/WhatsApp
        console.log("[Webhook] Inbound message:", event.data)
        break
      case "appointment-booked":
        // Handle appointment booking events
        console.log("[Webhook] Appointment booked:", event.data)
        break
      case "payment-received":
        // Handle payment events from Stripe
        console.log("[Webhook] Payment received:", event.data)
        break
      default:
        console.log("[Webhook] Unknown event type:", event.type)
    }

    return NextResponse.json({ success: true, eventId: event.id })
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
