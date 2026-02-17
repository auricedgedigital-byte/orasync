import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    // Logic for Twilio webhook callback
    // This will handle incoming messages and status callbacks
    const body = await req.formData()
    const from = body.get("From")
    const text = body.get("Body")

    console.log(`Received Twilio message from ${from}: ${text}`)

    return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
        headers: { "Content-Type": "text/xml" }
    })
}
