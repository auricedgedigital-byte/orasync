import { type NextRequest, NextResponse } from "next/server"
import { getOrderByPayPalOrderId, claimOrderCapture, topUpCreditsFromOrder, resumePausedCampaigns } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_type, resource } = body

    if (event_type === "CHECKOUT.ORDER.COMPLETED") {
      const paypalOrderId = resource.id
      const order = await getOrderByPayPalOrderId(paypalOrderId)

      if (!order) {
        console.log("[v0] Order not found in webhook:", paypalOrderId)
        return NextResponse.json({ success: true })
      }

      // Claim capture
      const claimResult = await claimOrderCapture(
        order.id,
        resource.purchase_units?.[0]?.payments?.captures?.[0]?.id || "",
      )
      if (claimResult.success) {
        // Top up credits
        await topUpCreditsFromOrder(order.id)
        // Resume campaigns
        await resumePausedCampaigns(order.clinic_id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PayPal webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
