import { type NextRequest, NextResponse } from "next/server"

const PAYPAL_API = process.env.PAYPAL_API_URL || "https://api-m.paypal.com"
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const SECRET = process.env.PAYPAL_SECRET

async function getAccessToken() {
    if (!CLIENT_ID || !SECRET) {
        throw new Error("Missing PayPal credentials")
    }

    const auth = Buffer.from(CLIENT_ID + ":" + SECRET).toString("base64")
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error_description || "Failed to get access token")
    }
    return data.access_token
}

export async function POST(request: NextRequest) {
    try {
        const { pack_type, amount } = await request.json()
        const accessToken = await getAccessToken()

        const orderPayload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    items: [
                        {
                            name: pack_type, // e.g. "email_pack" or "starter_plan"
                            description: `Orasync Credit Top-up: ${pack_type}`,
                            quantity: "1",
                            unit_amount: {
                                currency_code: "USD",
                                value: amount.toString(),
                            },
                        },
                    ],
                    amount: {
                        currency_code: "USD",
                        value: amount.toString(),
                        breakdown: {
                            item_total: {
                                currency_code: "USD",
                                value: amount.toString(),
                            },
                        },
                    },
                },
            ],
            application_context: {
                brand_name: "Orasync Dental",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`,
                cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=cancelled`,
            },
        }

        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(orderPayload),
        })

        const orderData = await response.json()

        if (!response.ok) {
            console.error("PayPal Order Error:", orderData)
            return NextResponse.json({ message: "Failed to create order", details: orderData }, { status: 500 })
        }

        const approvalLink = orderData.links.find((link: any) => link.rel === "approve")?.href

        return NextResponse.json({
            order_id: orderData.id,
            approval_link: approvalLink,
        })
    } catch (error) {
        console.error("PayPal API Error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
