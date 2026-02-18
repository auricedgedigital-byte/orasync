import { type NextRequest, NextResponse } from "next/server"
import { checkAndDecrementCredits, createReviewRequest, updateReviewRequestStatus, getReputationSettings } from "@/lib/db"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("supabase") ? { rejectUnauthorized: false } : undefined,
})

async function getPatient(patientId: string) {
  const result = await pool.query(
    'SELECT * FROM patients WHERE id = $1',
    [patientId]
  )
  return result.rows[0] || null
}

async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  const DEMO_MODE = process.env.DEMO_MODE === 'true'
  
  if (!to || DEMO_MODE) {
    console.log(`[DEMO] Email would be sent to: ${to}`)
    return true
  }
  
  console.log(`[EMAIL] Would send to: ${to}, subject: ${subject}`)
  return true
}

async function sendSMS(to: string, body: string): Promise<boolean> {
  const DEMO_MODE = process.env.DEMO_MODE === 'true'
  
  if (!to || DEMO_MODE) {
    console.log(`[DEMO] SMS would be sent to: ${to}`)
    return true
  }
  
  console.log(`[SMS] Would send to: ${to}, body: ${body}`)
  return true
}

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const body = await request.json()
    const { patient_id, channel = 'email', custom_message, user_id } = body

    if (!patient_id) {
      return NextResponse.json({ error: "Missing required field: patient_id" }, { status: 400 })
    }

    const settings = await getReputationSettings(clinicId)
    
    if (settings && !settings.auto_request_enabled) {
      return NextResponse.json({ error: "Auto review requests are disabled" }, { status: 403 })
    }

    const creditCheck = await checkAndDecrementCredits(
      clinicId,
      channel === 'sms' ? 'reactivation_sms' : 'reactivation_emails',
      channel === 'sms' ? 2 : 1,
      user_id
    )

    if (!creditCheck.allowed) {
      return NextResponse.json(
        { error: "Insufficient credits", remaining: creditCheck.remaining },
        { status: 402 }
      )
    }

    const patient = await getPatient(patient_id)
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    const reviewLink = `https://orasync.site/reviews/${clinicId}?patient=${patient_id}`
    const clinicName = "Your Dental Clinic"

    let template = channel === 'sms' 
      ? (settings?.request_template_sms || 'We\'d love your feedback! {{review_link}}')
      : (settings?.request_template_email || 'We hope you had a great experience! Would you take a moment to share your feedback?')

    const personalizedMessage = template
      .replace(/{{patient_name}}/g, patient.first_name || 'there')
      .replace(/{{clinic_name}}/g, clinicName)
      .replace(/{{review_link}}/g, reviewLink)

    const finalMessage = custom_message || personalizedMessage

    const reviewRequest = await createReviewRequest(clinicId, {
      patient_id,
      channel,
      review_link: reviewLink
    })

    let sent = false
    try {
      if (channel === 'email' && settings?.email_enabled) {
        sent = await sendEmail(
          patient.email || '',
          'We\'d love your feedback!',
          finalMessage
        )
      } else if (channel === 'sms' && settings?.sms_enabled) {
        sent = await sendSMS(
          patient.phone || '',
          finalMessage
        )
      }

      if (sent) {
        await updateReviewRequestStatus(reviewRequest.id, 'sent')
      } else {
        await updateReviewRequestStatus(reviewRequest.id, 'failed')
      }
    } catch (sendError) {
      console.error("Error sending review request:", sendError)
      await updateReviewRequestStatus(reviewRequest.id, 'failed')
    }

    return NextResponse.json({
      success: sent,
      review_request_id: reviewRequest.id,
      message: sent ? "Review request sent" : "Failed to send review request",
      remaining_credits: creditCheck.remaining
    })
  } catch (error) {
    console.error("Review request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
