import { type NextRequest, NextResponse } from "next/server"
import { checkAndDecrementCredits, logUsage } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const body = await request.json()
    const { count = 1, context = "", user_id } = body

    const creditCheck = await checkAndDecrementCredits(clinicId, "ai_suggestions", count, user_id)

    if (!creditCheck.allowed) {
      return NextResponse.json(
        {
          error: "Insufficient AI suggestion credits",
          remaining: creditCheck.remaining,
        },
        { status: 402 },
      )
    }

    const suggestions = [
      "Follow up with patients who haven't visited in 6 months",
      "Send appointment reminders 24 hours before scheduled visits",
      "Offer special promotions to patients with overdue cleanings",
      "Request reviews from recently treated patients",
      "Remind patients about preventive care benefits",
    ].slice(0, count)

    // Log the AI suggestion usage
    await logUsage(clinicId, user_id || null, "ai_suggestions", count, undefined, { context })

    return NextResponse.json({
      success: true,
      suggestions,
      remaining_credits: creditCheck.remaining,
    })
  } catch (error) {
    console.error("AI suggest error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
