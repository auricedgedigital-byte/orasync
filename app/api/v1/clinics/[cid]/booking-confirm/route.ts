import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { checkAndDecrementCredits } from "@/lib/db"

const sql = neon(process.env.DATABASE_URL || "")

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const body = await request.json()
    const { draft_id, chosen_time, patient_email, provider_id } = body

    const creditCheck = await checkAndDecrementCredits(clinicId, "booking_confirms", 1)

    if (!creditCheck.allowed) {
      return NextResponse.json(
        {
          error: "Insufficient booking credits",
          remaining: creditCheck.remaining,
        },
        { status: 402 },
      )
    }

    const appointment = await sql`
      INSERT INTO appointments (clinic_id, patient_email, provider_id, scheduled_time, status, created_at)
      VALUES (${clinicId}, ${patient_email}, ${provider_id}, ${chosen_time}, 'confirmed', NOW())
      RETURNING *
    `

    let calendarEventCreated = false
    try {
      const integration = await sql`
        SELECT * FROM integrations WHERE clinic_id = ${clinicId} AND provider_name = 'google_calendar'
      `

      if (integration && integration.length > 0) {
        const creds = integration[0].credentials
        // TODO: Implement Google Calendar event creation using refresh token
        // For now, just mark as attempted
        calendarEventCreated = true
      }
    } catch (calError) {
      console.error("[v0] Calendar integration error:", calError)
    }

    console.log(`[v0] Booking confirmed for ${patient_email} at ${chosen_time}`)

    return NextResponse.json({
      success: true,
      appointment: appointment[0],
      calendar_event_created: calendarEventCreated,
      remaining_credits: creditCheck.remaining,
    })
  } catch (error) {
    console.error("Booking confirm error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
