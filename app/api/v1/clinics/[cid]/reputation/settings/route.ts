import { type NextRequest, NextResponse } from "next/server"
import { getReputationSettings, saveReputationSettings } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const settings = await getReputationSettings(clinicId)
    
    if (!settings) {
      return NextResponse.json({
        auto_request_enabled: true,
        rating_threshold: 3,
        email_enabled: true,
        sms_enabled: true,
        request_template_email: 'We hope you had a great experience! Would you take a moment to share your feedback?',
        request_template_sms: 'We\'d love your feedback! {{review_link}}',
        public_review_platforms: ['google', 'facebook']
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Get reputation settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const body = await request.json()
    
    const {
      auto_request_enabled,
      rating_threshold,
      email_enabled,
      sms_enabled,
      request_template_email,
      request_template_sms,
      public_review_platforms
    } = body

    const settings = await saveReputationSettings(clinicId, {
      auto_request_enabled,
      rating_threshold,
      email_enabled,
      sms_enabled,
      request_template_email,
      request_template_sms,
      public_review_platforms
    })

    if (!settings) {
      return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      settings
    })
  } catch (error) {
    console.error("Save reputation settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
