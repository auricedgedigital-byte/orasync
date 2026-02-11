import { type NextRequest, NextResponse } from "next/server"
import { claimOrderCapture, topUpCreditsFromOrder, getOrderByPayPalOrderId, resumePausedCampaigns } from "@/lib/db"

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "test_client_id"
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || "test_secret"
const PAYPAL_API_URL = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com"

async function getPayPalAccessToken() {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64")

    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("[v0] PayPal token error:", error)
    return null
  }
}

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const body = await request.json()
    const { order_id, pack_type, user_id } = body

    if (!order_id || !pack_type) {
      return NextResponse.json({ error: "Missing order_id or pack_type" }, { status: 400 })
    }

    const clinicId = params.cid

    // Get internal order record using PayPal order ID
    const orderRecord = await getOrderByPayPalOrderId(order_id)
    if (!orderRecord) {
      console.error(`[v0] Internal order record not found for PayPal order: ${order_id}`)
      // In production we might want to auto-create it if we trust the receipt, 
      // but for now we expect it to be pre-created by the frontend's create-order step.
      return NextResponse.json({ error: "Order record not found" }, { status: 404 })
    }

    const accessToken = await getPayPalAccessToken()
    if (!accessToken) {
      return NextResponse.json({ error: "Failed to authenticate with PayPal" }, { status: 500 })
    }

    // Attempt to capture on PayPal
    const response = await fetch(`${PAYPAL_API_URL}/v1/checkout/orders/${order_id}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    const captureData = await response.json()

    if (!response.ok || captureData.status !== "COMPLETED") {
      console.error("[v0] PayPal capture error:", captureData)
      return NextResponse.json({ error: "Payment capture failed" }, { status: 500 })
    }

    const paypalTxId = captureData.id || captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id

    // 1. Claim the order record (Idempotent)
    const claim = await claimOrderCapture(orderRecord.id, paypalTxId)
    if (!claim.success && claim.error !== "Order already captured") {
      return NextResponse.json({ error: claim.error }, { status: 500 })
    }

    if (!claim.success && claim.error === "Order already captured") {
      return NextResponse.json({
        success: true,
        pack_type,
        transaction_id: paypalTxId,
        message: "Order already processed",
      })
    }

    // 2. Top up credits
    const topup = await topUpCreditsFromOrder(orderRecord.id)
    if (!topup.success) {
      return NextResponse.json({ error: topup.error }, { status: 500 })
    }

    // 3. Resume paused campaigns (if any)
    try {
      await resumePausedCampaigns(clinicId)
    } catch (resError) {
      console.error("[v0] Failed to resume campaigns after top-up:", resError)
    }

    // 4. Notify n8n for additional automation
    const n8nWebhookBase = process.env.N8N_WEBHOOK_BASE || "https://n8n.example.com"
    const apiKey = process.env.API_KEY || process.env.BACKEND_API_KEY || ""

    try {
      await fetch(`${n8nWebhookBase}/webhook/campaign-resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          clinic_id: clinicId,
          pack_type,
          order_id,
          transaction_id: paypalTxId,
        }),
      })
    } catch (n8nError) {
      console.error("[v0] n8n campaign resume error:", n8nError)
    }

    return NextResponse.json({
      success: true,
      pack_type,
      transaction_id: paypalTxId,
      remaining: topup.remaining,
    })
  } catch (error) {
    console.error("PayPal capture error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
