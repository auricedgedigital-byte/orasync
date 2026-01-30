import { type NextRequest, NextResponse } from "next/server"

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
    const { pack_type, amount, currency = "USD" } = body

    if (!pack_type || !amount) {
      return NextResponse.json({ error: "Missing pack_type or amount" }, { status: 400 })
    }

    const accessToken = await getPayPalAccessToken()
    if (!accessToken) {
      return NextResponse.json({ error: "Failed to authenticate with PayPal" }, { status: 500 })
    }

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
          description: `Orasync ${pack_type} - Credits Purchase`,
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/billing-finance?success=true&pack=${pack_type}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/billing-finance?cancelled=true`,
      },
    }

    const response = await fetch(`${PAYPAL_API_URL}/v1/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    const order = await response.json()

    if (!response.ok) {
      console.error("[v0] PayPal order creation error:", order)
      return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      approval_link: order.links.find((link: { rel: string }) => link.rel === "approve")?.href,
    })
  } catch (error) {
    console.error("PayPal order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
